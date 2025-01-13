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
            <CodeButton
              v-if="storyTemplateCode"
              v-model="showTemplate"
            />
            <CopyButton
              v-if="storyTemplateCode"
              :content="storyTemplateCode"
            />
          </div>
        </slot>
      </div>
    </slot>
    <div
      class="story-content"
      :class="story().content({ class: [classes?.content, storyClasses.content] })"
    >
      <slot />
    </div>
    <div
      class="story-template"
      :class="story().template({ class: [classes?.template, storyClasses.template] })"
    >
      <slot name="template">
        <TemplateView
          v-if="showTemplate"
          :content="storyTemplateCode"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { tv } from 'tailwind-variants'
import { useStory } from '../composables/useStory'
import type { ComponentSlotClasses } from '../../types/module'
import CodeButton from './CodeButton.vue'
import CopyButton from './CopyButton.vue'
import TemplateView from './TemplateView.vue'
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

const props = withDefaults(defineProps<{
  title?: string
  showTemplate?: boolean
  classes?: ComponentSlotClasses
}>(), {
  showTemplate: false,
})

const config = useRuntimeConfig()
const storyClasses = config.public.bedtime?.classes?.story

const route = useRoute()
const storySlug = route.params.slug as string
const { getTemplate } = useStory()
const storyTemplateCode = computed(() => getTemplate(storySlug))

// Provide story slug to variants
provide('story-slug', storySlug)

const showTemplate = ref(props.showTemplate)
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
