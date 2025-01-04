import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import type { StoriesModuleOptions } from '../src/module'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    stories?: StoriesModuleOptions
  }
}

describe('nuxt-stories module with custom route', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/custom-route', import.meta.url)),
  })

  describe('server-rendered pages with custom route', () => {
    it('renders the stories index page at custom route', async () => {
      const html = await $fetch('/somewhere-else')
      expect(html).toContain('All Stories')
      expect(html).toContain('Button')
    })

    it('renders a story page at custom route', async () => {
      const html = await $fetch('/somewhere-else/base-button-story')
      expect(html).toContain('Button Component')
      expect(html).toContain('Default')
      expect(html).toContain('Disabled')
    })

    it('handles non-existent story gracefully at custom route', async () => {
      const html = await $fetch('/somewhere-else/non-existent')
      expect(html).toContain('Story not found')
    })
  })
})
