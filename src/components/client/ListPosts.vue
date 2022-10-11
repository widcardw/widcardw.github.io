<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Post } from '~/composables/types'
// import { dateLineToSlash } from '~/composables/utils/formatDate'
import { usePage } from '~/stores/page'

const props = defineProps<{
  posts?: Post[]
  prefix: string
}>()

const router = useRouter()

const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith(props.prefix) && !i.path.endsWith(props.prefix) && i.name && (i.meta.frontmatter as any).date)
  // .map((i) => {
  //   (i.meta.frontmatter as any).date = dateLineToSlash((i.meta.frontmatter as any).date)
  //   return i
  // })
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

const fcate = ref('')
const ftag = ref('')
const posts = computed(
  () => (props.posts || routes)
    .filter(it => (fcate.value.trim() === '' && true) || it.category === fcate.value)
    .filter(it => (ftag.value.trim() === '' && true) || it.tags?.includes(ftag.value)),
)

const { currentPage } = storeToRefs(usePage())
const pageSize = ref(10)
</script>

<template>
  <template v-if="!posts || !posts.length">
    <div op-50>
      Nothing here yet.
    </div>
  </template>
  <template v-else>
    <div v-if="fcate.trim() !== '' || ftag.trim() !== ''" flex="~ wrap">
      <span m="b-1 r-1">filter</span>
      <Tag
        v-if="fcate"
        :label="fcate"
        :closable="true"
        @close="fcate = ''"
      >
        <div i-ri-book-mark-line />
      </Tag>
      <Tag
        v-if="ftag"
        :label="ftag"
        :closable="true"
        @close="ftag = ''"
      >
        <div i-ri-hashtag icon-btn />
      </Tag>
    </div>
    <PostLink
      v-for="route in posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
      :key="route.path"
      :path="route.path"
      :title="route.title"
      :date="route.date"
      :category="route.category"
      :tags="route.tags"
      :abstract="route.abstract"
      @update:fcate="(event: string) => { fcate = event; currentPage = 1; }"
      @update:ftag="(event: string) => { ftag = event; currentPage = 1; }"
    />
    <Pagenation v-model:cur="currentPage" :size="pageSize" :total="posts.length" />
  </template>
</template>
