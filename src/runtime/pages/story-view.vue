<template>
  <StoriesLayout>
    <div class="story-page">
      <div
        v-if="story"
        class="story-content"
      >
        <component :is="story.component" />
      </div>
      <div
        v-else
        class="error"
      >
        Story not found
      </div>
    </div>
  </StoriesLayout>
</template>

<script setup lang="ts">
import { useStory } from '../composables/useStory'
import StoriesLayout from '../layouts/stories.vue'
// @ts-expect-error resolved at runtime
import { useHead, useRoute } from '#imports'

const route = useRoute()
const { stories } = useStory()

const story = stories[route.params.slug as string]

useHead({
  title: story ? story.pascalName : 'Story Not Found',
})
</script>

<style scoped>
.story-page {
  background-color: var(--stories-main-bg-color);
}

.error {
  color: #dc2626;
  font-weight: 500;
}
</style>
