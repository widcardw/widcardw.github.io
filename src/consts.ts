// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { GiscusProps } from './components/Giscus/GiscusArea'

export const SITE_TITLE = 'widcardw'
export const SITE_DESCRIPTION = 'Welcome to my website!'

type GiscusPropsFull = GiscusProps & { enabled: boolean }

export const GISCUS: GiscusPropsFull = {
  enabled: true,
  id: 'comments',
  repo: 'widcardw/giscus-discussion',
  repoId: 'R_kgDOHOA75A',
  category: 'Announcements',
  categoryId: 'DIC_kwDOHOA75M4COuTG',
  term: 'Welcome',
  mapping: 'url',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'en',
  loading: 'lazy',
}
