import { defineNuxtConfig } from 'nuxt/config'
import StoriesModule from '../../../../src/module'

export default defineNuxtConfig({
  modules: [StoriesModule],
  bedtime: {
    stories: {
      directories: ['./stories'],
    },
  },
})
