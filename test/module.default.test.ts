import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import type { StoriesModuleOptions } from '../src/module'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    stories?: StoriesModuleOptions
  }
}

describe('nuxt-stories module with default config', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  describe('server-rendered pages', () => {
    it('renders the stories index page', async () => {
      const html = await $fetch('/stories')
      expect(html).toContain('All Stories')
      expect(html).toContain('Button')
    })

    it('renders a story page', async () => {
      const html = await $fetch('/stories/base-button-story')
      expect(html).toContain('Button Component')
      expect(html).toContain('Default')
      expect(html).toContain('Disabled')
    })

    it('handles non-existent story gracefully', async () => {
      const html = await $fetch('/stories/non-existent')
      expect(html).toContain('Story not found')
    })
  })
})
