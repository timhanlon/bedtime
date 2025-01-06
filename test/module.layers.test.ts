import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('bedtime module with layers', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/layers/feature-b', import.meta.url)),
    browser: true,
  })

  describe('story discovery across layers', () => {
    it('finds stories from all layers', async () => {
      const html = await $fetch('/stories')
      expect(html).toContain('BaseButton')
      expect(html).toContain('FeatureAButton')
      expect(html).toContain('FeatureBButton')
    })
  })
})
