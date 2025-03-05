<template>
  <div
    class="stories-layout"
    :data-bedtime-theme="theme"
  >
    <div class="stories-container">
      <!-- sidebar -->
      <aside class="stories-sidebar">
        <div
          ref="sidebarRef"
          class="stories-sidebar-list"
        >
          <NavRoot
            :stories="stories"
            :tree="options.tree"
          />
        </div>

        <div class="stories-sidebar-options">
          <label class="select-none">
            <input
              v-model="options.tree"
              type="checkbox"
            > Show tree
          </label>
        </div>
      </aside>

      <!-- main -->
      <main class="stories-main">
        <div class="story-page">
          <div
            v-if="story"
            class="story-content"
          >
            <component
              :is="storyComponent"
              v-if="storyComponent"
            />
          </div>
          <div
            v-else-if="slug"
            class="error"
          >
            Story not found
          </div>
        </div>
      </main>
    </div>
    <CommandPalette :items="storyItems" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, provide, ref } from 'vue'
import type { BedtimeStory } from '../../types/module'
import { useOptions } from '../composables/useOptions'
import NavRoot from '../components/nav/NavRoot.vue'
import CommandPalette from '../components/CommandPalette.vue'
import { useFixScroll } from '../composables/useScrollfix'
// @ts-expect-error resolved at runtime
import { useRoute, useRuntimeConfig, navigateTo, useHead } from '#imports'
// @ts-expect-error virtual file
import { stories as storyList } from '#build/stories.mjs'

// fix scroll jump
const sidebarRef = ref<HTMLElement>()
useFixScroll(sidebarRef)

// options
const options = useOptions()
const theme = useRuntimeConfig().public.bedtime?.viewer?.theme

// stories
const stories = Object.values(storyList as Record<string, BedtimeStory>).sort((a, b) => a.pascalName.localeCompare(b.pascalName))
const storyItems = computed(() => {
  return stories.map(story => ({
    id: story.kebabName,
    label: story.pascalName,
    action: () => { navigateTo(`/stories/${story.kebabName}`) },
  }))
})

// page updates
const route = useRoute()
const slug = route.params.slug as string
const story = storyList[slug]

provide('story', story)

const storyComponent = story?.component
  ? defineAsyncComponent(story.component)
  : null
useHead({
  title: story ? story.pascalName : 'Story Not Found',
})
</script>

<style scoped>
.stories-layout {
  height: var(--stories-layout-height);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.stories-container {
  display: flex;
  flex: 1;
  min-height: 0;
}

.stories-sidebar {
  width: var(--stories-sidebar-width);
  background-color: var(--stories-sidebar-bg-color);
  border: var(--stories-sidebar-border);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stories-sidebar-list {
  padding: var(--stories-sidebar-padding);
  height: 100%;
  flex-grow: 1;
  overflow-y: auto;
}

.stories-sidebar-options {
  display: flex;
  align-items: center;
  border-top: var(--stories-sidebar-border);
  padding: var(--stories-sidebar-padding);
}

.stories-main {
  flex: 1;
  overflow-y: auto;
  padding: var(--stories-main-padding);
  background-color: var(--stories-main-bg-color);
  min-height: 0;
}

.error {
  color: #dc2626;
  font-weight: 500;
}
</style>
