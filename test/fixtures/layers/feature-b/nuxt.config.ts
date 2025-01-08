import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../feature-a'],
  bedtime: {
    stories: {
      directories: ['./stories'],
    },
  },
})
