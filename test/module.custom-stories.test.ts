import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils'

describe('custom stories directory', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/custom-stories', import.meta.url)),
    browser: true,
  })

  it('finds stories in custom directory', async () => {
    const page = await createPage('/stories')
    const html = await page.innerHTML('body')
    expect(html).toContain('TestButton')
  })
})
