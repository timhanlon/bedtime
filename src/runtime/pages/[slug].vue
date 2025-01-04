<template>
  <div v-if="story">
    <component :is="story" />
  </div>
  <div v-else>
    <h1>Story not found</h1>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'

interface StoryFile {
  slug: string
  path: string
}

defineOptions({
  name: 'StoriesSlugPage',
})

const route = useRoute()
const config = useRuntimeConfig()

// Use Vite's glob import to get all story files
const modules = import.meta.glob<() => Promise<any>>('/components/**/*.story.vue', { eager: false })

const storyFile = computed(() =>
  config.public.stories.files.find((f: StoryFile) => f.slug === route.params.slug),
)

const story = computed(() => {
  if (!storyFile.value) return null
  const importPath = '/' + storyFile.value.path
  const importFn = modules[importPath]
  if (!importFn) return null
  return defineAsyncComponent(importFn)
})

// Watch for runtime config changes (new stories)
watch(() => config.public.stories.files, (newFiles: StoryFile[]) => {
  // Force re-evaluation of story component when files change
  if (storyFile.value) {
    const newStoryFile = newFiles.find(f => f.slug === route.params.slug)
    if (newStoryFile && newStoryFile.path !== storyFile.value.path) {
      // Story file has changed, trigger HMR
      window.location.reload()
    }
  }
}, { deep: true })
</script>
