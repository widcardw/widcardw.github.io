<script setup lang="ts">
withDefaults(defineProps<{
  name?: string
  icon?: string
}>(), {
  name: 'unknown',
  icon: 'i-vscode-icons-default-file',
})
</script>

<template>
  <label space="x-0.5" whitespace-nowrap>
    <div :class="icon" text="[0.625em]" inline-block />
    <span font-mono text-sm>{{ name }}</span>
  </label>
</template>
