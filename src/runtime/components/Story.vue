<template>
  <div class="story">
    <h1 v-if="title">
      {{ title }}
    </h1>
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
  title?: string
}>()
</script>
