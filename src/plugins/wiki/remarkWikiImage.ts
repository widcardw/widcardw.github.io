import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { visit } from 'unist-util-visit'

/**
 * 把 wikilink 图片嵌入（`![[a.png]]`）转成标准 mdast `image` 节点，
 * 让 Astro 的图片管线（remark-collect-images → rehype-images → astro:assets）接手。
 *
 * Astro 特意把 `remarkCollectImages` 排在所有用户插件之后
 * （源码注释：Apply later in case user plugins resolve relative image paths），
 * 所以这里生成的 image 节点会被正常收集并优化。
 *
 * 设计为向后兼容：只有能解析到 src 下真实文件的图片才会被接管，
 * 解析不到的（例如仍放在 public 里的视频、动图）保持原 wikilink 行为。
 */

/**
 * 交给 Astro 图片管线处理的扩展名。
 *
 * 刻意不含 gif：实测动态 gif 会被转成动图 webp，帧数保留（89→88）但体积
 * 从 181K 涨到 468K，反而更大。gif 继续走 public 原样输出更划算。
 */
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg'])

export interface RemarkWikiImageOptions {
  /** 资源索引根目录，默认 src/content/blog */
  base?: string
}

interface AssetIndex {
  /** 相对根目录的路径 -> 绝对路径 */
  byRel: Map<string, string>
  /** 文件名 -> 绝对路径列表 */
  byName: Map<string, string[]>
}

function toFsPath(p: unknown): string | null {
  if (!p) return null
  if (p instanceof URL) return fileURLToPath(p)
  const s = String(p)
  return s.startsWith('file://') ? fileURLToPath(s) : s
}

function scan(root: string): AssetIndex {
  const byRel = new Map<string, string>()
  const byName = new Map<string, string[]>()

  const walk = (dir: string) => {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) continue
      byRel.set(path.relative(root, full).split(path.sep).join('/'), full)
      const list = byName.get(entry.name)
      if (list) list.push(full)
      else byName.set(entry.name, [full])
    }
  }

  walk(root)
  return { byRel, byName }
}

/** 模仿 Obsidian 的解析顺序：显式相对路径 → 相对当前文件 → 相对内容根 → 按文件名全局查找 */
function resolveAsset(
  target: string,
  mdDir: string,
  index: AssetIndex,
): string | null {
  const clean = target.split('#')[0].trim()
  if (!clean) return null

  if (clean.startsWith('./') || clean.startsWith('../')) {
    const abs = path.resolve(mdDir, clean)
    return fs.existsSync(abs) ? abs : null
  }

  if (clean.includes('/')) {
    const near = path.resolve(mdDir, clean)
    if (fs.existsSync(near)) return near
    const byRel = index.byRel.get(clean)
    if (byRel) return byRel
    return null
  }

  const sameDir = path.join(mdDir, clean)
  if (fs.existsSync(sameDir)) return sameDir

  const candidates = index.byName.get(clean)
  if (!candidates?.length) return null
  return candidates[0]
}

export function remarkWikiImage(opts: RemarkWikiImageOptions = {}) {
  const root = opts.base ?? path.resolve(process.cwd(), 'src/content/blog')
  let index = scan(root)

  return (tree: unknown, file: { path?: unknown }) => {
    const mdPath = toFsPath(file?.path)
    if (!mdPath) return
    const mdDir = path.dirname(mdPath)

    visit(tree as never, 'wikiLink', (node: any, i: number | undefined, parent: any) => {
      if (!node?.data?.isEmbed) return
      if (!parent?.children || typeof i !== 'number') return

      const target: string = node.data.target ?? ''
      const ext = path.extname(target.split('#')[0]).toLowerCase()
      if (!IMAGE_EXT.has(ext)) return

      let abs = resolveAsset(target, mdDir, index)
      if (!abs) {
        // 可能是刚粘贴进 vault 的新图片，重扫一次索引
        index = scan(root)
        abs = resolveAsset(target, mdDir, index)
      }
      if (!abs) return

      const rel = './' + path.relative(mdDir, abs).split(path.sep).join('/')

      parent.children[i] = {
        type: 'image',
        url: rel,
        alt: node.data.alias || path.basename(target),
        title: null,
        position: node.position,
      }

      // 跳过新节点，避免 visit 继续往里走
      return i
    })
  }
}

export default remarkWikiImage
