<template>
  <button
    class="open-in-editor-button"
    title="Open in editor"
  >
    <EditIcon />
  </button>
</template>

<script setup lang="ts">
import EditIcon from '../icons/EditIcon.vue'
</script>

<style scoped>
.open-in-editor-button {
  width: 24px;
  height: 24px;
  padding: 4px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.open-in-editor-button:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}
</style>
