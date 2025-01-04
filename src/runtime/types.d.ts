export interface Story {
  kebabName: string
  pascalName: string
  shortPath: string
  global: boolean
}

declare module '#nuxt-stories' {
  const stories: Story[]
  export { stories }
}

declare module '#imports' {
  export { useStory } from './composables/useStory'
}
