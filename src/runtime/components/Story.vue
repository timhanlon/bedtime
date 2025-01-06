<template>
  <div class="story">
    <h1 v-if="title">
      {{ title }}
    </h1>
    <div class="story-content">
      <slot />
    </div>
    <TemplateView
      v-if="showTemplate"
      :content="templateContent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useStory } from '../composables/useStory'
import TemplateView from './TemplateView.vue'
import { useRoute } from '#imports'

defineOptions({
  name: 'StoryContainer',
})

withDefaults(defineProps<{
  title?: string
  showTemplate?: boolean
}>(), {
  showTemplate: true,
})

const route = useRoute()
const storySlug = route.params.slug as string
const { getTemplate } = useStory()
const templateContent = computed(() => getTemplate(storySlug))

// Provide story slug to variants
provide('story-slug', storySlug)
</script>

<style scoped>
.story-content {
  & > * + * {
    margin-top: 1rem; /* aldi space-y-4 */
  }
}
</style>
