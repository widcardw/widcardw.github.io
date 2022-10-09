import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePage = defineStore('page', () => {
  const currentPage = ref(1)
  return {
    currentPage,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePage, import.meta.hot))
