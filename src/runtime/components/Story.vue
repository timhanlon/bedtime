<template>
  <div
    class="story-container"
    :class="storyClasses.container"
  >
    <slot name="title">
      <h2
        v-if="title"
        class="story-title"
        :class="storyClasses.title"
      >
        {{ title }}
      </h2>
    </slot>
    <div
      class="story-content"
      :class="storyClasses.content"
    >
      <slot />
    </div>
    <div
      class="story-template"
      :class="storyClasses.template"
    >
      <slot name="template">
        <TemplateView
          v-if="showTemplate"
          :content="storyTemplateCode"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useStory } from '../composables/useStory'
import TemplateView from './TemplateView.vue'
import { useRoute, useRuntimeConfig } from '#imports'

defineOptions({
  name: 'StoryContainer',
})

withDefaults(defineProps<{
  title?: string
  showTemplate?: boolean
}>(), {
  showTemplate: true,
})

const config = useRuntimeConfig()
const storyClasses = config.public.bedtime?.classes?.story

const route = useRoute()
const storySlug = route.params.slug as string
const { getTemplate } = useStory()
const storyTemplateCode = computed(() => getTemplate(storySlug))

// Provide story slug to variants
provide('story-slug', storySlug)
</script>

<style scoped>
[data-bedtime-theme]:not([data-bedtime-theme='false']) {
  .story-container {
    padding: var(--story-container-padding);
    width: var(--story-container-width);
  }

  .story-title {
    font-size: var(--story-title-font-size);
    font-weight: var(--story-title-font-weight);
    letter-spacing: var(--story-title-letter-spacing);
    border-bottom: 1px solid var(--story-border-color);
  }

  .story-content {
    margin: var(--story-content-margin);
    display: var(--story-content-display);
    gap: var(--story-content-grid-gap);
    grid-template-columns: var(--story-content-grid-template-columns);
    & > * + * {
      margin-top: var(--story-content-gap);
    }
  }
}
</style>
