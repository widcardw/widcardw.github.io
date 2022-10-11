import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGlStore = defineStore('gl', () => {
  const isLoaded = ref(false)

  const seeds = ref([
    Math.random() * 1000,
    Math.random() * 987,
    Math.random() * 654,
  ].map(i => i.toFixed(2)))

  return {
    isLoaded,
    seeds,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGlStore, import.meta.hot))
