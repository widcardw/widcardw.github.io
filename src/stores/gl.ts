import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGlStore = defineStore('gl', () => {
  const isLoaded = ref(false)

  return {
    isLoaded,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGlStore, import.meta.hot))
