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
import { computed } from 'vue'
import { useStory } from '../composables/useStory'
import { useHead, useRoute } from '#imports'

const route = useRoute()
const { getByKebabName, getComponent } = useStory()

const story = computed(() => getByKebabName(route.params.slug as string))
const storyComponent = computed(() => getComponent(story.value))

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
