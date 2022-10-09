<script setup lang="ts">
import type { VNode } from 'vue'
import { createTextVNode } from 'vue'
import type { MyRouteMeta } from '~/composables/types'

defineProps<{
  frontmatter?: MyRouteMeta
}>()

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
  <div class="heti heti--classic prose-style m-auto text-left">
    <slot />
    <div v-if="frontmatter?.category" flex>
      <Tag :label="frontmatter?.category">
        <div i-ri-book-mark-line />
      </Tag>
    </div>
    <div v-if="frontmatter?.tags" flex>
      <Tag v-for="tag in frontmatter?.tags" :key="tag" :label="tag">
        <div i-ri-hashtag />
      </Tag>
    </div>
    <p v-if="route.path !== '/'">
      <a
        href="#" class="font-mono no-underline opacity-50 hover:opacity-75"
        @click="router.back()"
      >
        back
      </a>
    </p>
    <template v-if="(route.path.startsWith('/posts') && !route.path.endsWith('/posts')) || (route.path.startsWith('/secrets') && !route.path.endsWith('/secrets'))">
      <render-giscus />
    </template>
  </div>
</template>
