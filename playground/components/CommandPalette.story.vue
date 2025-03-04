<script setup lang="ts">
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
