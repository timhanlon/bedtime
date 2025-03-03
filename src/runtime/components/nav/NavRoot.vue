<template>
  <nav
    class="bt-nav-root"
    :class="isMounted ? 'block' : 'hidden'"
  >
    <NavFolder
      v-for="folder in tree.folders"
      :key="folder.title"
      :folder="folder"
    />
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { BedtimeStory } from '../../types/module'
import NavFolder from './NavFolder.vue'
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
const tree = computed<NavFolderData>(() => {
  const tree: NavFolderData = {
    title: 'root',
    folders: [],
    stories: [],
  }

  // tree
  if (props.tree) {
    // sort stories to ensure consistent order
    const sorted = [...props.stories].sort((a, b) =>
      a.shortPath.localeCompare(b.shortPath),
    )

    // build the tree structure
    for (const story of sorted) {
      const parts = story.shortPath.split('/')
      let current = tree

      // handle nested paths
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]

        // find existing folder or create new one
        let folder = current.folders.find(f => f.title === part)

        if (!folder) {
          folder = {
            title: part,
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
  }

  // flat
  else {
    tree.folders.push({
      title: 'stories',
      folders: [],
      stories: props.stories,
    })
  }

  // return
  return tree
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

.bt-nav-icon {
  opacity: 0.5;
}
</style>
