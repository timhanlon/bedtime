<template>
  <div class="stories-layout">
    <div class="stories-container">
      <aside class="stories-sidebar">
        <nav>
          <ul>
            <li
              v-for="story in stories"
              :key="story.kebabName"
            >
              <NuxtLink
                :to="'/stories/' + story.kebabName"
                class="sidebar-link"
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
import { computed } from 'vue'
import type { BedtimeStory } from '../../types/module'
import { useRoute } from '#imports'
import { stories as storyList } from '#build/stories.mjs'

defineOptions({
  name: 'StoriesLayout',
})

const route = useRoute()
const stories = computed<BedtimeStory[]>(() => Object.values(storyList))
const currentStory = computed(() => route.params.slug as string)

function formatStoryName(name: string): string {
  return name
    .replace(/Story$/, '') // Remove 'Story' suffix
    .trim()
}
</script>

<style scoped>
.stories-layout {
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.stories-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.stories-sidebar {
  width: 250px;
  background-color: #f8f8f8;
  border-right: 1px solid #e5e5e5;
  padding: 1rem;
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

.sidebar-link {
  display: block;
  padding: 0.5rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.sidebar-link:hover {
  background-color: #e5e7eb;
}

.sidebar-link.active {
  background-color: #e5e7eb;
  font-weight: 500;
}

.stories-main {
  flex: 1;
  overflow-y: auto;
  height: 100%;
}
</style>
