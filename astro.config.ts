import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { remarkMark } from 'remark-mark-highlight'
import { remarkCallouts } from '@widcardw/remark-callouts'
import remarkMath from 'remark-math'
import rehypeAsciimath from '@widcardw/rehype-asciimath'
import { remarkWikiLink } from './src/plugins/wiki/remarkWikiLink'
import { remarkWikiImage } from './src/plugins/wiki/remarkWikiImage'
import rehypeExternalLinks from 'rehype-external-links'
import solidJs from '@astrojs/solid-js'
import { remarkTransformGlSketch, sketchAutoImport } from './src/plugins/gl-preview/remark'
import AutoImport from 'astro-auto-import'
import { remarkCodeIcon } from './src/plugins/code-icon/remark'
import { remarkMermaid } from './src/plugins/mermaid/remark'
import { astroExpressiveCode } from 'astro-expressive-code'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'

// https://astro.build/config
export default defineConfig({
  site: 'https://widcard.win',
  integrations: [
    AutoImport({
      imports: [
        sketchAutoImport,
        {
          'astro-icon/components': ['Icon'],
        },
      ],
    }),
    astroExpressiveCode({
      themes: ['github-light', 'github-dark'],
      themeCssSelector(theme, { styleVariants }) {
        // If one dark and one light theme are available
        // generate theme CSS selectors compatible with cactus-theme dark mode switch
        if (styleVariants.length >= 2) {
          const baseTheme = styleVariants[0]?.theme
          const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme
          if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`
        }
        // return default selector
        return `[data-theme="${theme.name}"]`
      },
      styleOverrides: {
        codeFontFamily: 'var(--font-mono)',
      },
    }),
    mdx(),
    icon(),
    sitemap(),
    // astroCodeSnippets(),
    solidJs(),
    pagefind(),
  ],
  // 图片已随文章放在 posts/<分类>/assets/ 下，publicDir 回归 Astro 默认的 public/
  // compressHTML: Astro v7 起默认值变为 'jsx'，会按 JSX 规则剥掉内联元素之间的空白，
  // 可能让「Last updated on <time>」这类文案粘连。这里显式保留 v6 行为。
  compressHTML: true,
  markdown: {
    // v7 默认处理器换成了 Rust 实现的 Sätteri，不再支持 remark/rehype 插件生态。
    // 本项目重度依赖 remark 插件（wikilink、callouts、math、mermaid、gl-preview 等），
    // 因此显式切回 unified 处理器，插件配置从 markdown.remarkPlugins 迁入此处。
    processor: unified({
      gfm: true,
      remarkPlugins: [
        remarkMark,
        remarkCallouts,
        remarkMath,
        // used for math
        // remarkAsciiMath,
        // used for math
        [
          remarkWikiLink,
          {
            // wikiLinkResolver: wikilinkPageResolver
            pathFormat: 'obsidian-absolute',
            wikiLinkResolver: (target: string) => {
              // for [[#heading]] links
              if (!target) return []
              let permalink = target.replace(/\/index$/, '')
              // TODO what to do with [[index]] link?
              if (permalink.length === 0) permalink = '/'
              permalink = permalink.replace('_public/', '')
              return [permalink]
            },
          },
        ],
        // 必须排在 remarkWikiLink 之后：把图片嵌入节点转成标准 image 节点，
        // 交给 Astro 的图片管线做 webp 转换、懒加载和宽高推断。
        remarkWikiImage,
        remarkTransformGlSketch,
        remarkCodeIcon,
        [remarkMermaid, { includeLoading: true }],
      ],
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: 'nofollow',
          },
        ],
        rehypeAsciimath,
      ],
    }),
    shikiConfig: {
      theme: 'nord',
    },
  },
})
