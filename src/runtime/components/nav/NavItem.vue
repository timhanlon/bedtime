<template>
  <div
    class="bt-nav-item"
    :data-id="story.kebabName"
    :data-path="path"
    :data-level="level"
  >
    <NuxtLink
      :to="`/stories/${story.kebabName}`"
      class="bt-nav-item-link"
      :class="{ 'bt-active': currentStory === story.kebabName }"
    >
      <div class="bt-nav-item-content">
        <Icon
          name="document"
          size="sm"
          class="bt-nav-item-icon"
        />
        <span class="bt-nav-item-title">{{ title }}</span>
      </div>
      <span class="bt-nav-item-variants">{{ Object.values(story.variants ?? {}).length || 1 }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BedtimeStory } from '../../../types/module'
import Icon from '../elements/Icon.vue'

defineOptions({
  name: 'NavItem',
})

const props = defineProps<{
  story: BedtimeStory
  level: number
}>()

const currentStory = computed(() => useRoute()?.params.slug as string)

const path = computed(() => {
  return props.story.shortPath
    .replace(/\.story\.vue$/, '')
    .trim()
})

const title = computed(() => {
  return path.value.split('/').pop()
})
</script>

<style>
.bt-nav-item {
  font-size: .85em;
}

.bt-nav-item-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .25em .4em;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s;
  line-height: 1;
  border-radius: .25em;
}

.bt-nav-item-link:hover {
  background-color: #e5e7eb;
}

.bt-nav-item-link.bt-active {
  background-color: #e5e7eb;
  font-weight: 500;
}

.bt-nav-item-content {
  display: flex;
  gap: 0.4em;
  align-items: center;
}

.bt-nav-item-icon {
  transform: translateY(-.1em);
}

.bt-nav-item-variants {
  font-variant: tabular-nums;
  font-size: .75em;
  line-height: 1;
  padding: .25em;
}

/* legacy variables */

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
</style>
