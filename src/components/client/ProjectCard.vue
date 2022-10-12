<script setup lang="ts">
defineProps<{
  name: string
  link?: string
  icon?: string
  desc?: string
}>()
</script>

<template>
  <a :href="link" border-b="~ transparent" class="!pbe-0" target="_blank">
    <div
      p-4 rounded
      class="hover:bg-zinc/10 transition-all"
      space-y-1
      flex space-x-4 items-center
      text="gray-700 dark:gray-200"
      op-80 hover-op-100
    >
      <template v-if="icon?.startsWith('i-')">
        <div :class="icon" text-2rem w-3rem />
      </template>
      <template v-else-if="icon === 'mk'">
        <div>
          <img h="3rem" :src="`https://cdn.widcard.win/manim/favicon${isDark ? '-dark' : ''}.svg`">
        </div>
      </template>
      <div>
        <div text-md font-bold op-100>
          {{ name }}
        </div>
        <div text-sm>{{ desc }}</div>
      </div>
    </div>
  </a>
</template>
