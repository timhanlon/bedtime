export interface Story {
  kebabName: string
  pascalName: string
  shortPath: string
  global: boolean
}

declare module '#app' {
  interface NuxtApp {
    $stories: Story[]
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $stories: Story[]
  }
}
