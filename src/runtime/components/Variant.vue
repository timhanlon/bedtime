<template>
  <div class="variant">
    <h2>{{ name }}</h2>
    <div class="variant-content">
      <slot />
    </div>
    <div
      v-if="showTemplate && variantTemplateCode"
      class="variant-template"
    >
      <pre><code>{{ variantTemplateCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStory } from '../composables/useStory'

defineOptions({
  name: 'StoryVariant',
})

const props = withDefaults(defineProps<{
  name: string
  showTemplate?: boolean
}>(), {
  showTemplate: true,
})

const storySlug = inject<string | undefined>('story-slug')
const { getTemplate } = useStory()
const variantTemplateCode = computed(() =>
  storySlug ? getTemplate(storySlug, props.name) : null,
)
</script>

<style scoped>
.variant-template {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.variant-template pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
