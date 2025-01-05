import { defineNuxtConfig } from 'nuxt/config'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    stories?: {
      storiesRoute?: string
      storyGlob?: string
    }
  }
}

export default defineNuxtConfig({
  modules: ['../../../src/module'],
  stories: {
    storyGlob: 'stories/**/*.story.vue',
  },
})
