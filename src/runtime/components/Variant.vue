<template>
  <div
    class="variant-container"
    :class="variantStyles.container"
  >
    <slot name="title">
      <h2
        class="variant-title"
        :class="variantStyles.title"
      >
        {{ title }}
      </h2>
    </slot>
    <div
      class="variant-content"
      :class="variantStyles.content"
    >
      <slot />
    </div>
    <div
      class="variant-template"
      :class="variantStyles.template"
    >
      <slot name="template">
        <TemplateView
          v-if="showTemplate"
          :content="variantTemplateCode"
        />
      </slot>
    </div>
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
.variant-container {
  padding: var(--variant-container-padding);
}

.variant-title {
  font-size: var(--variant-title-font-size);
  font-weight: var(--variant-title-font-weight);
  letter-spacing: var(--variant-title-letter-spacing);
  border-bottom: 1px solid var(--variant-border-color);
}

.variant-content {
  & > * + * {
    margin-top: 1rem;
  }
}
</style>
