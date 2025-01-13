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
    classes: {
      story: {
        actions: 'flex items-center gap-2',
        container: 'space-y-4',
        content: 'space-y-4',
        header: 'flex items-center gap-2',
        title: 'text-2xl font-medium tracking-tight',
      },
      variant: {
        actions: 'flex items-center gap-2',
        container: 'space-y-4',
        header: 'flex items-center gap-2',
        title: 'text-xl font-medium tracking-tight',
      },
    },
    viewer: {
      enabled: false,
      theme: false,
    },
  },
})
