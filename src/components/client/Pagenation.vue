<script setup lang="ts">
const props = withDefaults(defineProps<{
  cur?: number
  size?: number
  total?: number
}>(), {
  cur: 1,
  size: 20,
  total: 100,
})

const emit = defineEmits(['update:cur'])

const currentPage = useVModel(props, 'cur', emit)

function currentChange(i: number) {
  currentPage.value = i
}

function prevPage() {
  if (currentPage.value > 1)
    currentPage.value--
}

function nextPage() {
  if (currentPage.value < Math.ceil(props.total / props.size))
    currentPage.value++
}

watchEffect(() => {
  if (currentPage.value > Math.ceil(props.total / props.size))
    currentPage.value = 1
})
</script>

<template>
  <div flex space-x-2 m-4 items-center>
    <div btn-like @click="prevPage">
      <div i-ri-arrow-left-s-line />
    </div>
    <div
      v-for="i in Math.ceil(total / size)" :key="i"
      btn-like
      :class="{ 'bg-op-30 hover:bg-op-50': i === currentPage }"
      @click="currentChange(i)"
    >
      {{ i }}
    </div>
    <div btn-like @click="nextPage">
      <div i-ri-arrow-right-s-line />
    </div>
  </div>
</template>
