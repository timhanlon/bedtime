<template>
  <div class="stories-index">
    <h1>All Stories</h1>
    <ul>
      <li
        v-for="story in stories"
        :key="story.kebabName"
      >
        <NuxtLink :to="'/stories/' + story.kebabName">
          {{ formatStoryName(story.pascalName) }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Story } from '../types'
import { stories as storyList } from '#nuxt-stories'

console.log({
  storyList,
})

const stories = computed<Story[]>(() => storyList)

function formatStoryName(slug: string): string {
  return slug
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}
</script>

<style scoped>
.stories-index {
  padding: 1rem;
}

.stories-index ul {
  list-style: none;
  padding: 0;
}

.stories-index li {
  margin: 0.5rem 0;
}
</style>
