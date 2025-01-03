import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils/e2e'
import type { StoriesModuleOptions } from '../src/module'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    stories?: StoriesModuleOptions
  }
}

describe('nuxt-stories HMR', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    // Enable browser testing and dev server with HMR
    browser: true,
    server: true,
    dev: true,
    // Ensure pages are built
    build: true,
    // Configure Nuxt
    nuxtConfig: {
      // Enable pages feature
      pages: true,
      // Configure HMR
      vite: {
        server: {
          hmr: {
            protocol: 'ws',
            host: 'localhost',
          },
        },
      },
      // Configure stories
      stories: {
        pattern: 'components/**/*.story.vue',
      },
    },
  })

  it('updates story content when file changes', async () => {
    const { url } = useTestContext()
    if (!url) throw new Error('Test URL not available')

    // Ensure URL doesn't end with a slash
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
    console.log('Base URL:', baseUrl)

    // First verify the root page works
    const { createPage } = await import('@nuxt/test-utils')
    const page = await createPage()
    await page.goto(baseUrl)
    await page.waitForLoadState('networkidle')

    // Verify root page content
    const homeContent = await page.textContent('h1')
    expect(homeContent).toContain('Welcome to Nuxt Stories Test')

    // Navigate to stories page
    const pageUrl = `${baseUrl}/stories/BaseButton`
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
