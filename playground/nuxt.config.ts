// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'bedtime-color-mode',
  },

  compatibilityDate: '2025-01-03',
})
