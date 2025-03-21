import { defineNuxtConfig } from 'nuxt/config'
import StoriesModule from '../../../../src/module'

export default defineNuxtConfig({
  modules: [StoriesModule],
  sourcemap: {
    server: false,
  },
  bedtime: {
    stories: {
      directories: ['./stories'],
    },
  },
})
