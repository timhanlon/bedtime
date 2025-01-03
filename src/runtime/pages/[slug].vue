<template>
  <div v-if="story">
    <component :is="story" />
  </div>
  <div v-else>
    <h1>Story not found</h1>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRuntimeConfig } from '#app'

defineOptions({
  name: 'StoriesSlugPage',
})

const route = useRoute()
const config = useRuntimeConfig()

// Use Vite's glob import to get all story files
const modules = import.meta.glob('/components/**/*.story.vue')

const storyFile = computed(() =>
  config.public.stories.files.find(f => f.slug === route.params.slug),
)

const story = computed(() => {
  if (!storyFile.value) return null
  const importPath = '/' + storyFile.value.path
  const importFn = modules[importPath]
  if (!importFn) return null
  return defineAsyncComponent(importFn)
})
</script>
