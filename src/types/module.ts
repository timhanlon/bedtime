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

export interface ComponentSlotClasses {
  container?: string
  title?: string
  content?: string
}

export interface StoryClasses {
  story?: ComponentSlotClasses
  variant?: ComponentSlotClasses
}

export interface StoriesOptions {
  directories?: string[]
  glob?: string
}

export interface ViewerOptions {
  route: string
}

export interface BedtimeModuleOptions {
  enabled: boolean
  stories: StoriesOptions
  viewer: ViewerOptions
  classes: StoryClasses
}

export interface ResolvedBedtimeModuleOptions extends Required<BedtimeModuleOptions> {
  stories: Required<StoriesOptions>
  viewer: Required<ViewerOptions>
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
