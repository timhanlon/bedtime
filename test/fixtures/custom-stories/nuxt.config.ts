import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../../../src/module'],
  bedtime: {
    stories: {
      directories: ['./custom-story-route'],
    },
  },
})
