<template>
  <div v-if="story">
    <component :is="story" />
  </div>
  <div v-else>
    <h1>Story not found</h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRuntimeConfig, defineAsyncComponent } from '#app'

defineOptions({
  name: 'StoriesSlugPage',
})

const route = useRoute()
const config = useRuntimeConfig()

const storyFile = computed(() =>
  config.public.stories.files.find(f => f.slug === route.params.slug),
)

const story = computed(() => {
  if (!storyFile.value) return null
  return defineAsyncComponent(() => import(`~/components/${storyFile.value.path}`))
})
</script>
