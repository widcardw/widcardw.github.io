<script setup lang="ts">
import Giscus from '@giscus/vue'
const router = useRouter()
const route = useRoute()
</script>

<template>
  <div class="heti heti--classic prose-style m-auto text-left">
    <slot />
    <p v-if="route.path !== '/'">
      <a
        href="#" class="font-mono no-underline opacity-50 hover:opacity-75"
        @click="router.back()"
      >
        back
      </a>
    </p>
    <template v-if="route.path.startsWith('/posts') && !route.path.endsWith('/posts')">
      <Giscus
        id="comments"
        repo="widcardw/giscus-discussion"
        repo-id="R_kgDOHOA75A"
        category="Announcements"
        category-id="DIC_kwDOHOA75M4COuTG"
        mapping="pathname"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="bottom"
        :theme="isDark ? 'dark' : 'light'"
        lang="en"
        loading="lazy"
        async
      />
    </template>
  </div>
</template>
