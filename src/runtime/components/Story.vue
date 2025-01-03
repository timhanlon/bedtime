<template>
  <div class="story">
    <h1>{{ title }}</h1>
    <div class="story-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StoryContainer',
})

defineProps<{
  title: string
}>()
</script>

<style scoped>
.story {
  margin-bottom: 2rem;
}
.story-content {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
