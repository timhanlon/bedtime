import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../feature-a'],
  sourcemap: {
    server: false,
  },
  bedtime: {
    stories: {
      directories: ['./stories'],
    },
  },
})
