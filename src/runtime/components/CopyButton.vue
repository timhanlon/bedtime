<template>
  <button
    class="copy-button"
    :class="{ copied }"
    :title="copied ? 'Copied!' : 'Copy to clipboard'"
    @click="copyToClipboard"
  >
    <span
      v-if="!copied"
      class="copy-icon"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect
          x="9"
          y="9"
          width="13"
          height="13"
          rx="2"
          ry="2"
        />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </span>
    <span
      v-else
      class="check-icon"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'StoryCopyButton',
})

const props = defineProps<{
  content: string
}>()

const copied = ref(false)
let timeout: NodeJS.Timeout | null = null

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px;
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

.copy-button:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}

.copy-button.copied {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
}

.copy-icon, .check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
