<script setup lang="ts">
defineProps<{
  path: string
  title: string
  date: string
  category?: string
  tags?: string[]
  abstract?: string
  fcate?: string
  ftag?: string
}>()

const emits = defineEmits(['update:fcate', 'update:ftag'])

const router = useRouter()
</script>

<template>
  <div
    p-4 rounded
    class="hover:bg-zinc/10 transition-all"
    space-y-1
  >
    <div flex space-x-4 items-center>
      <div text-lg font-bold icon-btn op-100 @click="router.push(path)">
        {{ title }}
      </div>
      <div flex-1 />
      <div op-40>
        {{ new Date(date).toLocaleDateString() }}
      </div>
    </div>
    <div flex="~ wrap">
      <Tag v-if="category" :label="category" icon-btn op-80 @click="emits('update:fcate', category)">
        <div i-ri-book-mark-line />
      </Tag>
      <div v-for="tag in tags" :key="tag">
        <Tag :label="tag" icon-btn op-60 @click="emits('update:ftag', tag)">
          <div i-ri-hashtag />
        </Tag>
      </div>
    </div>
    <div v-if="abstract" op-40 text-sm>
      {{ abstract }}
    </div>
  </div>
</template>
