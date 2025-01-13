export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'bedtime-color-mode',
  },

  compatibilityDate: '2025-01-13',

  bedtime: {
    classes: {
      story: {
        actions: 'flex items-center gap-2',
        container: 'space-y-2',
        content: 'space-y-4',
        header: 'flex items-center gap-2',
        title: 'text-lg font-medium tracking-tight',
      },
      variant: {
        actions: 'flex items-center gap-2',
        container: 'space-y-2',
        content: 'p-4 border border-gray-200 rounded-md',
        header: 'flex items-center gap-2',
        title: 'text-md font-medium tracking-tight',
      },
    },
    viewer: {
      enabled: false,
      theme: false,
    },
  },
})
