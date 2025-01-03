<template>
  <div class="color-picker">
    <label
      v-if="label"
      class="color-picker__label"
    >{{ label }}</label>
    <div
      class="color-picker__preview"
      :style="{ backgroundColor: modelValue }"
      @click="showPalette = !showPalette"
    >
      <span class="color-picker__value">{{ modelValue }}</span>
    </div>
    <div
      v-if="showPalette"
      class="color-picker__palette"
    >
      <button
        v-for="color in colors"
        :key="color"
        class="color-picker__swatch"
        :style="{ backgroundColor: color }"
        :class="{ 'color-picker__swatch--selected': modelValue === color }"
        @click="$emit('update:modelValue', color)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'ColorPickerComponent',
})

defineProps<{
  modelValue: string
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPalette = ref(false)

const colors = [
  '#ff0000', // red
  '#00ff00', // green
  '#0000ff', // blue
  '#ffff00', // yellow
  '#ff00ff', // magenta
  '#00ffff', // cyan
  '#000000', // black
  '#ffffff', // white
]
</script>

<style scoped>
.color-picker {
  font-family: system-ui, sans-serif;
  position: relative;
  width: 200px;
}

.color-picker__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.color-picker__preview {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  height: 40px;
}

.color-picker__value {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.color-picker__palette {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  z-index: 10;
}

.color-picker__swatch {
  width: 100%;
  aspect-ratio: 1;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-picker__swatch:hover {
  transform: scale(1.1);
}

.color-picker__swatch--selected {
  outline: 2px solid #4a5568;
  outline-offset: 2px;
}
</style>
