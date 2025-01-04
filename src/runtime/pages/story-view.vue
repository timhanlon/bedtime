<template>
  <div class="story-page">
    <nav>
      <NuxtLink to="/stories">← Back to Stories</NuxtLink>
    </nav>
    <div
      v-if="story"
      class="story-content"
    >
      <component :is="storyComponent" />
    </div>
    <div
      v-else
      class="error"
    >
      Story not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { Story } from '../types'
import { useHead, useRoute } from '#imports'
import { stories as storyList } from '#nuxt-stories'

const route = useRoute()
const stories = computed<Story[]>(() => storyList)
const story = computed(() => stories.value.find(s => s.kebabName === route.params.slug))

const modules = import.meta.glob('/components/**/*.story.vue')

const storyComponent = computed(() => {
  if (!story.value?.shortPath) return null
  const importPath = '/' + story.value.shortPath
  return defineAsyncComponent(() => modules[importPath]?.())
})

useHead({
  title: story.value?.pascalName,
})
</script>

<style scoped>
.story-page {
  padding: 1rem;
}

nav {
  margin-bottom: 1rem;
}

.error {
  color: #dc2626;
  font-weight: 500;
}
</style>
