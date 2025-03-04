<script setup lang="ts">
import { tv } from 'tailwind-variants'

const tvButton = tv({
  slots: {
    base: 'rounded-lg border cursor-pointer transition-colors duration-100',
    text: 'font-medium tracking-tight',
  },
  variants: {
    color: {
      primary: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-blue-700',
      secondary: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-700',
      success: 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200 hover:text-green-700',
    },
    size: {
      xs: 'py-0.5 px-1 text-xs',
      sm: 'py-1 px-2 text-sm',
      md: 'py-1.5 px-4 text-md',
      lg: 'py-2 px-6 text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

const props = defineProps<{
  color?: 'primary' | 'secondary' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  slots?: {
    base?: string
    text?: string
  }
}>()

const { base, text } = tvButton({ color: props.color, size: props.size })
</script>

<template>
  <button :class="base({ class: props.slots?.base })">
    <span :class="text({ class: props.slots?.text })">
      Click me
    </span>
  </button>
</template>
