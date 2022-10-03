<script setup lang="ts">
import Maze from './components/client/Maze.vue'
import { useGlStore } from './stores/gl'
import { isDark } from '~/composables'
import { enableMaze } from '~/composables/modules/mazeBackground'

useHead({
  title: 'widcardw',
  meta: [
    { name: 'description', content: 'widcard.win' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
})

const instance = getCurrentInstance()
const useGl = useGlStore()

onMounted (async () => {
  // @ts-expect-error type declaration
  const glsl = await import('vue-glsl')
  if (instance) {
    instance.appContext.app.use(glsl.default)
    useGl.isLoaded = true
  }
})
</script>

<template>
  <ClientOnly>
    <Maze v-if="enableMaze && useGl.isLoaded" />
  </ClientOnly>
  <router-view />
</template>
