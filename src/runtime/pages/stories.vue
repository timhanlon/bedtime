<template>
  <div class="stories-index">
    <h1>All Stories</h1>
    <ul>
      <li
        v-for="story in storyList"
        :key="story.slug"
      >
        <NuxtLink :to="'/stories/' + story.slug">
          {{ formatStoryName(story.slug) }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Story } from '../types'
import { computed, useRuntimeConfig } from '#imports'

definePageMeta({
  name: 'StoriesIndexPage',
})

const config = useRuntimeConfig()
const storyList = computed<Story[]>(() => config.public.stories?.files || [])

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
