// https://nuxt.com/docs/api/configuration/nuxt-config
import type { StoriesModuleOptions } from '../src/module'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    stories?: StoriesModuleOptions
  }
}

export default defineNuxtConfig({
  modules: ['../src/module'],

  compatibilityDate: '2025-01-03',

  stories: {
    pattern: 'components/**/*.story.vue',
    storiesRoute: '/stories',
  },
})
