import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { remarkMark } from 'remark-mark-highlight'
import { remarkCallouts } from '@widcardw/remark-callouts'
import remarkMath from 'remark-math'
import rehypeAsciimath from '@widcardw/rehype-asciimath'
import { remarkWikiLink } from './src/plugins/wiki/remarkWikiLink'
import rehypeExternalLinks from 'rehype-external-links'
import solidJs from '@astrojs/solid-js'
import {
  remarkTransformGlSketch,
  sketchAutoImport,
} from './src/plugins/gl-preview/remark'
import AutoImport from 'astro-auto-import'
import { remarkCodeIcon } from './src/plugins/code-icon/remark'
import { remarkMermaid } from './src/plugins/mermaid/remark'
import { astroExpressiveCode } from 'astro-expressive-code'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
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
          const altTheme = styleVariants.find(
            (v) => v.theme.type !== baseTheme?.type,
          )?.theme
          if (theme === baseTheme || theme === altTheme)
            return `[data-theme='${theme.type}']`
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
  ],
  publicDir: 'src/content/blog/_public',
  markdown: {
    gfm: true,
    remarkPlugins: [
      remarkMark as any,
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
    shikiConfig: {
      theme: 'nord',
    },
  },
})
