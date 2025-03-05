import { onMounted, onUpdated, type Ref } from 'vue'
// @ts-expect-error resolved at runtime
import { onBeforeRouteLeave, onBeforeRouteUpdate, type RouteLocationNormalized } from '#vue-router'
// @ts-expect-error resolved at runtime
import { useState } from '#imports'

export function useFixScroll(ref: Ref<HTMLElement | undefined>) {
  const id = ref.value?.id || ref.value?.className
  if (ref.value && !id) {
    console.warn('UseScrollFix requires that the fixed element have a unique class or id')
  }

  const lastScrollTop = useState<number>(`bedtime-${id}-scroll-top`, () => 0)
  const saveScrollPosition = () => {
    if (ref.value) {
      lastScrollTop.value = ref.value.scrollTop
    }
  }
  const restoreScrollPosition = () => {
    if (ref.value) {
      ref.value.scrollTop = lastScrollTop.value
    }
  }

  onBeforeRouteLeave((_to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    saveScrollPosition()
  })
  onBeforeRouteUpdate((_to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    saveScrollPosition()
  })

  onMounted(() => {
    restoreScrollPosition()
  })
  onUpdated(() => {
    restoreScrollPosition()
  })
}
