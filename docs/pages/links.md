---
home: true
icon: home
title: 友情链接
heroText: 友情链接
tagline: 这里聚集了一群大佬
---

<div class="my-link-area">
  <FriendComponent v-for='it in friends' :friend='it' style="margin: 10px;"></FriendComponent>
</div>


<script setup lang="ts">
import FriendComponent from '@MyComponent'
import Friend from '../.vuepress/components/Friend'

const friends: Friends[] = [{
  name: '鹤翔万里',
  avatar: 'http://blog.tonycrane.cc/tonycrane.png',
  description: '翔哥永不咕！',
  link: 'http://blog.tonycrane.cc/'
},{
  name: 'GZTime',
  avatar: 'https://cdn.gztime.cc/avatar/GZTime_2021.png',
  description: 'Walking on the Time Axis.',
  link: 'https://blog.gztime.cc'
},{
  name: 'Matheart',
  avatar: 'https://matheart.github.io/media/profile.jpg',
  description: 'Math Heart Ever.',
  link: 'https://matheart.github.io/'
},{
  name: '范滇东',
  avatar: 'https://z3.ax1x.com/2021/06/16/2LUYQA.jpg',
  description: '三体 × 摄影 × 造物',
  link: 'https://flwfdd.xyz/'
},{
  name: 'HK-SHAO',
  avatar: 'https://hk-shao.github.io/img/avatar.png',
  description: 'A human.',
  link: 'https://hk-shao.github.io/'
},{
  name: '你们的小f',
  avatar: 'https://www.fzf404.top/public/avatar.jpg',
  description: '修炼中',
  link: 'https://www.fzf404.top/'
}]

</script>

<style>
  .my-link-area {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
  }
</style>