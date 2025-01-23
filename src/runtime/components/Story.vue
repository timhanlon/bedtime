<template>
  <div
    class="story-container"
    :class="story().base({ class: [classes?.container, storyClasses.container] })"
  >
    <slot name="header">
      <div
        class="story-header"
        :class="story().header({ class: [classes?.header, storyClasses.header] })"
      >
        <slot name="title">
          <h2
            v-if="title"
            class="story-title"
            :class="story().title({ class: [classes?.title, storyClasses.title] })"
          >
            {{ title }}
          </h2>
        </slot>
        <slot name="actions">
          <div
            class="story-actions"
            :class="story().actions({ class: [classes?.actions, storyClasses.actions] })"
          >
            <DevOnly>
              <OpenInEditorButton
                @click="openInEditor"
              />
            </DevOnly>
          </div>
        </slot>
      </div>
    </slot>
    <div
      class="story-content"
      :class="story().content({ class: [classes?.content, storyClasses.content] })"
    >
      <template v-if="hasVariants">
        <slot />
      </template>
      <Variant
        v-else
        title="Default"
      >
        <slot />
      </Variant>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, useSlots } from 'vue'
import { tv } from 'tailwind-variants'
import { useStory } from '../composables/useStory'
import type { ComponentSlotClasses } from '../../types/module'
import Variant from './Variant.vue'
import { useRoute, useRuntimeConfig } from '#imports'

const story = tv({
  slots: {
    base: '',
    actions: '',
    content: '',
    header: '',
    template: '',
    title: '',
  },
})

defineOptions({
  name: 'StoryContainer',
})

defineProps<{
  title?: string
  classes?: ComponentSlotClasses
}>()

const config = useRuntimeConfig()
const storyClasses = config.public.bedtime?.classes?.story

const route = useRoute()
const storySlug = route.params.slug as string
const { getStoryDetails } = useStory()
const storyDetails = getStoryDetails(storySlug)

provide('story-slug', storySlug)
provide('story', storyDetails)

const slots = useSlots()
const hasVariants = computed(() => {
  if (!slots.default) return false
  const defaultSlot = slots.default({})
  return defaultSlot.some(node =>
    node.type && typeof node.type === 'object' && 'name' in node.type && node.type.name === 'StoryVariant',
  )
})

async function openInEditor() {
  if (!storyDetails) {
    return
  }
  const url = new URL(
    `/__open-in-editor?file=${storyDetails.shortPath}&line=1&column=1`,
    new URL(document.location.href).origin,
  )
  await fetch(url, {
    mode: 'no-cors',
  })
}
</script>

<style scoped>
[data-bedtime-theme]:not([data-bedtime-theme='false']) {
  .story-container {
    padding: var(--story-container-padding);
    width: var(--story-container-width);
  }

  .story-title {
    color: var(--story-title-text-color);
    font-size: var(--story-title-font-size);
    font-weight: var(--story-title-font-weight);
    letter-spacing: var(--story-title-letter-spacing);
  }

  .story-content {
    margin: var(--story-content-margin);
    display: var(--story-content-display);
    gap: var(--story-content-grid-gap);
    grid-template-columns: var(--story-content-grid-template-columns);
    & > * + * {
      margin-top: var(--story-content-gap);
    }
  }

  .story-actions {
    align-items: var(--story-actions-align-content);
    display: var(--story-actions-display);
    gap: var(--story-actions-gap);
  }

  .story-header {
    display: var(--story-header-display);
    gap: var(--story-header-gap);
    & > * + * {
      flex-shrink: 0;
    }
  }
}
</style>
