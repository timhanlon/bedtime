<template>
  <button
    class="bt-button copy-button"
    :class="{ copied }"
    :title="copied ? 'Copied!' : 'Copy to clipboard'"
    @click="copyToClipboard"
  >
    <Icon
      :name="copied ? 'check' : 'copy'"
      size="xs"
    />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '../elements/Icon.vue'

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
  width: 24px;
  height: 24px;
  padding: 3px;
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

.bt-icon {
  line-height: 0;
  display: block;
  width: 20px;
  height: 20px;
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
