import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-stories', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  describe('Story Component', () => {
    it('renders with title', async () => {
      const html = await $fetch('/stories/Button_Button')
      expect(html).toContain('Button Component')
    })

    it('renders content in story-content div', async () => {
      const html = await $fetch('/stories/Button_Button')
      expect(html).toContain('class="story-content"')
      expect(html).toContain('<button>Click me</button>')
    })
  })

  describe('Variant Component', () => {
    it('renders variants with names', async () => {
      const html = await $fetch('/stories/Button_Button')
      expect(html).toContain('Default')
      expect(html).toContain('Disabled')
    })

    it('renders variant content correctly', async () => {
      const html = await $fetch('/stories/Button_Button')
      expect(html).toContain('<button>Click me</button>')
      expect(html).toContain('<button disabled')
    })
  })

  describe('Stories Index Page', () => {
    it('lists all stories', async () => {
      const html = await $fetch('/stories')
      expect(html).toContain('All Stories')
      expect(html).toContain('Button_Button')
      expect(html).toContain('href="/stories/Button_Button"')
    })
  })

  describe('Story Page', () => {
    it('renders story page', async () => {
      const html = await $fetch('/stories/Button_Button')
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
      const storyHtml = await $fetch('/stories/Button_Button')
      expect(storyHtml).toBeTruthy()
    })

    it('discovers story files', async () => {
      const html = await $fetch('/stories')
      // Should find our Button story
      expect(html).toContain('Button_Button')
    })
  })
})
