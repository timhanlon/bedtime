export interface Story {
  slug: string
  path: string
}

declare module '#nuxt-stories/stories' {
  const stories: Story[]
  export { stories }
}

declare module '#imports' {
  const useStories: () => {
    stories: import('vue').ComputedRef<Story[]>
    getStoryBySlug: (slug: string) => Story | undefined
  }
  export { useStories }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $stories: Story[]
  }
}
