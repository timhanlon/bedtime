<template>
  <nav class="stories-nav">
    <ul>
      <li v-for="story in stories" :key="story.kebabName">
        <NuxtLink
          :to="`/stories/${story.kebabName}`"
          class="stories-nav-link"
          :class="{ active: currentStory === story.kebabName }"
        >
          {{ formatStoryName(story.pascalName) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BedtimeStory } from '../../../types/module'
import { useRoute } from '#imports'

defineOptions({
  name: 'StoriesNav',
})

defineProps<{
  stories: BedtimeStory[]
}>()

const route = useRoute()
const currentStory = computed(() => route.params.slug as string)

function formatStoryName(name: string): string {
  return name
    .replace(/Story$/, '') // Remove 'Story' suffix
    .trim()
}
</script>

<style scoped>
.stories-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stories-nav li {
  margin-top: 4px;
  margin-bottom: 4px;
}

.stories-nav-link {
  display: block;
  padding: 0.5rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.stories-nav-link:hover {
  background-color: #e5e7eb;
}

.stories-nav-link.active {
  background-color: #e5e7eb;
  font-weight: 500;
}
</style>
