<template>
  <div class="story">
    <h1 v-if="title">
      {{ title }}
    </h1>
    <div class="story-content">
      <slot />
    </div>
    <div
      v-if="showTemplate && templateContent"
      class="story-template"
    >
      <pre><code>{{ templateContent }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useStory } from '../composables/useStory'
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
.story-template {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.story-template pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
