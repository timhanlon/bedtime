<template>
  <div
    v-if="content"
    class="template-view"
  >
    <pre><code>{{ content }}</code></pre>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content?: string | null
}>()
</script>

<style scoped>
.template-view {
  background-color: var(--template-view-background-color);
  border: var(--template-view-border);
  border-radius: var(--template-view-border-radius);
  margin: var(--template-view-margin);
  padding: var(--template-view-padding);
}

.template-view pre {
  font-size: var(--template-view-font-size);
  margin: 0;
  overflow-x: scroll;
  white-space: pre;
}
</style>
