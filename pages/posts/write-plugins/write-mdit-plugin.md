---
title: 编写 Markdown-it 插件
date: 2023-02-27
category: 'markdown'
tags: ['markdown-it', 'plugins']
abstract: 还没写完哦，等等再看吧
---

# 编写 Markdown-it 插件

## 前言

markdown-it 的[官方文档](https://markdown-it.github.io/markdown-it/)只是给了一部分案例，用于指导如何使用它的 API，将它接入到 Web 程序中，但是光看它的文档，我并没有找到写插件的头绪。因此，写插件的最好办法就是抄别人的代码。

当然，也是有了官方给的一个[小小的案例](https://github.com/markdown-it/markdown-it/tree/master/docs)，我才得以写出比较好的插件。网址在官网也是给出了，也得感谢一下这些为社区做出巨大贡献的维护者们。

## Markdown-it 的规则

这部分其实还是看官方文档更好一些，毕竟他们写得很全，通过终端打印出来的毕竟很难看全。

Markdown-it 对于 markdown 的处理是基于 token stream 的，因此想要扩展的话，只需要扩展 token 处理函数即可。

如果读者查看 https://markdown-it.github.io/ 这个 demo 网站的 debug 栏，可以发现，除了 `type: "inline"` 的 token 之外，整个 token 流几乎都是==扁平==的，它不像 [remarkjs](https://github.com/remarkjs/remark) 生成的 AST 那样层层嵌套。它能做到这样一点，就是因为有 `nesting` 这个属性：

- 取值为 `1` 时代表了一个 html 标签的开始，如 `<span>`
- 取值为 `-1` 时表示 html 标签的结束，如 `</span>`
- 取值为 `0` 时代表自闭合的标签，如 `<br />`

这样做会让程序几乎没有递归，代码也变得非常简单。在翻译为最终代码的时候，程序读取这个扁平的 token 流，根据读取到的 token 的属性来生成 html 字符串。

> [!quote] 一个 token 样例
> ```json
> {
>   "type": "paragraph_open",
>   "tag": "p",
>   "attrs": null,
>   "map": [5, 7],
>   "nesting": 1,
>   "level": 2,
>   "children": null,
>   "content": "",
>   "markup": "",
>   "info": "",
>   "meta": null,
>   "block": true,
>   "hidden": true
> }
> ```

上面这个样例中，`type` 字段表明当前 token 的类型，同时也解答了[官方给的插件案例](https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md)中，莫名其妙冒出来的 `bullet_list_open` 是从哪来的。也就是说，只需要在 demo 网站上编写 markdown，转到 debug 标签栏，就可以查看当前 token 的类型，即可按照官方案例那样进行修改了。

把官方给的一个案例贴过来，可以看到其实就是给默认方法注入了一些语句，以达到扩展的功能。

```js
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options)
const defaultRenderer = md.renderer.rules.bullet_list_open || proxy

md.renderer.rules.bullet_list_open = (tokens, idx, options, env, self) => {
  // Make your changes here ...
  tokens[idx].attrJoin('class', 'lorem_ipsum')
  // ... then render it using the existing logic
  return defaultRenderer(tokens, idx, options, env, self)
}

console.log(md.render('- Hello World'))
```

## 通过 log 能看到什么

Markdown-it 对象通过 `new` 来创建。

```js
const md = new MarkdownIt()
console.dir(md, { depth: 0 })
```

```sh
MarkdownIt {
  inline: [ParserInline],
  block: [ParserBlock],
  core: [Core],
  renderer: [Renderer],
  linkify: [LinkifyIt],
  validateLink: [Function: validateLink],
  normalizeLink: [Function: normalizeLink],
  normalizeLinkText: [Function: normalizeLinkText],
  utils: [Object],
  helpers: [Object],
  options: [Object]
}
```

首先可以看到的是 `inline` 和 `block` 这两个 parser，这两个 parser 分别包含了下面这些规则

```js
console.log('inline =', md.inline.ruler.__rules__.map(i => i.name))
inline = [
  'text', 'linkify',
  'newline', 'escape',
  'backticks', 'strikethrough',
  'emphasis', 'link',
  'image', 'autolink',
  'html_inline', 'entity'
]

console.log('block =', md.block.ruler.__rules__.map(i => i.name))
block = [
  'table', 'code',
  'fence', 'blockquote',
  'hr', 'list',
  'reference', 'html_block',
  'heading', 'lheading',
  'paragraph'
]
```

如果想要扩展这些规则，那么就可以使用 `before` 或 `after` 来注入自定义的方法了。

另外还有 `renderer` 属性，也包含了一些规则

```js
console.log('renderer =', Object.keys(md.renderer.rules))
renderer = [
  'code_inline', 'code_block',
  'fence', 'image',
  'hardbreak', 'softbreak',
  'text', 'html_block',
  'html_inline'
]
```

按照官方的样例来说，这里的规则应该不止这些，至少应该还包含 `bullet_list_open` 之类的规则。至于为什么没有出现，我就不知道了。

## 其他人的插件是怎么写的
