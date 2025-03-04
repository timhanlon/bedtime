import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base'],
  sourcemap: {
    server: false,
  },
  bedtime: {
    stories: {
      directories: ['./stories'],
    },
  },
})
