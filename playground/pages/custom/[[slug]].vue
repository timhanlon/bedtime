<script setup lang="ts">
const { stories: storyList } = useStory()

const stories = Object.values(storyList)

const searchMenuItem = {
  label: 'Search',
  icon: 'i-lucide-search',
  onSelect: () => {
    commandPaletteOpen.value = true
  },
}

const navigationMenuItems = [searchMenuItem, ...stories
  .map(s => ({
    label: s.pascalName,
    icon: 'i-lucide-file-text',
    to: `${s.kebabName}`,
  })),
]

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

const route = useRoute()
const slug = computed(() => route.params.slug)
const story = stories.find(s => s.kebabName === slug.value)

useHead({
  title: story?.pascalName,
})
</script>

<template>
  <UApp>
    <div class="flex">
      <div class="p-2">
        <UNavigationMenu
          orientation="vertical"
          :items="navigationMenuItems"
          class="data-[orientation=vertical]:w-48"
        />
      </div>

      <div class="p-2">
        <component :is="story?.component" />
      </div>
    </div>

    <UModal :open="commandPaletteOpen">
      <template #content>
        <UCommandPalette
          v-model:open="commandPaletteOpen"
          :groups="groups"
          class="flex-1"
        />
      </template>
    </UModal>
  </UApp>
</template>
