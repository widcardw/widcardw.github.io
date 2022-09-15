<script setup lang="ts">
defineProps<{
  path: string
  title: string
  date: string
  category?: string
  tags?: string[]
  abstract?: string
}>()

const router = useRouter()
</script>

<template>
  <div
    p-4 rounded
    class="hover:bg-zinc/10 transition-all cursor-pointer"
    space-y-1
    @click="router.push(path)"
  >
    <div flex space-x-4 items-center>
      <div text-lg font-bold>
        {{ title }}
      </div>
      <div flex-1 />
      <div op-40>
        {{ new Date(date).toLocaleDateString() }}
      </div>
    </div>
    <div flex space-x-3>
      <div v-if="category" op-80 flex items-center space-x-1>
        <div i-ri-book-mark-line icon-btn />
        <span>{{ category }}</span>
      </div>
      <div v-for="tag in tags" :key="tag">
        <div op-60 flex items-center>
          <div i-ri-hashtag icon-btn />
          <span>{{ tag }}</span>
        </div>
      </div>
    </div>
    <div v-if="abstract" op-40 text-sm>
      {{ abstract }}
    </div>
  </div>
</template>
