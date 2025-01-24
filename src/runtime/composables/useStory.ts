import type { BedtimeStory, BedtimeStories, BedtimeVariant, VariantMenuItem, StoryMenuItem } from '../../types/module'
// @ts-expect-error virtual file
import { stories as buildStories } from '#build/stories.mjs'

export function useStory() {
  const stories: BedtimeStories = buildStories

  function getStoryDetails(name: string): BedtimeStory | null {
    const story = stories[name]
    if (!story) return null

    return {
      template: story.template ?? undefined,
      variants: story.variants ?? {},
      hasVariants: Object.keys(story.variants ?? {}).length > 0,
      component: story.component,
      pascalName: story.pascalName,
      kebabName: story.kebabName,
      shortPath: story.shortPath,
      filePath: story.filePath,
    }
  }

  function getVariantDetails(storySlug: string, variantTitle: string): BedtimeVariant | null {
    const story = stories[storySlug]
    if (!story || !story.variants) return null
    const variant = Object.values(story.variants).find(variant => variant.title === variantTitle)
    if (!variant) return null
    return variant
  }

  function getStoryNames(): string[] {
    return Object.keys(stories)
  }

  function getVariantNames(storyName: string): string[] {
    const story = stories[storyName]
    if (!story?.variants) return []
    return Object.keys(story.variants)
  }

  function getTemplate(storyName: string, variantName?: string): string | null {
    const story: BedtimeStory = stories[storyName]
    if (!story) return null

    // If no variant name specified, return story template
    if (!variantName) return story.template ?? null

    // Find variant by title
    const variant = Object.values(story.variants ?? {}).find(
      (variant: BedtimeVariant) => variant.title === variantName,
    )
    return variant?.template ?? null
  }

  function getVariantMenuItems(storyName: string): VariantMenuItem[] {
    const story: BedtimeStory = stories[storyName]
    if (!story) return []

    const items: VariantMenuItem[] = []

    // If no variants, or explicit variants, add Default variant
    if (!story.hasVariants) {
      items.push({
        title: 'Default',
        slug: 'default',
        isDefault: true,
      })
      return items
    }

    // Add all explicit variants
    return Object.values(story.variants ?? {}).map(variant => ({
      title: variant.title,
      slug: variant.slug,
    }))
  }

  function getStoryMenuItems(): StoryMenuItem[] {
    return Object.entries(stories).map(([slug, story]) => ({
      title: story.pascalName,
      slug,
      shortPath: story.shortPath,
      variants: getVariantMenuItems(slug),
    }))
  }

  return {
    getStoryDetails,
    getStoryNames,
    getVariantDetails,
    getVariantNames,
    getTemplate,
    getVariantMenuItems,
    getStoryMenuItems,
    // Keep stories object for compatibility
    stories: stories as BedtimeStories,
  }
}
