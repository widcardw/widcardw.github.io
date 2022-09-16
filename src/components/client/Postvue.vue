<script setup lang="ts">
import type { VNode } from 'vue'
import { createTextVNode } from 'vue'

// import Giscus from '@giscus/vue'
const router = useRouter()
const route = useRoute()
const loaded = ref(false)
onMounted(async () => {
  await import('giscus')
  loaded.value = true
})

function renderGiscus(): VNode {
  const config = computed(() => ({
    id: 'comments',
    repo: 'widcardw/giscus-discussion',
    repoid: 'R_kgDOHOA75A',
    category: 'Announcements',
    categoryid: 'DIC_kwDOHOA75M4COuTG',
    term: 'Welcome to giscus!',
    mapping: 'url',
    reactionsenabled: '1',
    emitmetadata: '0',
    inputposition: 'bottom',
    theme: isDark.value ? 'dark' : 'light',
    lang: 'en',
    loading: 'lazy',
  }))
  return h('div',
    loaded.value
      ? h('giscus-widget', config.value)
      : createTextVNode('Loading...'),
  )
}
</script>

<template>
  <div class="heti heti--classic m-auto text-left p-2">
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
      <!-- <Giscus
        id="comments"
        repo="widcardw/giscus-discussion"
        repo-id="R_kgDOHOA75A"
        category="Announcements"
        category-id="DIC_kwDOHOA75M4COuTG"
        term="Welcome to giscus!"
        mapping="pathname"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="bottom"
        :theme="isDark ? 'dark' : 'light'"
        lang="en"
        loading="lazy"
      /> -->
      <render-giscus />
    </template>
  </div>
</template>
