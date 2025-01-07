<template>
  <div class="variant">
    <h2 class="variant-title">
      {{ title }}
    </h2>
    <div class="variant-content">
      <slot />
    </div>
    <TemplateView
      v-if="showTemplate"
      :content="variantTemplateCode"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStory } from '../composables/useStory'
import TemplateView from './TemplateView.vue'

defineOptions({
  name: 'StoryVariant',
})

const props = withDefaults(defineProps<{
  title: string
  showTemplate?: boolean
}>(), {
  showTemplate: true,
})

const storySlug = inject<string | undefined>('story-slug')
const { getTemplate } = useStory()
const variantTemplateCode = computed(() =>
  storySlug ? getTemplate(storySlug, props.title) : null,
)
</script>

<style scoped>
.variant-title {
  font-size: 14pt;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.variant-content {
  margin: 0.5rem 0;
}
</style>
