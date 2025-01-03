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

<style scoped>
.variant {
  margin: 1rem 0;
}
.variant-content {
  padding: 1rem;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style>
