<template>
  <div class="stories-index">
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
  title: file.path
    .split('/')
    .pop()!
    .replace(/\.story\.vue$/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim(),
}))
</script>

<style scoped>
.stories-index {
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 0.75rem 0;
}

a {
  color: #3498db;
  text-decoration: none;
  font-size: 1.1rem;
}

a:hover {
  text-decoration: underline;
}
</style>
