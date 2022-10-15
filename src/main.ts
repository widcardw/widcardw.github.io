// import { createApp } from 'vue'
// import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
// import { createHead } from '@vueuse/head'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'mdit-plugin-callouts/index.css'
import './styles/heti.css'
import './styles/heti-ext.css'
import 'uno.css'
import type { UserModule } from './types'

const routes = setupLayouts(generatedRoutes)

// const app = createApp(App)
// const head = createHead()
// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
// })
// app.use(router).use(head)
// app.mount('#app')

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)
