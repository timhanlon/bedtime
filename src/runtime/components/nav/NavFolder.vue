<template>
  <div class="bt-nav-folder">
    <!-- Folder title -->
    <div class="bt-nav-folder-header flex items-center gap-1.5">
      <Icon
        name="folder-open"
        class="bt-nav-folder-icon"
      />
      <span class="bt-nav-folder-title">{{ folder.title }}</span>
    </div>

    <!-- folders -->
    <div class="bt-nav-folder-container">
      <div v-if="folder.folders && folder.folders.length > 0">
        <NavFolder
          v-for="subfolder in folder.folders"
          :key="subfolder.title"
          :folder="subfolder"
          :level="level + 1"
        />
      </div>

      <!-- stories -->
      <div v-if="folder.stories && folder.stories.length > 0">
        <NavItem
          v-for="story in folder.stories"
          :key="story.kebabName"
          :story="story"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '../elements/Icon'
import NavItem from './NavItem.vue'
import type { NavFolderData } from './types'

defineOptions({
  name: 'NavFolder',
})

withDefaults(defineProps<{
  folder: NavFolderData
  level?: number
}>(), {
  level: 0,
})
</script>

<style>
.bt-nav-folder-title {
  margin-bottom: .1em;
  padding: .25em .4em;
  font-weight: 500;
  text-transform: capitalize;
  cursor: default;
  color: #374151;
}

.bt-nav-folder-container {
  margin-left: 1em;
  margin-bottom: .5em;
}

.bt-nav-folder-container > * {
  display: flex;
  flex-direction: column;
  gap: .25em;
}
.bt-nav-folder-container > * > *{
  margin-bottom: .1em;
}
</style>
