import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../base'],
  stories: {
    storyGlob: '**/*.story.vue',
    storyDirectories: ['./stories'],
  },
})
