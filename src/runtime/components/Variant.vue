<template>
  <div class="variant">
    <h2>{{ name }}</h2>
    <div class="variant-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StoryVariant',
})

defineProps<{
  name: string
}>()
</script>
