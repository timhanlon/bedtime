import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../feature-a'],
  stories: {
    storyGlob: '**/*.story.vue',
    storyDirectories: ['./stories'],
  },
})
