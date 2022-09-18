<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  closable?: boolean
}>(), {
  label: 'none',
  closable: false,
})
const emits = defineEmits(['close'])
</script>

<template>
  <div flex items-center space-x-1 bg="zinc/10" rounded px-2 m="b-1 r-1">
    <slot />
    <span>{{ label }}</span>
    <div v-if="closable" i-ri-close-line icon-btn @click="emits('close')" />
  </div>
</template>
