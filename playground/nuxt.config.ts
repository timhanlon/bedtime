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

  bedtime: {
    styles: {
      story: {
        container: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6',
        header: 'text-2xl font-bold text-gray-900 dark:text-white mb-4',
        content: 'space-y-6',
      },
      variant: {
        container: 'bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4',
        title: 'text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2',
        content: 'p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700',
      },
    },
  },
})
