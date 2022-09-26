<script setup lang="ts">
import Maze from './components/client/Maze.vue'
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
const showBg = ref(false)

onMounted (async () => {
  // @ts-expect-error type declaration
  const glsl = await import('vue-glsl')
  instance?.appContext.app.use(glsl.default)
  showBg.value = true
})
</script>

<template>
  <ClientOnly>
    <Maze v-if="enableMaze && showBg" />
  </ClientOnly>
  <router-view />
</template>
