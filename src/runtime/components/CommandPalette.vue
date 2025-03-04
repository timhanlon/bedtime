<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { onKeyStroke, useMagicKeys, onClickOutside } from '@vueuse/core'
import Icon from './elements/Icon'

interface CommandItem {
  id: string | number
  label: string
  action: () => void
}

const props = withDefaults(defineProps<{
  items: CommandItem[]
  keyCombo?: string
}>(), {
  keyCombo: 'meta_k',
})

const keys = useMagicKeys()
const keyCombo = keys[props.keyCombo]

const isOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement>()
const paletteRef = ref<HTMLElement>()
const itemsRef = ref<HTMLElement>()
const isKeyboardNavigation = ref(false)

watch(keyCombo, (pressed) => {
  if (pressed) {
    isOpen.value = true
    // Focus and select the input text when opened
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }
})

watch(searchQuery, (newValue) => {
  if (newValue.length === 0)
    selectedIndex.value = 0
})

const filteredItems = computed(() => {
  return props.items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function handleSelect(item: CommandItem) {
  item.action()
  isOpen.value = false
  searchQuery.value = ''
}

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
  isKeyboardNavigation.value = true
  if (selectedIndex.value < filteredItems.value.length - 1) {
    selectedIndex.value++
    scrollIntoView(selectedIndex.value)
  }
})

onKeyStroke('ArrowUp', (e) => {
  e.preventDefault()
  isKeyboardNavigation.value = true
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    scrollIntoView(selectedIndex.value)
  }
})

onKeyStroke('Enter', () => {
  if (filteredItems.value[selectedIndex.value])
    handleSelect(filteredItems.value[selectedIndex.value])
})

onKeyStroke('Escape', () => {
  isOpen.value = false
  searchQuery.value = ''
})

onClickOutside(paletteRef, () => {
  isOpen.value = false
  searchQuery.value = ''
})

function scrollIntoView(index: number) {
  nextTick(() => {
    const items = itemsRef.value?.children
    if (!items) return

    const selectedItem = items[index] as HTMLElement
    if (!selectedItem) return

    selectedItem.scrollIntoView({
      block: 'nearest',
      behavior: 'instant',
    })
  })
}
</script>

<template>
  <div
    v-if="isOpen"
    class="command-pallete-bg"
  />
  <div
    v-if="isOpen"
    ref="paletteRef"
    class="command-palette"
  >
    <div
      class="command-palette-inner"
    >
      <div class="command-palette-input-wrapper">
        <input
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="command-palette-input"
          @focus="isOpen = true"
        >
        <Icon
          name="search"
          class="command-palette-icon"
        />
      </div>
      <div
        ref="itemsRef"
        class="command-palette-items"
        :data-keyboard-nav="isKeyboardNavigation"
      >
        <div
          v-for="(item, index) in filteredItems"
          :key="index"
          class="command-palette-item"
          :class="{ 'command-palette-item-selected': index === selectedIndex }"
          @click="handleSelect(item)"
          @mouseenter="!isKeyboardNavigation && (selectedIndex = index)"
          @mousemove="isKeyboardNavigation = false"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.command-pallete-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

.command-palette {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
  z-index: 50;
}

.command-palette-input-wrapper {
  position: sticky;
  top: 0;
  border-bottom: var(--command-palette-input-border);
}

.command-palette-icon {
  position: absolute;
  left: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  opacity: 0.4;
  pointer-events: none;
}

.command-palette-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  font-size: 0.95rem;
  background-color: var(--command-palette-bg);
  transition: all 0.2s ease;
  outline: none;
}

.command-palette-input:hover {
  background-color: var(--command-palette-item-bg);
  border-color: var(--command-palette-border);
}

.command-palette-input:focus {
  background-color: var(--command-palette-item-bg);
  border-color: var(--command-palette-border);
}

.command-palette-input::placeholder {
  color: #94a3b8;
}

.command-palette-inner {
  min-height: 200px;
  background: var(--command-palette-item-bg);
  border: var(--command-palette-border);
  border-radius: var(--command-palette-border-radius);
  box-shadow: var(--command-palette-box-shadow);
  max-height: 80vh;
  overflow-y: auto;
}

.command-palette-item {
  padding: var(--command-palette-item-padding);
  cursor: var(--command-palette-item-cursor);
  transition: var(--command-palette-item-transition);
  font-size: var(--command-palette-item-font-size);
}

.command-palette-items:not([data-keyboard-nav="true"]) .command-palette-item:hover {
  background-color: var(--command-palette-item-hover-bg);
}

.command-palette-item-selected {
  background-color: var(--command-palette-item-selected-bg);
}

.command-palette-items {
  overflow-y: auto;
}
</style>
