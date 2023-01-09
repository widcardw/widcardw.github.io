<script setup lang="ts">
import { friends } from '~/data/links.json'
</script>

<template>
  <Friend
    v-for="f in friends" :key="f.name"
    :avatar="f.avatar" :name="f.name" :desc="f.desc" :url="f.link"
  />
</template>
