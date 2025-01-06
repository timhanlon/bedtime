import type { Component } from 'vue'

export interface BedtimeStory {
  kebabName: string
  pascalName: string
  shortPath: string
  global: boolean
  component: Component
  template?: string
  variants?: Record<string, string>
  hasVariants: boolean
}

export type BedtimeStories = Record<string, BedtimeStory>
