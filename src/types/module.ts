import type { Component } from 'vue'

export interface BedtimeStory {
  kebabName: string
  pascalName: string
  shortPath: string
  filePath: string
  component?: () => Promise<Component>
  template?: string
  variants?: Record<string, BedtimeVariant>
  hasVariants?: boolean
}

export interface BedtimeVariant {
  title: string
  slug: string
  template: string
}

export interface VariantMenuItem {
  title: string
  slug: string
  isDefault?: boolean
}

export interface StoryMenuItem {
  title: string
  slug: string
  shortPath: string
  variants: VariantMenuItem[]
}

export type BedtimeStories = Record<string, BedtimeStory>

export interface ComponentSlotClasses {
  actions?: string
  container?: string
  content?: string
  header?: string
  template?: string
  title?: string
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
  enabled?: boolean
  route?: string
  theme?: 'default' | string | false
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
