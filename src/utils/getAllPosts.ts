import { getCollection, type CollectionEntry } from 'astro:content'

export async function getAllPosts(): Promise<Array<CollectionEntry<'blog'>>> {
  return await getCollection('blog')
}

export async function getSortedPosts(): Promise<
  Array<CollectionEntry<'blog'>>
> {
  const posts = await getAllPosts()
  return posts.sort((a, b) => {
    return (
      new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    )
  })
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
