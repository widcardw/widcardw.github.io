import { getCollection, type CollectionEntry } from 'astro:content'

export async function getAllPosts(): Promise<Array<CollectionEntry<'blog'>>> {
  return await getCollection('blog')
}

export async function getSortedPosts(): Promise<Array<CollectionEntry<'blog'>>> {
  const posts = await getAllPosts()
  // 与列表上展示的日期保持一致：优先用 updatedDate，没有才退回 pubDate。
  // 之前按 pubDate 排、却显示 updatedDate，会让「最近更新」的文章排在中段。
  return sortMDByDate(posts)
}

export function sortMDByDate(posts: Array<CollectionEntry<'blog'>>) {
  return posts.sort((a, b) => {
    const aDate = new Date(a.data.updatedDate ?? a.data.pubDate).valueOf()
    const bDate = new Date(b.data.updatedDate ?? b.data.pubDate).valueOf()
    return bDate - aDate
  })
}

export function getAllTags(posts: Array<CollectionEntry<'blog'>>) {
  return posts.flatMap((post) => [...post.data.tags])
}

export function getUniqueTags(posts: Array<CollectionEntry<'blog'>>) {
  return Array.from(new Set(getAllTags(posts)))
}

export function getUniqueTagsWithCount(
  posts: Array<CollectionEntry<'blog'>>,
): Array<[string, number]> {
  return [
    ...getAllTags(posts).reduce(
      (acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
      new Map<string, number>(),
    ),
  ].sort((a, b) => b[1] - a[1])
}
