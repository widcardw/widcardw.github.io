<script setup lang="ts">
withDefaults(defineProps<{
  name?: string
  avatar?: string
  url?: string
  desc?: string
}>(), {
  name: 'noname',
  avatar: '/noface.gif',
  url: '/',
  desc: '',
})
</script>

<template>
  <div
    p-4 flex space-x-2 rounded
    class="hover:bg-zinc/10 transition-all cursor-pointer"
  >
    <MyImg class="w-3.25rem h-3.25rem rounded-full" :src="avatar" />
    <div flex-1>
      <a text-xl font-bold self-end :href="url" target="_blank">
        {{ name }}
      </a>
      <div op-70>
        {{ desc }}
      </div>
    </div>
  </div>
</template>
