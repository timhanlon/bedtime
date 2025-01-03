import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, useTestContext } from '@nuxt/test-utils/e2e'
import type { StoriesModuleOptions } from '../src/module'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    stories?: StoriesModuleOptions
  }
}

describe('nuxt-stories', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  describe('Story Component', () => {
    it('renders with title', async () => {
      const html = await $fetch('/stories/BaseButton')
      expect(html).toContain('Button Component')
    })

    it('renders content in story-content div', async () => {
      const html = await $fetch('/stories/BaseButton')
      expect(html).toContain('class="story-content"')
      expect(html).toContain('<button>Click me</button>')
    })
  })

  describe('Variant Component', () => {
    it('renders variants with names', async () => {
      const html = await $fetch('/stories/BaseButton')
      expect(html).toContain('Default')
      expect(html).toContain('Disabled')
    })

    it('renders variant content correctly', async () => {
      const html = await $fetch('/stories/BaseButton')
      expect(html).toContain('<button>Click me</button>')
      expect(html).toContain('<button disabled')
    })
  })

  describe('Stories Index Page', () => {
    it('lists all stories', async () => {
      const html = await $fetch('/stories')
      expect(html).toContain('All Stories')
      expect(html).toContain('BaseButton')
      expect(html).toContain('href="/stories/BaseButton"')
    })
  })

  describe('Story Page', () => {
    it('renders story page', async () => {
      const html = await $fetch('/stories/BaseButton')
      expect(html).toContain('Button Component')
      expect(html).toContain('Default')
      expect(html).toContain('Disabled')
    })

    it('handles non-existent story gracefully', async () => {
      const html = await $fetch('/stories/NonExistent')
      expect(html).toContain('Story not found')
    })
  })

  describe('Module Configuration', () => {
    // These tests would ideally be unit tests, but we'll use e2e for simplicity
    it('registers routes correctly', async () => {
      // Test index route exists
      const indexHtml = await $fetch('/stories')
      expect(indexHtml).toBeTruthy()

      // Test dynamic route exists
      const storyHtml = await $fetch('/stories/BaseButton')
      expect(storyHtml).toBeTruthy()
    })

    it('discovers story files', async () => {
      const html = await $fetch('/stories')
      // Should find our Button story
      expect(html).toContain('BaseButton')
    })
  })
})

// HMR tests are run in a separate file to avoid context conflicts
if (process.env.TEST_HMR) {
  describe('nuxt-stories HMR', async () => {
    await setup({
      rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
      // Enable browser testing and dev server with HMR
      browser: true,
      server: true,
      dev: true,
      nuxtConfig: {
        vite: {
          server: {
            hmr: {
              protocol: 'ws',
              host: 'localhost',
            },
          },
        },
        stories: {
          pattern: 'components/**/*.story.vue',
        },
      },
    })

    it('updates story content when file changes', async () => {
      const { url } = useTestContext()
      console.log('Test URL:', url)

      // Start a dev server for HMR testing
      const { createPage } = await import('@nuxt/test-utils')
      const page = await createPage()

      // Navigate and wait for the page to be fully loaded
      const pageUrl = `${url}/stories/BaseButton`
      console.log('Navigating to:', pageUrl)
      await page.goto(pageUrl)
      await page.waitForLoadState('networkidle')

      // Get initial content
      const initialContent = await page.textContent('.story-content')
      console.log('Initial content:', initialContent)
      expect(initialContent).toContain('Click me')

      // Modify the story file
      const storyPath = fileURLToPath(new URL('./fixtures/basic/components/BaseButton.story.vue', import.meta.url))
      console.log('Story path:', storyPath)
      const fs = await import('node:fs/promises')
      const originalContent = await fs.readFile(storyPath, 'utf-8')

      try {
        // Update the button text
        const updatedContent = originalContent.replace('Click me', 'Updated Button')
        await fs.writeFile(storyPath, updatedContent)
        console.log('File updated')

        // Wait for the HMR update to be applied
        await page.waitForFunction(
          () => {
            const content = document.querySelector('.story-content')?.textContent
            console.log('Current content:', content)
            return content && content.includes('Updated Button')
          },
          { timeout: 5000, polling: 100 },
        )

        const newContent = await page.textContent('.story-content')
        console.log('New content:', newContent)
        expect(newContent).toContain('Updated Button')
      }
      finally {
        // Restore original content and cleanup
        await fs.writeFile(storyPath, originalContent)
        await page.close()
      }
    })
  })
}
