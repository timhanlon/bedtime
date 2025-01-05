<script setup lang="ts">
import { computed } from 'vue'

const { stories } = useStory()

const items = computed(() => Object.entries(stories).map(([kebabName, story]) => ({
  label: story.pascalName,
  value: kebabName,
  component: story.component,
})))
</script>

<template>
  <UContainer>
    <p>You can build your own story viewer with the <code>useStory</code> composable.</p>
    <UTabs :items="items">
      <template #content="{ item }">
        <component :is="item.component" />
      </template>
    </UTabs>
  </UContainer>
</template>
