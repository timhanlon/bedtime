import { stories, type Stories } from '#nuxt-stories'

export function useStory(): {
  stories: Stories
} {
  return {
    stories,
  }
}
