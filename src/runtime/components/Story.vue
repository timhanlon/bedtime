<template>
  <div
    class="story"
    :class="storyStyles.container"
  >
    <slot name="header">
      <h1
        v-if="title"
        class="story-header"
        :class="storyStyles.header"
      >
        {{ title }}
      </h1>
    </slot>
    <div
      class="story-content"
      :class="storyStyles.content"
    >
      <slot />
    </div>
    <slot name="footer">
      <TemplateView
        v-if="showTemplate"
        :content="templateContent"
      />
    </slot>
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
const storyStyles = computed(() => config.public.bedtime?.styles?.story || {})

const route = useRoute()
const storySlug = route.params.slug as string
const { getTemplate } = useStory()
const templateContent = computed(() => getTemplate(storySlug))

// Provide story slug to variants
provide('story-slug', storySlug)
</script>

<style scoped>
.story-header {
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.story-content {
  & > * + * {
    margin-top: 1rem;
  }
}
</style>
