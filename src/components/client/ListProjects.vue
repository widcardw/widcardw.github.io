<script setup lang="ts">
defineProps<{
  projects: Record<string, any[]>
}>()
</script>

<template>
  <template v-for="key in Object.keys(projects)" :key="key">
    <h4 font-bold>
      {{ key }}
    </h4>
    <div sm:grid="~ cols-2">
      <ProjectCard
        v-for="p in projects[key]" :key="p.name"
        :name="p.name"
        :link="p.link"
        :desc="p.desc"
        :icon="p.icon"
      />
    </div>
  </template>
</template>
