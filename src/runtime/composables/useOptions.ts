import { onMounted, watch } from 'vue'
import { useState } from 'nuxt/app'

interface Options {
  tree: boolean
}

const KEY = 'bedtime-options'

export function useOptions() {
  // initialize with default values for consistent ssr
  const options = useState<Options>(KEY, () => ({
    tree: true,
  }))

  // client-side localstorage handling
  if (import.meta.client) {
    onMounted(() => {
      const stored = localStorage.getItem(KEY)
      if (stored) {
        try {
          options.value = JSON.parse(stored)
        }
        catch (err: unknown) {
          console.error('Failed to parse stored options:', err)
        }
      }
    })

    // save changes to localstorage
    watch(options, (values) => {
      localStorage.setItem(KEY, JSON.stringify(values))
    }, { deep: true })
  }

  return options
}
