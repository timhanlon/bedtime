<template>
  <div class="story-page">
    <nav>
      <NuxtLink to="/stories">← Back to Stories</NuxtLink>
    </nav>
    <div
      v-if="story"
      class="story-content"
    >
      <component :is="story.component" />
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
import { computed } from 'vue'
import { useStory } from '../composables/useStory'
import { useHead, useRoute } from '#imports'

const route = useRoute()
const { stories } = useStory()

const story = computed(() => stories[route.params.slug as string])

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
