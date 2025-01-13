<template>
  <div
    :id="`variant-${title}`"
    class="variant-container"
    :class="variant().base({ class: [classes?.container, variantClasses.container] })"
  >
    <slot name="header">
      <div
        class="variant-header"
        :class="variant().header({ class: [classes?.header, variantClasses.header] })"
      >
        <slot name="title">
          <h2
            class="variant-title"
            :class="variant().title({ class: [classes?.title, variantClasses.title] })"
          >
            {{ title }}
          </h2>
        </slot>
        <slot name="actions">
          <div
            class="variant-actions"
            :class="variant().actions({ class: [classes?.actions, variantClasses.actions] })"
          >
            <CodeButton
              v-model="showTemplate"
            />
            <CopyButton
              v-if="variantTemplateCode"
              :content="variantTemplateCode"
            />
          </div>
        </slot>
      </div>
    </slot>
    <div
      class="variant-content"
      :class="variant().content({ class: [classes?.content, variantClasses.content] })"
    >
      <slot />
    </div>
    <div
      class="variant-template"
      :class="variant().template({ class: [classes?.template, variantClasses.template] })"
    >
      <slot name="template">
        <TemplateView
          v-if="showTemplate"
          :content="variantTemplateCode"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { tv } from 'tailwind-variants'
import { useStory } from '../composables/useStory'
import type { ComponentSlotClasses } from '../../types/module'
import CodeButton from './CodeButton.vue'
import CopyButton from './CopyButton.vue'
import TemplateView from './TemplateView.vue'
import { useRuntimeConfig } from '#imports'

const variant = tv({
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
  name: 'StoryVariant',
})

const props = withDefaults(defineProps<{
  title: string
  showTemplate?: boolean
  classes?: ComponentSlotClasses
}>(), {
  showTemplate: false,
})

const config = useRuntimeConfig()
const variantClasses = config.public.bedtime?.classes?.variant

const storySlug = inject<string | undefined>('story-slug')
const { getTemplate } = useStory()
const variantTemplateCode = computed(() =>
  storySlug ? getTemplate(storySlug, props.title) : null,
)

const showTemplate = ref(props.showTemplate)
</script>

<style scoped>
[data-bedtime-theme]:not([data-bedtime-theme='false']) {
  .variant-actions {
    align-items: var(--variant-actions-align-content);
    display: var(--variant-actions-display);
    gap: var(--variant-actions-gap);
  }

  .variant-container {
    padding: var(--variant-container-padding);
  }

  .variant-content {
    margin: var(--variant-content-margin);
  }

  .variant-header {
    display: var(--variant-header-display);
    gap: var(--variant-header-gap);
    align-items: var(--variant-actions-align-content);
  }

  .variant-title {
    color: var(--variant-title-text-color);
    font-size: var(--variant-title-font-size);
    font-weight: var(--variant-title-font-weight);
    letter-spacing: var(--variant-title-letter-spacing);
  }
}
</style>
