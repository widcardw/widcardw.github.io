---
title: 如何编写 remark 和 rehype 插件　
pubDate: 2023-07-14
category: 'markdown'
tags: ['markdown', 'remark', 'rehype', 'unified', 'mdx']
description: 官方文档给的示例真少，我都不知道该怎么搞才好
---

## 前言

Markdown 有众多的编译器，例如前面提到了 markdown-it，marked.js，以及基于 python 的 mkdocs 等等。这些工具都能将标准的 markdown 文件翻译为对应的 html 代码。

而 unified 组织尝试开发了一套更加通用的 markdown 工具，能够让 markdown，语法分析树，html 代码相互无缝转换，其中的桥梁就是==语法分析树==。

然而呢，浏览 unified 所创建的框架，下面主要包含的就有三个小组织：remark, syntax-tree, rehype。另外，还有不少官方维护者创建的民间小组织，例如 micro-mark, mdast 等等。这么一看，确实乱糟糟的，与之前写的 markdown-it 来比，不说难以弄清，至少也是无从下手。

至于为什么要写这篇文章，就是因为新兴的 [Astro](https://astro.build) 框架以及基于 MDX 的文档生成工具，它们大多都是基于 unified 这套生态的。几乎只有 Vue 还在坚持使用 markdown-it 作为编译工具，大概是因为 antfu 构建了不少例如 auto-import, unplugin-components 之类的生态。不过，我也并不希望拔高一方而贬低另一方，应该说各有各的优点吧。

## Unified 生态下 markdown 转换流程

![[_public/md-plugins/unified-process.excalidraw.svg]]

unified 生态下有一系列工具，可以对 markdown 和 html 字符串进行转换。同时，官方和社区也提供了众多 remark 插件和 rehype 插件，它们发挥作用的时机是不同的。remark 插件是作用于 mdast 的，而 rehype 插件是作用于 hast 的，因此两类通常会在不同的地方分别导入。

### markdown to html

下面是常规的使用 unified 将 markdown 转换为 html 的示例。

```js ins={3,5}
unified
  .use(remarkParse)
  .use(remarkPlugin) // remark 插件
  .use(remarkRehype)
  .use(rehypePlugin) // rehype 插件
  .use(rehypeStringify)
  .processSync('# Hello world')
```

#### remark parse

作用是将 markdown 字符串转换为 markdown 生态下的 AST 对象。

#### remark plugin

在这一阶段，我们可以操作 mdast 对象，使得它变得具有更加丰富的功能。

例如，由 remark-math 插件转换过的 AST，数学公式将被认为是 `math` 节点。在 rehype-katex 中，插件就会自动识别 math 节点，按照 KaTeX 的规则将其翻译为 html 代码。

#### remark rehype

作用是将 mdast 对象转换为 hast 对象，用于 rehype 的操作。

#### rehype plugin

在这一阶段，我们可以操作 hast，使得生成的目标 html 有更多的功能。

例如，rehype-highlight 插件将会使用 lowlight，将代码块转换为带有特殊 className 的节点序列，这样可以为类名编写 CSS 代码，从而实现高亮的功能了。

#### rehype stringify

将 hast 转换为 html 字符串，也就是生成最终呈现的网页。

### html to markdown

说实话这部分应该相当不常用。

```js ins={4}
unified
  .use(rehypeParse)
  .use(rehypeRemark)
  .use(remarkPlugin) // remark 插件
  .use(remarkStringify)
  .processSync('<h2>This is a line</h2>')
```

让我非常惊讶的一点就是，这套生态支持逆向转换，因此在官方给出的插件，例如 `remark-gfm` 当中，就存在 md2html 的代码，以及 html2md 的代码。至于是否支持 rehype 插件的逆向转换，我就不太清楚了，因为我也没有找到比较好的样例。

## 插件编写方式

目前 remark 插件的编写方式似乎主要有两种。一种是由 worm 主导的 JSDoc，`enter` & `exit` 写法，另一种是写起来更方便的 `visit` 写法。

rehype 插件的编写方式主要就是通过 `visit` 方法遍历语法树，对特殊节点进行特殊处理。

## remark 插件

由于 `enter` & `exit` 的编写方式过于困难，所以这里就只使用 `visit` 方式了。

### 插件主体

我发现，可以用一个比较好的模板，只需编写 `visitBlock` 方法即可完成节点的修改了。

```ts {3}
export function plugin() {
  return function transformer(ast, vFile, next) {
    visitBlock(ast)
    if (typeof next === 'function')
      return next(null, ast, vFile)
    return ast
  }
}
```

### visitor

在 `visitBlock` 块中，我们的大致模板是这样，在 `visitor` 中，我们需要修改 `node` 或者 `parent` 来达到修改 AST 的效果。

```ts
import { visit } from 'unist-util-visit'
import type { BuildVisitor } from 'unist-util-visit'

function visitBlock(ast) {
  const visitor: BuildVisitor<Mdast, 'element_type'> = (node, index, parent) => {
    // ...
  }
  return visit(ast, 'element_type', visitor)
}
```

如果是将匹配到的节点替换为更改后的节点，则需要用这样的语句，改语句的含义就是将第 `index` 处的元素替换为 `newWrapper`.

```ts
parent.children.splice(index, 1, newWrapper)
```

> 不会还有人不知道 `splice` 的作用吧

### 节点编辑

如果使用 `console.dir(node, { depth: null })`，可以将节点打印出来，我们修改后的节点需要包含下面的属性

```ts
interface Content {
  type: string
  children: BlockContent[]
  value?: string
  data?: {
    hName?: string
    hProperties?: Record<string, string | number | boolean>
  }
}
```

- `type` 主要为 mdast 指定的节点类型，例如 `code`, `blockquote`, `element` 等
- `children` 是该节点的子节点列表，相当于是一个嵌套的结构
- `value` 有时并不是刚需，如果 `type` 为 `text` 时，就可以指定该文本节点的值
- `data`
	- `hName` 是指定了这个节点的标签名，比如可以指定为一些刁钻的 `details` 等
	- `hProperties` 是这个标签的属性

```ts
const n = {
  type: 'element',
  children: [{ type: 'text', value: 'abc' }],
  data: {
    hName: 'span',
    hProperties: { className: 'color-red' }
  }
}
```

这样的一个节点对应的就是包含 `class` 为 `color-red` 的 `span` 元素，文本内容是 `abc`。

## rehype 插件的编写



