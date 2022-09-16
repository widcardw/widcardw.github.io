<script setup lang="ts">
import type { Post } from '~/composables/types'
import { dateLineToSlash } from '~/composables/utils/formatDate'

const props = defineProps<{
  posts?: Post[]
}>()

const router = useRouter()

const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && !i.path.endsWith('/posts') && i.name && (i.meta.frontmatter as any).date)
  .map((i) => {
    (i.meta.frontmatter as any).date = dateLineToSlash((i.meta.frontmatter as any).date)
    return i
  })
  .sort((a, b) => +new Date((b.meta.frontmatter as any).date) - +new Date((a.meta.frontmatter as any).date))
  .filter(i => !i.path.endsWith('.html'))
  .map(i => ({
    path: i.path,
    title: (i.meta.frontmatter as any).title,
    date: (i.meta.frontmatter as any).date,
    category: (i.meta.frontmatter as any).category,
    tags: (i.meta.frontmatter as any).tags,
    abstract: (i.meta.frontmatter as any).abstract,
  }))

const posts = computed(() => (props.posts || routes))
const currentPage = useStorage('w-currentPage', 1)
const pageSize = ref(10)
</script>

<template>
  <template v-if="!posts || !posts.length">
    <div op-50>
      Nothing here yet.
    </div>
  </template>
  <div
    v-for="route in posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
    :key="route.path"
  >
    <PostLink
      :path="route.path"
      :title="route.title"
      :date="route.date"
      :category="route.category"
      :tags="route.tags"
      :abstract="route.abstract"
    />
  </div>
  <Pagenation v-model:cur="currentPage" :size="pageSize" :total="posts.length" />
</template>
