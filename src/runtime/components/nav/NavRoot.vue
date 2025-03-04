<template>
  <nav
    class="bt-nav-root"
    :class="isMounted ? 'block' : 'hidden'"
  >
    <div v-if="tree">
      <NavFolder
        v-for="folder in nested.folders"
        :key="folder.title"
        :folder="folder"
      />
    </div>
    <div
      v-else
      class="space-y-1"
    >
      <NavItem
        v-for="story in stories"
        :key="story.shortPath"
        :story="story"
        :level="0"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { BedtimeStory } from '../../types/module'
import NavFolder from './NavFolder.vue'
import NavItem from './NavItem.vue'
import type { NavFolderData } from './types'

defineOptions({
  name: 'StoriesNav',
})

const props = defineProps<{
  stories: BedtimeStory[]
  tree?: boolean
}>()

/**
 * Transform flat story list into hierarchical tree structure
 */
const nested = computed<NavFolderData>(() => {
  const data: NavFolderData = {
    title: 'root',
    path: '/',
    folders: [],
    stories: [],
  }

  // tree
  // sort stories to ensure consistent order
  const sorted = [...props.stories].sort((a, b) =>
    a.shortPath.localeCompare(b.shortPath),
  )

  // build the tree structure
  for (const story of sorted) {
    const parts = story.shortPath.split('/')
    let current = data

    // handle nested paths
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]

      // find existing folder or create new one
      let folder = current.folders.find(f => f.title === part)

      if (!folder) {
        folder = {
          title: part,
          path: parts.slice(0, i + 1).join('/'),
          folders: [],
          stories: [],
        }
        current.folders.push(folder)
      }

      current = folder
    }

    // add the story to the current level
    current.stories.push(story)
  }

  // return
  return data
})

// prevent fouc
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<style>
.bt-nav-root {
  width: 100%;
}

.bt-nav-root .bt-icon {
  opacity: 0.5;
}

.bt-nav-root .bt-nav-folder +.bt-nav-folder {
  margin-top: 1.5rem;
  padding-top: 1em;
  border-top: 1px solid #EEE;
}
</style>
