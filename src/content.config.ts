import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  // Content Layer API：v6 起旧版集合已移除，必须显式声明 loader。
  // 旧版集合会隐式忽略以 `_` 开头的文件/目录（如 _templates、_Excalidraw），
  // 新 loader 不会，所以这里用负向模式把这条规则显式补回来。
  loader: glob({
    base: './src/content/blog',
    pattern: ['**/*.{md,mdx}', '!**/_*/**', '!**/_*'],
  }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    updatedDate: z
      .string()
      .or(z.date())
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
})

export const collections = { blog }
