<script setup lang="ts">
const { stories: storyList } = useStory()

const route = useRoute()
const slug = route.params.slug as string
const story = storyList[slug]

useHead({
  title: story?.pascalName,
})

definePageMeta({
  layout: 'custom-viewer',
})
</script>

<template>
  <component
    :is="story?.component"
  />
</template>
