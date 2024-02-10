import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkMark } from 'remark-mark-highlight';
import { remarkCallouts } from '@widcardw/remark-callouts';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkAsciiMath } from '@widcardw/remark-asciimath';
import { remarkWikiLink } from './src/plugins/wiki/remarkWikiLink';
import rehypeExternalLinks from 'rehype-external-links';
import solidJs from "@astrojs/solid-js";
import { remarkTransformGlSketch, sketchAutoImport } from './src/plugins/gl-preview/remark';
import AutoImport from 'astro-auto-import';
import { remarkCodeIcon } from './src/plugins/code-icon/remark';
import { remarkMermaid } from './src/plugins/mermaid/remark';
import { astroExpressiveCode } from 'astro-expressive-code'
import icon from 'astro-icon'


// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    AutoImport({
      imports: [sketchAutoImport, {
        'astro-icon/components': ['Icon']
      }]
    }),
    astroExpressiveCode({ themes: ['github-light', 'github-dark'] }),
    mdx(),
    icon(), 
    sitemap(),
    // astroCodeSnippets(),
    solidJs()
  ],
  publicDir: 'src/content/blog/_public',
  markdown: {
    gfm: true,
    remarkPlugins: [
      (remarkMark as any),
      remarkCallouts,
      remarkMath,
      // used for math
      remarkAsciiMath,
      // used for math
      [remarkWikiLink, {
        // wikiLinkResolver: wikilinkPageResolver
        pathFormat: 'obsidian-absolute',
        wikiLinkResolver: (target: string) => {
          // for [[#heading]] links
          if (!target) return [];
          let permalink = target.replace(/\/index$/, "");
          // TODO what to do with [[index]] link?
          if (permalink.length === 0) permalink = "/";
          permalink = permalink.replace('_public/', '');
          return [permalink];
        }
      }],
      remarkTransformGlSketch,
      remarkCodeIcon,
      [remarkMermaid, { includeLoading: true }],
    ],
    rehypePlugins: [
      rehypeKatex,
      [rehypeExternalLinks, {
        target: '_blank',
        rel: 'nofollow'
      }]
    ],
    shikiConfig: {
      theme: 'nord'
    }
  }
});