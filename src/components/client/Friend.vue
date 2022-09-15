<script setup lang="ts">
withDefaults(defineProps<{
  name?: string
  avatar?: string
  url?: string
  desc?: string
}>(), {
  name: 'noname',
  avatar: '/favicon.svg',
  url: '/',
  desc: '',
})
</script>

<template>
  <div
    p-4 flex space-x-2 rounded
    class="hover:bg-zinc/10 transition-all cursor-pointer"
  >
    <MyImg class="w-4rem h-4rem rounded-full" :src="avatar" />
    <div grid="~ rows-2">
      <div text-xl font-bold self-end>
        {{ name }}
      </div>
      <div op-70>
        {{ desc }}
      </div>
    </div>
  </div>
</template>
