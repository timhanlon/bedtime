<script setup lang="ts">
import { computed } from 'vue'

const { stories, getComponent } = useStory()

const items = computed(() => stories.value.map(story => ({
  label: story.pascalName,
  value: story.kebabName,
})))
</script>

<template>
  <UContainer>
    <p>You can build your own story viewer with the <code>useStory</code> composable.</p>
    <UTabs :items="items">
      <template #content="{ item }">
        <component
          :is="getComponent(stories.find(story => story.kebabName === item.value))"
        />
      </template>
    </UTabs>
  </UContainer>
</template>
