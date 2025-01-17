<template>
  <div
    v-if="content"
    class="template-view"
    v-html="html"
  />
</template>

<script setup lang="ts">
import { getShikiHighlighter } from '#imports'

const props = defineProps<{
  content?: string | null
}>()

const highlighter = await getShikiHighlighter()
const html = highlighter.highlight(props.content, { lang: 'vue' })
</script>

<style scoped>
:deep(.shiki) {
  border: var(--template-view-border);
  border-radius: var(--template-view-border-radius);
  font-size: var(--template-view-font-size);
  margin: var(--template-view-margin);
  padding: var(--template-view-padding);
}
</style>
