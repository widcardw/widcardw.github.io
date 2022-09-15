<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div
    flex items-center
    p-4 sm:p-6
    fixed w-full h-3rem sm:h-4rem
    backdrop-blur class="font-serif"
    z-999
  >
    <router-link to="/">
      widcardw
    </router-link>
    <div flex-1 />
    <div flex space-x-4 items-center>
      <a icon-btn i-ri-article-line title="blog" @click="router.push('/posts')" />
      <a icon-btn i-ri-link-m title="links" @click="router.push('/friends')" />
      <a href="https://slides.widcard.win" target="_blank" icon-btn i-ri-slideshow-2-line title="slides" />
      <a href="https://space.bilibili.com/31976300" target="_blank" icon-btn i-ri-bilibili-fill title="bilibili" />
      <a href="https://www.zhihu.com/people/wu-hua-rou-68-55" target="_blank" icon-btn i-ri-zhihu-fill title="zhihu" />
      <a href="https://github.com/widcardw" target="_blank" icon-btn i-ri-github-fill title="github" />
      <div icon-btn @click="toggleDark()">
        <div v-if="isDark" i-ri-moon-line />
        <div v-else i-ri-sun-line />
      </div>
    </div>
  </div>
</template>
