<script setup lang="ts">
const friends = [{
  name: '鹤翔万里',
  avatar: '/avatar/tonycrane.png',
  desc: '翔哥永不咕！',
  link: 'http://blog.tonycrane.cc/',
}, {
  name: 'GZTime',
  avatar: '/avatar/GZTime_2021.png',
  desc: 'Walking on the Time Axis.',
  link: 'https://blog.gztime.cc',
}, {
  name: 'Matheart',
  avatar: '/avatar/matheart.webp',
  desc: 'Math Heart Ever.',
  link: 'https://matheart.github.io/',
}, {
  name: '范滇东',
  avatar: '/avatar/flwfdd.jpeg',
  desc: '三体 × 摄影 × 造物',
  link: 'https://flwfdd.xyz/',
}, {
  name: 'HK-SHAO',
  avatar: '/avatar/hk-shao.png',
  desc: 'A human.',
  link: 'https://hk-shao.github.io/',
}, {
  name: '你们的小f',
  avatar: '/avatar/fzf404.jpeg',
  desc: '修炼中',
  link: 'https://www.fzf404.top/',
}]
</script>

<template>
  <Friend
    v-for="f in friends" :key="f.name"
    :avatar="f.avatar" :name="f.name" :desc="f.desc" :url="f.link"
  />
</template>
