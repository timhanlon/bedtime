<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'StoryKey',
})

const props = defineProps<{
  symbol?: string
}>()

const isMacOS = computed(() => import.meta.client && navigator?.userAgent?.match(/Macintosh;/))

const displaySymbol = computed(() => {
  if (!props.symbol) return ''

  // Handle special keys
  switch (props.symbol.toLowerCase()) {
    case 'meta':
      return isMacOS.value ? '⌘' : 'Ctrl'
    default:
      return props.symbol
  }
})
</script>

<template>
  <span class="key">
    <slot>{{ displaySymbol }}</slot>
  </span>
</template>

<style scoped>
.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #374151;
}
</style>
