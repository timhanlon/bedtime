import { describe, it, expect } from 'vitest'
import { extractStoryContent } from '../src/utils/template-extraction'

describe('template extraction', () => {
  describe('story without variants', () => {
    it('should extract v-for template correctly', () => {
      const template = `
        <Story>
          <div
            v-for="size in sizes"
            :key="size"
            class="mb-2"
          >
            <UBadge
              :label="\`size \${size}\`"
              :size="size"
            />
          </div>
        </Story>
      `

      const result = extractStoryContent(template, 'test.vue', 'test')
      console.log('Template content:', result.template)
      expect(result.template).toContain('v-for="size in sizes"')
      expect(result.template).toContain(':key="size"')
      expect(result.template).toContain('class="mb-2"')
      expect(result.template).toContain(':label="`size ${size}`"')
      expect(result.template).toContain(':size="size"')
      expect(Object.keys(result.variants)).toHaveLength(0)
    })

    it('should handle empty story', () => {
      const template = '<Story></Story>'
      const result = extractStoryContent(template, 'test.vue', 'test')
      expect(result.template).toBe('')
      expect(Object.keys(result.variants)).toHaveLength(0)
    })
  })

  describe('story with variants', () => {
    it('should extract variants correctly', () => {
      const template = `
        <Story>
          <Variant title="default">
            <UButton>Click me</UButton>
          </Variant>
          <Variant title="disabled">
            <UButton disabled>Can't click me</UButton>
          </Variant>
        </Story>
      `

      const result = extractStoryContent(template, 'test.vue', 'test')
      expect(result.template).toBeNull()
      expect(Object.keys(result.variants)).toHaveLength(2)
      expect((result.variants as Record<string, string>).default).toContain('<UButton>Click me</UButton>')
      expect((result.variants as Record<string, string>).disabled).toContain('<UButton disabled>Can\'t click me</UButton>')
    })

    it('should handle variant without title', () => {
      const template = `
        <Story>
          <Variant>
            <UButton>Click me</UButton>
          </Variant>
        </Story>
      `

      const result = extractStoryContent(template, 'test.vue', 'test')
      expect(result.template).toBeNull()
      expect(Object.keys(result.variants)).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle invalid template', () => {
      const template = '<div>Invalid template</div>'
      const result = extractStoryContent(template, 'test.vue', 'test')
      expect(result.template).toBeNull()
      expect(Object.keys(result.variants)).toHaveLength(0)
    })

    it('should handle missing Story component', () => {
      const template = '<div><p>No story here</p></div>'
      const result = extractStoryContent(template, 'test.vue', 'test')
      expect(result.template).toBeNull()
      expect(Object.keys(result.variants)).toHaveLength(0)
    })
  })
})
