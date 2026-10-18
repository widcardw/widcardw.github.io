---
title: 如何编写 unified 插件 (3) rehype
pubDate: 2024-02-12
updatedDate: 2026-10-18
tags:
  - remark
  - rehype
  - markdown
  - unified
  - mdx
  - AI生成
description: 前两篇都在 mdast 上做文章，这一篇换个战场：hast 到底长什么样、remark-rehype 中间做了什么转换、以及用 visit 操作 HTML 树的几个实战例子和踩坑记录
---

## 回顾

前两篇分别讲了两种在 **mdast** 上动手的方式：

- 第一篇：用 `unist-util-visit` 遍历语法树，匹配节点、就地替换
- 第二篇：用 micromark + mdast-util 的 `enter` & `exit`，从 token 层面定义新语法

这一篇转向 **rehype**，也就是等语法树变成 HTML 之后，我们还能做什么。

## 为什么还需要 rehype

既然 remark 阶段已经能改语法树了，为什么还要多一层？因为有一类需求在 mdast 上根本表达不出来：

- **需要知道最终的 HTML 结构**。比如想让宽表格在移动端横向滚动，得把 `<table>` 包进一个 `<div class="table-wrapper">`——可 mdast 里只有 `table` 节点，没有「div」这个概念。
- **需要统一处理某些标签**。所有外链加 `target="_blank"`、所有图片加 `loading="lazy"`，这类事情按标签名批量处理最方便。
- **需要处理原始 HTML**。markdown 里混写的 `<details>`、`<kbd>`，在 mdast 里只是一个 `html` 字符串节点，不结构化，没法用节点方式改。

一句话概括：**mdast 是语义树，hast 是 DOM 树**。前者关心「这是一段代码」，后者关心「这是一个 `<pre><code>`」。

## hast 长什么样

hast 的节点类型比 mdast 少得多，核心就几种：

| 类型 | 说明 |
| --- | --- |
| `root` | 整棵树的根 |
| `element` | 任意 HTML 元素 |
| `text` | 文本 |
| `comment` | 注释 |
| `raw` | 尚未解析的原始 HTML 字符串 |

`element` 节点是这样：

```ts
const link = {
  type: 'element',
  tagName: 'a',
  properties: { href: '/blog/', className: ['internal', 'new'] },
  children: [{ type: 'text', value: '点击这里' }],
}
```

和 mdast 相比有几处关键差异，写插件时最容易在这上面翻车：

- 用 `tagName` 描述标签，而不是 `type`
- 属性叫 `properties`，不叫 `attributes`
- `class` 要写成 `className`，而且值是**数组**，不是空格分隔的字符串
- `style` 写成对象（或字符串），不是一段 CSS 文本

## mdast 到 hast：remark-rehype 做了什么

这一步是理解 rehype 插件的关键。`remark-rehype` 本质上是一张映射表：

| mdast | hast |
| --- | --- |
| `heading` | `h1` ~ `h6` |
| `paragraph` | `p` |
| `emphasis` | `em` |
| `strong` | `strong` |
| `inlineCode` | `code` |
| `code` | `pre > code` |
| `link` | `a` |
| `image` | `img` |
| `list` | `ul` / `ol` + `li` |
| `blockquote` | `blockquote` |
| `thematicBreak` | `hr` |

上一篇提到的 `hName` 和 `hProperties` 就是在这里生效的：如果 mdast 节点自带 `data.hName`，`remark-rehype` 会优先采用它，而不是按默认映射走。这也是为什么很多 remark 插件压根不写 rehype 部分——它们在 remark 阶段就把 `hName` 设好了。

> [!tip] 未被映射的节点会怎样
> 如果某个节点类型没有对应的 handler，默认会被**丢掉**。要么在 `remark-rehype` 的 `passThrough` 里声明它，让它原样传到 hast；要么自己写 handler。remark-math 的 `math` 节点就需要 `passThrough: ['math', 'inlineMath']`，否则在 rehype 阶段什么都看不到。

## 写一个 rehype 插件

结构和 remark 插件几乎一样，区别只在于遍历的树：

```ts
import { visit } from 'unist-util-visit'
import type { Root } from 'hast'

export function rehypePlugin() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'a') return
      // 在这里改 node / parent
    })
  }
}
```

`visit` 的第二个参数可以直接写 `'element'`，所有元素节点都会进回调，再自己按 `tagName` 分流；也可以写 `'table'`、`'pre'` 这种具体标签，让 `visit` 帮你筛。

### visit 的返回值：最容易翻车的地方

回调的返回值不是「随便返回什么都行」，它有确切语义：

| 返回 | 含义 |
| --- | --- |
| `undefined` | 继续，并且会下探当前节点的子节点 |
| `SKIP` | 跳过当前节点的**子节点**，接着访问下一个兄弟 |
| `EXIT` | 立刻结束整趟遍历 |
| `index`（数字） | 从 `parent.children[index]` 继续 |
| `[SKIP, index]` | 跳过子节点，再从 `index` 继续 |

`SKIP` 的值是字符串 `'skip'`，`EXIT` 是 `false`，都是具名导出，别自己写魔法值。

**替换节点时最容易出事。** 假设要把 `table` 包进一个 `div`：

```ts
parent.children[index] = wrapper // 现在的 node 已经不在树上了
return index // ← 危险
```

返回 `index` 会让 `visit` 从 `parent.children[index]` 继续——也就是刚建的那个 `wrapper`。它进 `wrapper`、下探子节点、又遇到 `table`、又包一层……**无限递归**。

这个坑在初稿里真的出现过：一开始靠「看 `parent.children[index - 1]` 是不是已经包过」兜底，看起来能跑，实测直接爆栈。正确做法是把判断放在 `parent` 上，再配 `[SKIP, index]`。下面第 2 个例子是修正版。

### 顺手的小工具：`h()`

手写 `{ type: 'element', tagName: 'div', ... }` 很啰嗦，`hastscript` 的 `h()` 能省不少事：

```ts
import { h } from 'hastscript'

const wrapper = h('div', { className: ['table-wrapper'] }, [node])
// → { type: 'element', tagName: 'div',
//     properties: { className: ['table-wrapper'] },
//     children: [node] }
```

`h('div.foo#bar')` 这种 CSS 选择器写法也支持，做容器类插件时很顺手。

## 实战：四个例子

### 1. 给外链统一加 target 和 rel

这是 `rehype-external-links` 的核心逻辑，自己写一遍也就十几行：

```ts
import { visit } from 'unist-util-visit'

export function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return
      const href = node.properties?.href
      if (typeof href !== 'string') return
      // 站内链接和锚点不动
      if (href.startsWith('/') || href.startsWith('#')) return

      node.properties.target = '_blank'
      node.properties.rel = ['nofollow', 'noopener']
    })
  }
}
```

本站用的就是这个包，配置很朴素：

```ts
// astro.config.ts
rehypePlugins: [
  [rehypeExternalLinks, { target: '_blank', rel: 'nofollow' }],
  rehypeAsciimath,
]
```

> [!note] rel 要写成数组
> `properties` 里的多值属性（`rel`、`className`）都是数组。写成字符串 `'nofollow noopener'` 在序列化时会被当成单个值，虽然浏览器多半能忍，但不合规范。

### 2. 给表格套一层滚动容器

这个在 mdast 阶段做不到，因为要凭空造一个 `div`：

```ts ins={9,10,11,12,13,14,15,16,18}
import { visit, SKIP } from 'unist-util-visit'

export function rehypeTableWrapper() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table') return
      if (!parent || typeof index !== 'number') return
      // 关键：判断父节点是不是已经是容器，而不是看兄弟节点
      if (parent.properties?.className?.includes('table-wrapper')) return

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrapper'] },
        children: [node],
      }
      // 跳过新节点的子节点，避免再钻进去包一遍
      return [SKIP, index]
    })
  }
}
```

两处和直觉相反的地方：

- **守卫要看 `parent`，不能看 `parent.children[index - 1]`**。包好之后 `table` 的 `parent` 变成了那个 `div`，用父节点判断是稳定收敛的；看前一个兄弟则完全取决于位置，表格在列表或引用块里时判断会失效。
- **`[SKIP, index]` 而不是 `index`**。`SKIP` 保证不再下探，`index` 让遍历继续往下走而不是从头开始。

配合一段 CSS，宽表格就不会把页面撑破了：

```css
.table-wrapper {
  overflow-x: auto;
}
```

### 3. 给代码块补一个语言标签

假设想让每个代码块右上角显示语言名。因为 rehype 插件跑在 shiki 之后（原因见下一节），此时 `<pre>` 上已经有 `data-language` 了：

```ts
export function rehypeCodeLanguage() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return
      // data-language → properties.dataLanguage，注意驼峰
      const lang = node.properties?.dataLanguage
      if (typeof lang !== 'string') return

      node.children.unshift({
        type: 'element',
        tagName: 'span',
        properties: { className: ['code-lang'] },
        children: [{ type: 'text', value: lang }],
      })
    })
  }
}
```

这里只是往子节点数组前面 `unshift` 一个元素，没有替换节点，所以不需要返回值。

### 4. 把一个节点换成一串节点

前三个例子都是「改属性」或「一对一替换」。还有一类需求是**一对多**：把某个节点换成若干个新节点。本站的 `@widcardw/rehype-asciimath` 就是这种——它把 `language-math` 的代码块交给 KaTeX 渲染，再塞回语法树：

```ts
import { toText } from 'hast-util-to-text'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { SKIP, visitParents } from 'unist-util-visit-parents'

export function rehypeAsciimath(options) {
  return (tree, file) => {
    visitParents(tree, 'element', (element, parents) => {
      const classes = Array.isArray(element.properties.className)
        ? element.properties.className
        : []
      if (!classes.includes('language-math')) return

      // code 套在 pre 里时，要替换的是 pre，不是 code
      let parent = parents[parents.length - 1]
      let scope = element
      if (element.tagName === 'code' && parent?.tagName === 'pre') {
        scope = parent
        parent = parents[parents.length - 2]
      }
      if (!parent) return

      const value = toText(scope, { whitespace: 'pre' })
      let result
      try {
        result = katex.renderToString(value, { displayMode: true, throwOnError: true })
      } catch (error) {
        // 不要 throw，挂到 vfile 上，构建继续
        file.message('Could not render math with KaTeX', {
          ancestors: [...parents, element],
          cause: error,
          place: element.position,
          source: 'rehype-asciimath',
        })
        return
      }

      // KaTeX 吐的是 HTML 字符串，先转回 hast
      const nodes = fromHtmlIsomorphic(result, { fragment: true }).children

      // 一个节点 → 一串节点
      const index = parent.children.indexOf(scope)
      parent.children.splice(index, 1, ...nodes)
      return SKIP
    })
  }
}
```

这个例子能带出四个前面没提的点：

- **`visitParents` 而不是 `visit`**。要判断「`code` 的父级是不是 `pre`」，普通 `visit` 只给一层 `parent`，够不到祖父。`visitParents` 给整条祖先链。
- **`splice(index, 1, ...nodes)`** 是一对多替换的标准写法。用 `parent.children[index] = nodes` 会把数组当节点塞进去，序列化时直接报错。
- **`return SKIP`** 是必须的。新插入的是 KaTeX 生成的整棵树，里面可能还带 `language-math` 类名，不跳过会被二次处理。
- **`file.message()` 而不是 `throw`**。rehype 插件抛异常会让整个构建失败；挂到 vfile 上，Astro 只会把它当一条构建警告打出来，单篇文章出错不至于拖垮全站。

## 插件顺序：在 Astro 里尤其重要

rehype 插件看不到 mdast，这是设计使然。但更实际的问题是：**你的插件到底跑在哪一步**。

Astro 的 `@astrojs/markdown-remark` 装配顺序大致如下（读源码确认过）：

```
用户 remark 插件
remark-collect-images
remark-rehype
rehype-shiki          ← 代码高亮在这里
用户 rehype 插件       ← 你在这里
rehype-images
rehype-heading-ids
rehype-raw            ← 原始 HTML 在这里才被解析
rehype-stringify
```

由此可以推出两件很实用的事：

1. **你的 rehype 插件能看到 shiki 生成的代码块**，`<pre>` 上已经有 `class="astro-code"` 和 `data-language`，所以上面那个语言标签的例子成立。
2. **你的 rehype 插件看不到原始 HTML 解析后的结构**。markdown 里写的 `<details>`，在你这儿仍然是 `raw` 节点，不是 `element`。要处理它们，得把插件排在 `rehype-raw` 之后——但在 Astro 里这个位置不归你控制，只能退而求其次，改用 `visit(tree, 'raw', ...)` 自己处理字符串。

> [!warning] 想在 rehype 阶段拿到 mdast 的信息
> 有个惯用做法：在 remark 阶段把信息塞进 `node.data.hProperties`，`remark-rehype` 会把它原样带到 hast 的 `properties` 上。比如标记「这段代码来自哪个文件」，remark 阶段写 `data.hProperties['data-file'] = path`，rehype 阶段就能直接读。这比在 rehype 阶段反推结构可靠得多。

## 几个常见的坑

- **`className` 是数组**。`node.properties.className = 'foo'` 不会报错，但序列化结果可能不符合预期，正确写法是 `['foo']`。
- **替换节点后要 `return [SKIP, index]`，不是 `index`**。`index` 会让遍历继续深入新节点，一不小心就死循环——上面那个表格容器的例子就是这么翻车的。
- **`properties` 的键是驼峰**。`data-language` 读的时候是 `dataLanguage`，`aria-label` 是 `ariaLabel`。写错不报错，只会安静地拿到 `undefined`。
- **`splice` 的第三个参数要展开**。`splice(i, 1, nodes)` 塞进去的是一个数组，`splice(i, 1, ...nodes)` 才是多个节点。
- **别直接改 `tagName`**。把 `p` 改成 `div` 看似简单，但原来 `p` 的子节点是按行内内容生成的，结构未必合法。
- **`properties` 里的布尔属性**。`hidden`、`controls` 这类写 `true` 即可，序列化器会处理成无值属性。
- **`raw` 节点不会自动变成 `element`**。这是上面提到的顺序问题，别指望在用户 rehype 插件里拿到解析好的原始 HTML。
- **别在插件里 `throw`**。用 `file.message()` 报错，单篇出问题不至于让整站构建失败。

## 三篇小结

写到这里，unified 插件的三条路都过了一遍。选择的时候可以按这个顺序判断：

1. **只是改语义结构**（把某种节点换成另一种、加 className、包一层）→ remark + `visit`，最省事
2. **要定义新语法**（`==高亮==`、`![[wikilink]]`、callout）→ micromark + mdast-util，工作量大但能做到底
3. **要改最终 HTML 结构或属性**（包容器、批量加属性、处理 shiki 产物）→ rehype + `visit`

三者的关系不是「一个比一个高级」，而是**按需求选最浅的那一层**。绝大多数需求在 remark 阶段用 `visit` 就能解决，硬上 micromark 只会让代码量翻十倍；反过来，需要定义新语法时用 `visit` 去啃字符串，最终一定是一堆正则和不完整的边界处理。

本站的插件栈（节选）正好三种都有：

| 插件 | 走的哪条路 | 干什么 |
| --- | --- | --- |
| `remarkCallouts` | remark + `visitParents` | `> [!tip]` 转成带样式的容器 |
| `remarkWikiLink` | micromark + mdast-util | 定义 `[[...]]` / `![[...]]` 语法 |
| `remarkWikiImage` | remark + `visit` | 把图片嵌入换成标准 `image` 节点，交给 Astro 图片管线 |
| `remarkMermaid` | remark + `visit` | 代码块换成 mermaid 容器 |
| `rehypeAsciimath` | rehype + `visitParents` | KaTeX 渲染，一对多替换 |
| `rehypeExternalLinks` | rehype + `visit` | 外链加 `target` / `rel` |

看这张表会发现一个规律：**micromark 只在「必须定义新语法」时出现，其余全是 `visit`**。这也是这套生态实际用起来的样子——重武器很少用，但真需要的时候没有替代品。
