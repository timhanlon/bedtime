<template>
  <div>
    <h1>All Stories</h1>
    <ul>
      <li
        v-for="story in stories"
        :key="story.slug"
      >
        <NuxtLink :to="`/stories/${story.slug}`">{{ story.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app'

defineOptions({
  name: 'StoriesIndexPage',
})

const config = useRuntimeConfig()
const stories = config.public.stories.files.map(file => ({
  ...file,
  title: file.slug.replace(/_/g, ' '),
}))
</script>
