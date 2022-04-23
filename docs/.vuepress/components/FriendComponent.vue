<script setup lang="ts">
import { ref } from 'vue'

import Friend from './Friend.ts'
const props = defineProps<{ friend: Friend }>()
</script>

<template>
    <a :href="friend.link" target="_blank">
        <div class="component">
                <img :src="friend.avatar" class="avatar" />
            <div class="name">{{ friend.name }}</div>
            <div class="description">{{ friend.description }}</div>
        </div>
    </a>
</template>

<style scoped>
.component {
    text-align: center;
    width: 200px;
    /* height: 200px; */
    transition: ease 0.5s;
    border-radius: 5px;
    color: #3a5169;
    background-color: var(--bg-color-float);
    padding: 30px;
}

.component:hover {
    transform: scale(1.05);
    box-shadow: 0 1px 3px 1px var(--card-shadow);
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.name {
    font-size: 20px;
    font-weight: bold;
    margin-top:10px;
    margin-bottom: 10px;
}

.description {
    font-size: 16px;
}
</style>