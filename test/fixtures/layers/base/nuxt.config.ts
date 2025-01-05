import { defineNuxtConfig } from 'nuxt/config'
import StoriesModule from '../../../../src/module'

export default defineNuxtConfig({
  modules: [StoriesModule],
  stories: {
    storyGlob: '**/*.story.vue',
    storyDirectories: ['./stories'],
  },
})
