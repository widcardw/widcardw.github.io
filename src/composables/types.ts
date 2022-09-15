interface Post {
  path: string
  title: string
  date: string
  category?: string
  tags?: string[]
  abstract?: string
}

interface MyRouteMeta {
  title: string
  date: string
  category?: string
  tags?: string[]
  abstract?: string
}

export {
  Post,
  MyRouteMeta,
}
