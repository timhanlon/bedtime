<template>
  <div class="stories-layout">
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
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import type { BedtimeStory } from '../../types/module'
import { useOptions } from '../composables/useOptions'
import NavRoot from '../components/nav/NavRoot.vue'
import type { RouteLocationNormalized } from '#vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useState } from '#imports'
import { stories as storyList } from '#build/stories.mjs'

defineOptions({
  name: 'StoriesLayout',
})

const options = useOptions()
const sidebarRef = ref<HTMLElement>()
const stories = Object
  .values(storyList as Record<string, BedtimeStory>)
  .sort((a, b) => a.pascalName.localeCompare(b.pascalName))

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
</script>

<style scoped>
.stories-layout {
  height: 100vh;
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
  width: 350px;
  background-color: #f8f8f8;
  border-right: 1px solid #e5e5e5;
  padding: 1rem;
  overflow-y: auto;
  flex-shrink: 0;
}

.stories-main {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  min-height: 0;
}
</style>
