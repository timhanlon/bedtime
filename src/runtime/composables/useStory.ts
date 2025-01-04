import { computed, defineAsyncComponent } from 'vue'
import type { Story } from '../types'
import { stories as storyList } from '#nuxt-stories'

export function useStory() {
  const stories = computed(() => storyList)
  const modules = import.meta.glob('/components/**/*.story.vue')

  const getByKebabName = (kebabName: string) => {
    return stories.value.find(s => s.kebabName === kebabName)
  }

  const getComponent = (story: Story | null | undefined) => {
    if (!story?.shortPath) return null
    const importPath = '/' + story.shortPath
    return defineAsyncComponent(() => modules[importPath]?.())
  }

  return {
    stories,
    getByKebabName,
    getComponent,
  }
}
