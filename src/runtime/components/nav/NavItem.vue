<template>
  <div class="bt-nav-item">
    <NuxtLink
      :to="`/stories/${story.kebabName}`"
      class="bt-nav-item-link"
      :class="{ 'bt-active': currentStory === story.kebabName }"
    >
      <div class="flex gap-2 items-center">
        <Icon
          name="document"
          size="sm"
          class="bt-nav-item-icon"
        />
        <span class="bt-nav-item-title">{{ title }}</span>
      </div>
      <span class="bt-nav-item-variants">{{ Object.values(story.variants).length || 1 }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BedtimeStory } from '../../types/module'
import Icon from '../elements/Icon'

defineOptions({
  name: 'NavItem',
})

const props = defineProps<{
  story: BedtimeStory
}>()

const currentStory = computed(() => useRoute()?.params.slug as string)

/**
 * Compute formatted story name by removing the 'Story' suffix
 */
const formattedName = computed(() => {
  return props.story.shortPath
    .split('/')
    .pop()
    .replace(/\.story\.vue$/, '') // Remove 'Story' suffix
    .trim()
})
</script>

<style>
.bt-nav-item {}

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

.bt-nav-item-variants {
  font-variant: tabular-nums;
  font-size: .75em;
  line-height: 1;
  padding: .25em;
}
</style>
