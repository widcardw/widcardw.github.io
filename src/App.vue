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
</script>

<template>
  <ClientOnly>
    <Maze v-if="enableMaze" />
  </ClientOnly>
  <router-view />
</template>
