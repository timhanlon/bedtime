<template>
  <div
    class="variant"
    :class="variantStyles.container"
  >
    <h2
      class="variant-title"
      :class="variantStyles.title"
    >
      {{ title }}
    </h2>
    <div
      class="variant-content"
      :class="variantStyles.content"
    >
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
import { useRuntimeConfig } from '#imports'

defineOptions({
  name: 'StoryVariant',
})

const props = withDefaults(defineProps<{
  title: string
  showTemplate?: boolean
}>(), {
  showTemplate: true,
})

const config = useRuntimeConfig()
const variantStyles = computed(() => config.public.bedtime?.styles?.variant || {})

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
