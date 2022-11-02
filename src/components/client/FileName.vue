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
  <label space="x-0.5" whitespace-nowrap underline="~ dotted gray/30">
    <div :class="icon" text="[0.625em]" mb="[-0.1rem]" inline-block />
    <span font-mono text-sm>{{ name }}</span>
  </label>
</template>
