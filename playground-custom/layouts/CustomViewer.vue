<script setup lang="ts">
const bedtime = useStory()
const stories = Object.values(bedtime.stories)
const route = useRoute()

const searchMenuItem = {
  label: 'Search',
  icon: 'i-lucide-search',
  onSelect: () => {
    commandPaletteOpen.value = true
  },
}

const navigationMenuItems = ref([
  searchMenuItem,
  ...bedtime
    .getStoryMenuItems()
    .map(story => ({
      label: story.title,
      icon: 'i-lucide-file-text',
      to: `/custom/${story.slug}`,
    })),
])

const commandPaletteItems = stories
  .map(s => ({
    label: s.pascalName,
    icon: 'i-lucide-file-text',
    onSelect: () => {
      navigateTo(`/custom/${s.kebabName}`)
      commandPaletteOpen.value = false
    },
  }))

const commandPaletteOpen = ref(false)

const groups = ref([
  {
    id: 'components',
    label: 'Components',
    items: commandPaletteItems,
  },
])

defineShortcuts({
  meta_k: () => commandPaletteOpen.value = true,
})

const currentStory = computed(() => {
  return stories.find(s => s.kebabName === route.path.split('/').pop())
})

const currentStoryVariants = computed(() => {
  return Object.values(currentStory.value?.variants || {})
})

// Handle hash changes for smooth scrolling to variants
watch(() => route.hash, (newHash) => {
  if (!newHash) return

  nextTick(() => {
    const el = document.querySelector(newHash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}, { immediate: true })
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <div class="w-48 h-full border-r border-gray-200 bg-gray-50 dark:bg-gray-900">
      <div class="p-2 h-full overflow-y-auto">
        <UNavigationMenu
          orientation="vertical"
          :items="navigationMenuItems"
          class="data-[orientation=vertical]:w-full"
        />
      </div>
    </div>

    <div
      class="flex-1 h-full overflow-y-auto scroll-smooth"
      data-bedtime-theme="false"
    >
      <div class="p-4">
        <NuxtPage />
      </div>
    </div>

    <div class="w-48 h-full border-l border-gray-200 bg-gray-50 dark:bg-gray-900">
      <div class="p-2 h-full overflow-y-auto">
        <UNavigationMenu
          v-if="currentStoryVariants.length"
          :items="currentStoryVariants.map(variant => ({
            label: variant.title,
            to: `#variant-${variant.slug}`,
          }))"
          orientation="vertical"
          class="data-[orientation=vertical]:w-full"
        />
      </div>
    </div>

    <UModal
      v-model:open="commandPaletteOpen"
    >
      <template #content>
        <UCommandPalette
          :groups="groups"
          class="flex-1"
        />
      </template>
    </UModal>
  </div>
</template>

<style>
:root {
  --template-view-border: 0;
  --template-view-border-radius: 0.375rem;
  --template-view-margin: 1rem 0 0 0;
  --template-view-padding: 1rem;
  --template-view-font-size: 14px;
}
</style>
