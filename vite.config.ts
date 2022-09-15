/// <reference types="vitest" />

import fs from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Markdown from 'vite-plugin-md'
import Prism from 'markdown-it-prism'
import matter from 'gray-matter'
import LinkAttributes from 'markdown-it-link-attributes'
// @ts-expect-error declaration
import markdownItKatex from 'markdown-it-new-katex'
import markdownItAnchor from 'markdown-it-anchor'
// @ts-expect-error declaration
import markdownItTableOfContents from 'markdown-it-table-of-contents'
// @ts-expect-error declaration
import markdownItMark from 'markdown-it-mark'
import markdownCallouts from 'vitepress-plugin-callout'
import doubleBracketLink from './src/composables/plugins/double-bracket-link'
import doubleBracketMedia from './src/composables/plugins/double-bracket-media'
import { mermaidPlugin } from './src/composables/plugins/mermaid'
import type { MyRouteMeta } from './src/composables/types'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      template: {
        compilerOptions: {
          // 消除 markdwn it 中 KaTeX 内部的警告
          isCustomElement: tag => ['mtext', 'msup', 'annotation', 'mtext-inline', 'semantics', 'mrow', 'math', 'mo', 'mn', 'mi', 'mstyle', 'mtd', 'mtr', 'mtable'].includes(tag),
        },
      },
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        if (!path.includes('projects.md') && !path.includes('friends.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const { data } = matter(md)
          if (!data.title) {
            const match = md.match(/# [\S ]+/)
            if (match)
              data.title = match[0].slice(1).trim()

            else throw new Error('Post without title!')
          }
          route.meta = Object.assign(route.meta || {}, { frontmatter: data }) as MyRouteMeta
        }

        return route
      },
    }),

    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
        '@vueuse/head',
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    Markdown({
      wrapperComponent: 'Postvue',
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
        md.use(markdownItKatex)
        md.use(markdownItMark)
        md.use(markdownItAnchor)
        md.use(markdownCallouts)
        md.use(doubleBracketLink)
        md.use(doubleBracketMedia)
        md.use(markdownItTableOfContents, {
          includeLevel: [2, 3, 4],
          containerHeaderHtml: '<h3>目录</h3>',
        })
        md.use(mermaidPlugin)
      },
    }),
  ],
})