import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createHead } from '@vueuse/head'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/callouts.css'
import './styles/heti-ext.css'
import 'uno.css'
import './styles/heti.css'

const routes = setupLayouts(generatedRoutes)

const app = createApp(App)
const head = createHead()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router).use(head)
app.mount('#app')

