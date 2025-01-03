// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['../src/module'],

  stories: {
    pattern: 'components/**/*.story.vue',
    storiesRoute: '/stories',
    eager: true,
  },

  compatibilityDate: '2025-01-03',
})