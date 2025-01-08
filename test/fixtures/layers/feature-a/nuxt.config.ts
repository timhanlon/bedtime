import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base'],
  bedtime: {
    stories: {
      directories: ['./stories'],
    },
  },
})
