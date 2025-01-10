<template>
  <div
    class="stories-layout"
    data-bedtime-theme="default"
  >
    <div class="stories-container">
      <aside
        ref="sidebarRef"
        class="stories-sidebar"
      >
        <nav>
          <ul>
            <li
              v-for="story in stories"
              :key="story.kebabName"
            >
              <NuxtLink
                :to="'/stories/' + story.kebabName"
                class="stories-sidebar-link"
                :class="{ active: currentStory === story.kebabName }"
              >
                {{ formatStoryName(story.pascalName) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main class="stories-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUpdated } from 'vue'
import type { BedtimeStory } from '../../types/module'
import type { RouteLocationNormalized } from '#vue-router'
import { useRoute, onBeforeRouteLeave, onBeforeRouteUpdate, useState } from '#imports'
import { stories as storyList } from '#build/stories.mjs'

defineOptions({
  name: 'StoriesLayout',
})

const route = useRoute()
const sidebarRef = ref<HTMLElement>()
const stories = Object.values(storyList as Record<string, BedtimeStory>).sort((a, b) => a.pascalName.localeCompare(b.pascalName))
const currentStory = computed(() => route.params.slug as string)

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

function formatStoryName(name: string): string {
  return name
    .replace(/Story$/, '') // Remove 'Story' suffix
    .trim()
}
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
  background-color: var(--stories-sidebar-bg);
  border-right: var(--stories-sidebar-border);
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
</style>
