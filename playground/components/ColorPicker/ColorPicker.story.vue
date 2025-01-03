<template>
  <Story title="Color Picker Component">
    <Variant name="Default">
      <div style="padding: 2rem; background: #f7fafc;">
        <ColorPicker
          v-model="defaultColor"
          label="Choose a color"
        />
      </div>
    </Variant>

    <Variant name="Pre-selected Color">
      <div style="padding: 2rem; background: #f7fafc;">
        <ColorPicker
          v-model="preselectedColor"
          label="Pre-selected blue"
        />
      </div>
    </Variant>

    <Variant name="No Label">
      <div style="padding: 2rem; background: #f7fafc;">
        <ColorPicker v-model="noLabelColor" />
      </div>
    </Variant>

    <Variant name="Dark Background">
      <div style="padding: 2rem; background: #2d3748;">
        <ColorPicker
          v-model="darkBgColor"
          label="Dark theme"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker from './ColorPicker.vue'

defineOptions({
  name: 'ColorPickerStoryComponent',
})

const defaultColor = ref('#ff0000')
const preselectedColor = ref('#0000ff')
const noLabelColor = ref('#00ff00')
const darkBgColor = ref('#ffffff')
</script>
