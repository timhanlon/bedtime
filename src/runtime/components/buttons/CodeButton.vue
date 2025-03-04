<template>
  <button
    class="code-button"
    :class="{ active: model }"
    :title="model ? 'Hide code' : 'Show code'"
    @click="model = !model"
  >
    <span class="code-icon bt-icon">
      <Icon
        name="code"
        size="full"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import Icon from '../elements/Icon'

defineOptions({
  name: 'StoryCodeButton',
})

const model = defineModel<boolean>()
</script>

<style scoped>
.code-button {
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

.code-button:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}

.code-button.active {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #0c4a6e;
}

.code-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
