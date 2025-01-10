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

export interface StoryStyles {
  story?: {
    container?: string
    header?: string
    content?: string
  }
  variant?: {
    container?: string
    title?: string
    content?: string
  }
}

export interface BedtimeConfig {
  enabled?: boolean
  stories?: {
    directories?: string[]
    glob?: string
  }
  viewer?: {
    route?: string
  }
  styles?: StoryStyles
}
