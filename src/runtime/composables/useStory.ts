import type { BedtimeStory, BedtimeStories, BedtimeVariant } from '../../types/module'
import { stories } from '#build/stories.mjs'

export function useStory() {
  function getStoryDetails(name: string): BedtimeStory | null {
    const story = stories[name]
    if (!story) return null

    return {
      template: story.template ?? null,
      variants: story.variants ?? {},
      hasVariants: Object.keys(story.variants ?? {}).length > 0,
      component: story.component,
      pascalName: story.pascalName,
      kebabName: story.kebabName,
      shortPath: story.shortPath,
      filePath: story.filePath,
    }
  }

  function getStoryNames(): string[] {
    return Object.keys(stories)
  }

  function getVariantNames(storyName: string): string[] {
    const story = stories[storyName]
    if (!story?.variants) return []
    return Object.keys(story.variants)
  }

  function getVariantTemplate(storyName: string, variantName?: string): string | null {
    const story: BedtimeStory = stories[storyName]
    if (!story || !story.variants) return null
    const variant = Object.values(story.variants).find((variant: BedtimeVariant) => variant.title === variantName)
    if (!variant) return null
    return variant.template
  }

  function getTemplate(storyName: string, variantName?: string): string | null {
    const story: BedtimeStory = stories[storyName]
    if (!story) return null

    // If variant name provided and exists, return that
    if (story.variants && variantName) {
      const variant = Object.values(story.variants).find((variant: BedtimeVariant) => variant.title === variantName)
      if (variant) return variant.template
    }

    // Otherwise return story template
    return story.template ?? null
  }

  return {
    getStoryDetails,
    getStoryNames,
    getVariantNames,
    getTemplate,
    getVariantTemplate,
    // Keep stories object for compatibility
    stories: stories as BedtimeStories,
  }
}
