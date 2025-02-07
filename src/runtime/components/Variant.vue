<template>
  <div
    :id="`variant-${variant?.slug}`"
    ref="variantContainer"
    class="variant-container"
    :class="tvVariant().base({ class: [classes?.container, variantClasses.container] })"
  >
    <slot name="header">
      <div
        class="variant-header"
        :class="tvVariant().header({ class: [classes?.header, variantClasses.header] })"
      >
        <slot name="title">
          <h2
            class="variant-title"
            :class="tvVariant().title({ class: [classes?.title, variantClasses.title] })"
          >
            {{ title }}
          </h2>
        </slot>
        <slot name="actions">
          <div
            class="variant-actions"
            :class="tvVariant().actions({ class: [classes?.actions, variantClasses?.actions] })"
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
      :class="tvVariant().content({ class: [classes?.content, variantClasses?.content] })"
    >
      <slot />
    </div>
    <div
      class="variant-template"
      :class="tvVariant().template({ class: [classes?.template, variantClasses?.template] })"
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
import { inject, ref, watch } from 'vue'
import { tv } from 'tailwind-variants'
import type { ComponentSlotClasses, BedtimeStory } from '../../types/module'
import CodeButton from './CodeButton.vue'
import CopyButton from './CopyButton.vue'
import TemplateView from './TemplateView.vue'
// @ts-expect-error resolved at runtime
import { useRoute, useRuntimeConfig } from '#imports'

const tvVariant = tv({
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
const variantClasses: ComponentSlotClasses = config.public.bedtime?.classes?.variant

const story = inject<BedtimeStory | undefined>('story')
const variant = Object.values(story?.variants ?? {}).find(variant => variant.title === props.title)
const variantTemplateCode = variant?.template

const showTemplate = ref(props.showTemplate)

const route = useRoute()
const variantContainer = ref<HTMLElement | null>(null)
watch(() => route.hash, (newHash) => {
  if (newHash) {
    if (newHash === `#variant-${variant?.slug}`) {
      variantContainer.value?.setAttribute('data-active', 'true')
    }
    else {
      variantContainer.value?.removeAttribute('data-active')
    }
  }
})
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
    border: var(--variant-content-border);
    border-radius: var(--variant-content-border-radius);
    margin: var(--variant-content-margin);
    padding: var(--variant-content-padding);
    position: var(--variant-content-position);
  }

  .variant-content::after {
    content: '';
    position: absolute;
    inset: var(--variant-content-padding);
    border: var(--variant-content-guideline-border);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .variant-content:hover::after {
    opacity: 1;
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
