<template>
  <div
    class="bt-nav-folder"
    :data-path="folder.path"
    :data-level="level"
  >
    <!-- Folder title -->
    <div
      class="bt-nav-folder-header"
      @click="isClosed = !isClosed"
    >
      <Icon
        v-if="level > 0"
        :name="isClosed ? 'plus' : 'minus'"
        class="bt-nav-folder-icon"
      />
      <span class="bt-nav-folder-title">{{ folder.title }}</span>
    </div>

    <!-- folders -->
    <div
      v-if="!isClosed"
      class="bt-nav-folder-container"
    >
      <div
        v-if="folder.folders && folder.folders.length > 0"
        class="bt-nav-folder-folders"
      >
        <NavFolder
          v-for="subfolder in folder.folders"
          :key="subfolder.title"
          :folder="subfolder"
          :level="level + 1"
        />
      </div>

      <!-- stories -->
      <div
        v-if="folder.stories && folder.stories.length > 0"
        class="bt-nav-folder-items"
      >
        <NavItem
          v-for="story in folder.stories"
          :key="story.kebabName"
          :story="story"
          :level="level + 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Icon from '../elements/Icon.vue'
import NavItem from './NavItem.vue'
import type { NavFolderData } from './types'

defineOptions({
  name: 'NavFolder',
})

const props = withDefaults(defineProps<{
  folder: NavFolderData
  level?: number
}>(), {
  level: 0,
})

const isClosed = ref(false)

function getClosedKey() {
  return `bt-folder-closed:${props.folder.path}`
}

watch(isClosed, () => {
  const key = getClosedKey()
  if (isClosed.value) {
    localStorage.setItem(key, '1')
  }
  else {
    localStorage.removeItem(key)
  }
})
onMounted(() => {
  const key = getClosedKey()
  const closed = !!localStorage.getItem(key)
  if (closed) {
    isClosed.value = true
  }
})
</script>

<style>
.bt-nav-folder-header {
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: .25em 0;
  user-select: none;
}

.bt-nav-folder-header:hover .bt-icon {
  opacity: 1;
}

.bt-nav-folder-title {
  margin-bottom: .1em;
  font-weight: 500;
  text-transform: capitalize;
  cursor: default;
  color: #374151;
}

.bt-nav-folder:not([data-level="0"]) > .bt-nav-folder-container {
  margin-left: 1.3em;
  margin-bottom: .5em;
}

.bt-nav-folder-container > * {
  display: flex;
  flex-direction: column;
  gap: .25em;
}

.bt-nav-folder-items {
  margin-bottom: .1em;
}
</style>
