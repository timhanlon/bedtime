<template>
  <div
    class="stories-layout"
    :data-bedtime-theme="theme"
  >
    <div class="stories-container">
      <aside
        ref="sidebarRef"
        class="stories-sidebar"
      >
        <NavRoot
          :stories="stories"
          :tree="options.tree"
        />
      </aside>
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
import { computed, defineAsyncComponent, provide, ref, onMounted, onUpdated } from 'vue'
import type { BedtimeStory } from '../../types/module'
import { useOptions } from '../composables/useOptions'
import NavRoot from '../components/nav/NavRoot.vue'
import CommandPalette from '../components/CommandPalette.vue'
// @ts-expect-error resolved at runtime
import type { RouteLocationNormalized } from '#vue-router'
// @ts-expect-error resolved at runtime
import { useRoute, onBeforeRouteLeave, onBeforeRouteUpdate, useRuntimeConfig, useState, navigateTo, useHead } from '#imports'
// @ts-expect-error virtual file
import { stories as storyList } from '#build/stories.mjs'

const route = useRoute()
const sidebarRef = ref<HTMLElement>()
const stories = Object.values(storyList as Record<string, BedtimeStory>).sort((a, b) => a.pascalName.localeCompare(b.pascalName))

const options = useOptions()

const theme = useRuntimeConfig().public.bedtime?.viewer?.theme

// This scroll position state stuff shouldn't be necessary
// Maybe it's the fact that this isn't _really_ a Nuxt layout
const lastScrollTop = useState<number>('bedtime-sidebar-scroll-top', () => 0)
const saveScrollPosition = () => {
  if (sidebarRef.value) {
    lastScrollTop.value = sidebarRef.value.scrollTop
  }
}
const restoreScrollPosition = () => {
  if (sidebarRef.value) {
    sidebarRef.value.scrollTop = lastScrollTop.value
  }
}
onBeforeRouteLeave((_to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
  saveScrollPosition()
})
onBeforeRouteUpdate((_to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
  saveScrollPosition()
})
onMounted(() => {
  restoreScrollPosition()
})
onUpdated(() => {
  restoreScrollPosition()
})

const storyItems = computed(() => {
  return stories.map(story => ({
    id: story.kebabName,
    label: story.pascalName,
    action: () => { navigateTo(`/stories/${story.kebabName}`) },
  }))
})

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
  padding: var(--stories-sidebar-padding);
  overflow-y: auto;
  flex-shrink: 0;
}

.stories-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stories-sidebar li {
  margin-top: 4px;
  margin-bottom: 4px;
}

.stories-sidebar-link {
  display: block;
  padding: var(--stories-sidebar-link-padding);
  color: var(--stories-sidebar-link-color);
  text-decoration: none;
  border-radius: var(--stories-sidebar-link-border-radius);
  transition: var(--stories-sidebar-link-transition);
  font-size: var(--stories-sidebar-link-font-size);
}

.stories-sidebar-link:hover {
  background-color: var(--stories-sidebar-link-bg-hover);
}

.stories-sidebar-link.active {
  background-color: var(--stories-sidebar-link-active-bg);
  font-weight: var(--stories-sidebar-link-active-weight);
}

.stories-main {
  flex: 1;
  overflow-y: auto;
  padding: var(--stories-main-padding);
  min-height: 0;
}

.story-page {
  background-color: var(--stories-main-bg-color);
}

.error {
  color: #dc2626;
  font-weight: 500;
}
</style>
