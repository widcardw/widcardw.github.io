// borrowed from antfu.me

import { dirname } from 'path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import type { FeedOptions, Item } from 'feed'
import { Feed } from 'feed'
import MarkdownIt from 'markdown-it'
// @ts-expect-error declaration
import markdownItMark from 'markdown-it-mark'
import DoubleBracketMedia from 'mdit-plg-double-bracket-media'
import DoubleBracketLink from 'mdit-plg-double-bracket-link'
import CalloutPlugin from 'mdit-plugin-callouts'
import matter from 'gray-matter'

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

md.use(markdownItMark)
md.use(CalloutPlugin)
md.use(DoubleBracketMedia, { removePrefix: 'public/' })
md.use(DoubleBracketLink, { removePrefix: 'pages/' })

const DOMAIN = 'https://widcard.win'
const AUTHOR = {
  name: 'widcardw',
  email: 'widcardw@foxmail.com',
  link: DOMAIN,
}

async function writeFeed(name: string, options: FeedOptions, items: Item[]) {
  options.author = AUTHOR
  options.image = 'https://widcard.win/avatar/avatar-round.png'
  options.favicon = 'https://widcard.win/avatar/avatar-round.png'

  const feed = new Feed(options)

  items.forEach((item) => {
    feed.addItem(item)
  })

  await fs.ensureDir(dirname(`./dist/${name}`))
  await fs.writeFile(`./dist/${name}.xml`, feed.rss2(), 'utf-8')
  await fs.writeFile(`./dist/${name}.atom`, feed.atom1(), 'utf-8')
  await fs.writeFile(`./dist/${name}.json`, feed.json1(), 'utf-8')
}

async function buildBlogRSS() {
  const files = await fg(['pages/posts/**/*.md', 'pages/secrets/**/*.md'])

  const options = {
    title: 'widcardw',
    description: 'widcardw\'s blog',
    id: 'https://widcard.win/',
    link: 'https://widcard.win/',
    copyright: '',
    feedLinks: {
      json: 'https://widcard.win/feed.json',
      atom: 'https://widcard.win/feed.atom',
      rss: 'https://widcard.win/feed.xml',
    },
  }
  const posts: any[] = (
    await Promise.all(
      files.filter(i => !i.includes('index'))
        .map(async (i) => {
          const raw = await fs.readFile(i, 'utf-8')
          const { data, content } = matter(raw)

          const html = md.render(content)
            .replace('src="/', `src="${DOMAIN}/`)

          if (data.image?.startsWith('/'))
            data.image = DOMAIN + data.image

          return {
            ...data,
            date: new Date(data.date),
            content: html,
            author: [AUTHOR],
            link: DOMAIN + i.replace(/^pages(.+)\.md$/, '$1'),
          }
        }),
    ))
    .filter(Boolean)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 10)

  await writeFeed('feed', options, posts)
}

async function run() {
  await buildBlogRSS()
}

run()
