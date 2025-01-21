<script setup lang="ts">
const items = ref([
  { id: 1, label: 'Item 1', action: () => { console.log('Item 1') } },
  { id: 2, label: 'Item 2', action: () => { console.log('Item 2') } },
])

const { stories } = useStory()

const storyItems = computed(() => {
  return Object.values(stories).map(story => ({
    id: story.kebabName,
    label: story.pascalName,
    action: () => { navigateTo(`/stories/${story.kebabName}`) },
  }))
})
</script>

<template>
  <Story title="Command Palette">
    <div class="flex items-center gap-1">
      <Key symbol="meta" />
      <Key symbol="J" />
    </div>
    <CommandPalette
      :items="storyItems"
      key-combo="meta_j"
    />
  </Story>
</template>
