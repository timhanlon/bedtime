<template>
  <div
    class="story-container"
    :class="tvStory().base({ class: [classes?.container, storyClasses.container] })"
  >
    <slot name="header">
      <div
        class="story-header"
        :class="tvStory().header({ class: [classes?.header, storyClasses.header] })"
      >
        <slot name="title">
          <h2
            v-if="title"
            class="story-title"
            :class="tvStory().title({ class: [classes?.title, storyClasses.title] })"
          >
            {{ title }}
          </h2>
        </slot>
        <slot name="actions">
          <div
            class="story-actions"
            :class="tvStory().actions({ class: [classes?.actions, storyClasses.actions] })"
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
      :class="tvStory().content({ class: [classes?.content, storyClasses.content] })"
      :data-layout="layout.type"
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
import { computed, inject, useSlots } from 'vue'
import type { VNode } from 'vue'
import { tv } from 'tailwind-variants'
import type { ComponentSlotClasses, BedtimeStory } from '../../types/module'
import Variant from './Variant.vue'
// @ts-expect-error resolved at runtime
import { useRuntimeConfig } from '#imports'

const tvStory = tv({
  slots: {
    base: '',
    actions: '',
    content: '',
    header: '',
    template: '',
    title: '',
  },
})

interface Layout {
  type?: 'grid' | 'wrap' | 'none'
  cols?: number
  width?: string
}

defineOptions({
  name: 'StoryContainer',
})

const props = defineProps<{
  title?: string
  classes?: ComponentSlotClasses
  layout?: Layout
}>()

const config = useRuntimeConfig()
const storyClasses: ComponentSlotClasses = config.public.bedtime?.classes?.story

const story = inject<BedtimeStory | undefined>('story')

const slots = useSlots()
const hasVariants = computed(() => {
  if (!slots.default) return false
  const defaultSlot = slots.default({})
  return defaultSlot.some((node: VNode) =>
    node.type && typeof node.type === 'object' && 'name' in node.type && node.type.name === 'StoryVariant',
  )
})

// layout properties
const layout = computed(() => {
  // defaults
  const layout: Layout = {
    type: 'none',
    cols: undefined,
    width: undefined,
  }

  // columns
  if (props.layout) {
    const { cols, width } = props.layout

    // grid
    if (cols) {
      layout.type = 'grid'
      layout.cols = cols
    }

    else if (width) {
      // grid
      if (width.endsWith('%')) {
        const percent = Number.parseInt(width)
        layout.type = 'grid'
        layout.cols = Math.round(1 / (percent / 100))
      }

      // wrap
      else if (width.endsWith('px')) {
        layout.type = 'wrap'
        layout.width = width
      }
    }
  }

  // return
  return layout
})

async function openInEditor() {
  if (!story) {
    return
  }
  const url = new URL(
    `/__open-in-editor?file=${story.shortPath}&line=1&column=1`,
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
