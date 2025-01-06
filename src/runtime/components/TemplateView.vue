<template>
  <div
    v-if="content"
    class="template-view"
  >
    <CopyButton :content="content" />
    <pre><code>{{ content }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import CopyButton from './CopyButton.vue'

defineProps<{
  content?: string | null
}>()
</script>

<style scoped>
.template-view {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 4px;
  position: relative;
}

.template-view pre {
  margin: 0;
  white-space: pre;
  overflow-x: scroll;
  font-size: 14px;
}
</style>
