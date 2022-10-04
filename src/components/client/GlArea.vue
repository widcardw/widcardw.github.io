<script setup lang="ts">
withDefaults(defineProps<{
  width?: number
  height?: number
  code?: string
  name: string
}>(), {
  width: 100,
  height: 100,
  code: '',
})
</script>

<template>
  <ClientOnly>
    <div
      :style="{ width: `${width}px`, height: `${height}px` }"
      ma z-999
    >
      <gl-canvas>
        <gl-program :name="name" :code="code" />
      </gl-canvas>
    </div>
  </ClientOnly>
</template>
