import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../../../src/module'],
  sourcemap: {
    server: false,
  },
  bedtime: {
    stories: {
      directories: ['./custom-story-route'],
    },
  },
})
