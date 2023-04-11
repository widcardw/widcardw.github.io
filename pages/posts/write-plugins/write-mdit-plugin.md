---
title: 如何编写 Markdown-it 插件
date: 2023-02-27
category: 'markdown'
tags: ['markdown-it', 'plugins']
abstract: 仅仅作为一份参考，详细的信息还是去看官方文档吧　
---

# 如何编写 Markdown-it 插件

## 前言

markdown-it 的[官方文档](https://markdown-it.github.io/markdown-it/)只是给了一部分案例，用于指导如何使用它的 API，将它接入到 Web 程序中，但是光看它的文档，我并没有找到写插件的头绪。因此，写插件的最好办法就是抄别人的代码。

当然，也是有了官方给的一个[小小的案例](https://github.com/markdown-it/markdown-it/tree/master/docs)，我才得以写出比较好的插件。网址在官网也是给出了，也得感谢一下这些为社区做出巨大贡献的维护者们。

## Markdown-it 的规则

这部分其实还是看官方文档更好一些，毕竟他们写得很全，通过终端打印出来的毕竟很难看全。

Markdown-it 对于 markdown 的处理是基于 token stream 的，因此想要扩展的话，只需要扩展 token 处理函数即可。

如果读者查看 https://markdown-it.github.io/ 这个 demo 网站的 debug 栏，可以发现，除了 `type: "inline"` 的 token 之外，整个 token 流几乎都是==扁平==的，它不像 [remarkjs](https://github.com/remarkjs/remark) 生成的 AST 那样树形嵌套。它能做到这样一点，就是因为有 `nesting` 这个属性：

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

```md
- a
```

> [!example] 转换的结果
> ```json
> [
>   {
>     "type": "bullet_list_open",
>     "tag": "ul",
>     "attrs": null,
>     "map": [
>       0,
>       1
>     ],
>     "nesting": 1,
>     "level": 0,
>     "children": null,
>     "content": "",
>     "markup": "-",
>     "info": "",
>     "meta": null,
>     "block": true,
>     "hidden": false
>   },
>   {
>     "type": "list_item_open",
>     "tag": "li",
>     "attrs": null,
>     "map": [
>       0,
>       1
>     ],
>     "nesting": 1,
>     "level": 1,
>     "children": null,
>     "content": "",
>     "markup": "-",
>     "info": "",
>     "meta": null,
>     "block": true,
>     "hidden": false
>   },
>   {
>     "type": "paragraph_open",
>     "tag": "p",
>     "attrs": null,
>     "map": [
>       0,
>       1
>     ],
>     "nesting": 1,
>     "level": 2,
>     "children": null,
>     "content": "",
>     "markup": "",
>     "info": "",
>     "meta": null,
>     "block": true,
>     "hidden": true
>   },
>   {
>     "type": "inline",
>     "tag": "",
>     "attrs": null,
>     "map": [
>       0,
>       1
>     ],
>     "nesting": 0,
>     "level": 3,
>     "children": [
>       {
>         "type": "text",
>         "tag": "",
>         "attrs": null,
>         "map": null,
>         "nesting": 0,
>         "level": 0,
>         "children": null,
>         "content": "a",
>         "markup": "",
>         "info": "",
>         "meta": null,
>         "block": false,
>         "hidden": false
>       }
>     ],
>     "content": "a",
>     "markup": "",
>     "info": "",
>     "meta": null,
>     "block": true,
>     "hidden": false
>   },
>   {
>     "type": "paragraph_close",
>     "tag": "p",
>     "attrs": null,
>     "map": null,
>     "nesting": -1,
>     "level": 2,
>     "children": null,
>     "content": "",
>     "markup": "",
>     "info": "",
>     "meta": null,
>     "block": true,
>     "hidden": true
>   },
>   {
>     "type": "list_item_close",
>     "tag": "li",
>     "attrs": null,
>     "map": null,
>     "nesting": -1,
>     "level": 1,
>     "children": null,
>     "content": "",
>     "markup": "-",
>     "info": "",
>     "meta": null,
>     "block": true,
>     "hidden": false
>   },
>   {
>     "type": "bullet_list_close",
>     "tag": "ul",
>     "attrs": null,
>     "map": null,
>     "nesting": -1,
>     "level": 0,
>     "children": null,
>     "content": "",
>     "markup": "-",
>     "info": "",
>     "meta": null,
>     "block": true,
>     "hidden": false
>   }
> ]
> ```

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

markdown-it 插件的生态还是相当丰富的，在 https://npmjs.com 搜索可以看到相当多的插件，虽然有些确实有点年久失修了。~~不好好维护插件的开发者快来挨骂！~~

我们来看两种经典的插件编写案例。

### 基于 Code Block 的插件

这类插件还是非常丰富的，包括 [`markdown-it-prism`](https://github.com/jGleitz/markdown-it-prism), [`markdown-it-shiki`](https://github.com/antfu/markdown-it-shiki), [`markdown-it-mermaid`](https://www.npmjs.com/package/@wekanteam/markdown-it-mermaid) 等等。

#### 代码高亮插件

Prism 和 Shiki 都是用于代码高亮的插件，原理是将包裹在代码块中的代码进行语法分析，然后更改每个片段的 CSS，最后将转换完成后的 HTML 字符串代替原来的 `<pre>` 块内的元素。具体的代码分析模块其实不是我们主要去研究的，我们要熟悉的是怎样将插件接入进去。

```ts {4}
const MarkdownItShiki: MarkdownIt.PluginWithOptions<Options>
  = (markdownit, options = {}) => {
  // ... preprocessors
    markdownit.options.highlight = (code, lang, attrs) => {
      return highlightCode(
        code,
        lang || 'text',
      )
    }
  }
```

上面的代码中，将高亮接入到 markdown-it 中的关键就在于修改 `options.highlight` 函数，使得这个函数返回已经高亮过的 HTML 字符串。其中，`code` 指代包在代码块中的代码字符串，`lang` 指代写在 \`\`\` 后的语言选项，`attrs` 指代写在语言后面的其他参数。

自从 ~~JS 工具库代码越来越卷~~之后，就有不少开发者尝试实现越来越多复杂的功能，也因此出现了 `attrs` 这个参数，用于代码块的一些扩展功能，主要就是行高亮、词高亮等功能吧。

#### 功能性代码块

像是 mermaid, custom container 等功能，也是基于已有的代码块 API 进行扩展，识别相应的语言，并作相应的处理。而参考别人的插件，发现实际上也就是更改原有的渲染函数。

![[public/md-plugins/fence-processor.excalidraw.svg]]

一旦涉及到更改原有的函数，我们又不可能考虑的非常全面，因此就需要保存原生的元然函数作为 fallback.

```ts
const defaultRenderer = md.renderer.rules.fence!.bind(md.renderer.rules)
```

上面的 `fence` 就是指，被 \`\`\` 包裹起来的代码块的渲染规则。我们将它先保存起来。

接下来就是更改 `fence` 函数本体了，采用的方式很暴力。

```ts {3-6}
md.renderer.rules.fence = (tokens, index, options, env, slf) => {
  const token = tokens[index]
  if (token.info.trim() === 'mermaid') {
    const code = token.content.trim()
    return renderMermaid(code)
  }
  return defaultRenderer(tokens, index, options, env, slf)
}
```

从这段代码来看，就是在默认渲染器之前，插入一个预判断，如果符合这个条件，那么就使用自定义的渲染器，而不使用原生的渲染器。这样看来，其实基于代码块的插件是最好写的。

> [!tip] 关于 token 的内容
> 如果不清楚 token 里面具体是什么，当然可以尝试将它 log 出来，查看它内部的参数。

### 基于行内特殊字符的插件

最经典的莫过于 `markdown-it-katex` 了，它能够让 markdown 支持数学公式的渲染，然而想要编写一个这样的插件还真的不容易。

前面基于代码块的插件只需要修改代码生成器，也就是只需要将 token 转换为 HTML 代码。但是这种基于行内的插件还需要一些前驱的步骤，比如下图中出现的修改 tokenizer.

![[public/md-plugins/escape-processor.excalidraw.svg]]

如果查看 `markdown-it-katex` 的代码，可以发现有这样两个语句

```ts
md.inline.ruler.after('escape', 'math_inline', math_inline)
md.renderer.rules.math_inline = inlineRenderer
```

- 第一行的作用就是扩展了行内元素的识别规则，在遇到一些界定符的时候，会进入 `math_inline` 函数，如果符合它的规则，那么就会生成一个 `math_inline` 类型的 token，用于后续的代码生成。
- 第二行的作用就是为 renderer 添加一种新的规则，当识别到 `math_inline` 的 token 时，就能走 `inlineRenderer` 的逻辑，生成 $\KaTeX$ 的 HTML 字符串。

理清这一部分逻辑之后，代码编写就不是什么大问题了。

插件的接口部分

```ts
const MarkdownItKaTeX: MarkdownIt.PluginSimple = (md) => {
  md.inline.ruler.after('escape', 'math_inline', math_inline)
  md.renderer.rules.math_inline = inlineRenderer
}
```

Tokenizer 部分

```ts
function math_inline(state: StateInline, silent: boolean) {
  // 如果不符合 $(.+?)$ 的要求，返回 false
  if (!isValid(state))
    return false
  // 从 state 读取符合条件的 $(.+?)$, 起始和结束分别为 start 和 end
  let start, end, token
  // silent 时表示静默不处理
  if (!silent) {
    // 向 token 流中添加一个类型为 `math_inline` 的 token
    token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    // 将 token 的内容设定为识别到的 tex 字符串
    token.content = state.src.slice(start, end)
  }
  // 将字符指针移出公式的范围
  state.pos = end + 1
  // 返回值为 true 应该表示当前的 token 生效
  return true
}
```

代码生成部分

```ts
/** 生成 KaTeX 的 HTML 字符串 */
function inlineRenderer(code: string) {
  try {
    return katex.renderToString(tex, { throwOnError: false })
  }
  catch (err) {
    return `<pre style="white-space: normal; background-color: #7f7f7f18; padding: 0.5rem;">${err}</pre>`
  }
}
```

基于行内的插件有所了解了，那么基于块元素的也能够举一反三了。

## 一些细节

### `before` 还是 `after`

我们发现插件在定制规则的时候，有些会使用 `before`，有些会使用 `after`，从常规的思维来看应该也很明了，`before` 就是会在 markdown 被处理成 token 和 html 之前就会被自定义的 tokenizer 处理，而 `after` 就是在被默认处理器编译过后，做的后续处理。

在 `markdown-it-katex` 中，我们注意到它使用的是 `after`，因为在原生的 markdown-it 中，`$` 符号并不会做任何处理，也就是说这个字符串会被原样保留，因此作为后处理是没有任何问题的。

通常情况下，基于行内的处理可以用 `after`，但是基于块元素的，也就是处理 `paragraph`, `blockquote` 这种类型时，有时需要使用 `before` 来构造一个比原生处理器优先级更高的预处理器。因为 `paragraph` 这种元素通常是嵌套的，在处理 `paragraph` 之后，就必然会进一步处理段落内部的行内文本，破坏了段落这样一个应该被看作整体的元素。而解决方式可能就是添加一些 `alt`，让其他的块也被这个处理器处理。

### 行内元素 `state` 的属性

部分类型声明

```ts
declare class StateInline {
  constructor(src: string, md: MarkdownIt, env: any, outTokens: Token[])
  /**
   * 完整的 markdown 字符串
   */
  src: string

  /**
   * token 序列
   */
  tokens: Token[]
  tokens_meta: Array<StateInline.TokenMata | null>

  /**
   * markdown 字符串指针
   */
  pos: number

  /**
   * 行尾的索引，如果 pos >= posMax 通常就不用再处理该行内元素了
   */
  posMax: number
  level: number
  pending: string

  md: markdownit

  /**
   * 将新的 token 加入 token stream
   * If pending text exists - flush it as text token
   */
  push(type: string, tag: string, nesting: Token.Nesting): Token

}
```

但是呢，我并不知道这个 `pending` 有什么用，之后等有人再来完善一下吧。

完整的类型声明 [`@types/markdown-it/lib/rules_inline/state_inline.d.ts`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/markdown-it/lib/rules_inline/state_inline.d.ts)

### 块元素的 `state` 属性

```ts
declare class StateBlock {
  constructor(src: string, md: MarkdownIt, env: any, tokens: Token[])
  /**
   * 完整的 markdown 字符串
   */
  src: string

  tokens: Token[]

  /**
   * 行首的索引
   */
  bMarks: number[]
  /**
   * 行尾的索引
   */
  eMarks: number[]
  /**
   * 每一行中第一个不是空白字符串的索引
   */
  tShift: number[]
  /**
   * 每行的缩进
   */
  sCount: number[]

  /**
   * 当前指针所在的行号
   */
  line: number
  /**
   * 行数
   */
  lineMax: number

  md: markdownit

  /**
   * 将新的 token 加入 token stream
   */
  push(type: string, tag: string, nesting: Token.Nesting): Token
}
```

在不少插件的案例中，我们会有下面的定义，分别指代的是 `lineNum` 行的第一个非空白字符索引和和行尾索引。

```ts
const start = state.bMarks[lineNum] + state.tShift[lineNum]
const max = state.eMarks[lineNum]
```

在块元素中，我们用的索引就是 `line` 这个关键字了，处理完块元素之后，就需要让 `state.line` 移动到下一个块元素了。

完整的类型声明 [`@types/markdown-it/lib/rules_block/state_block.d.ts`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/markdown-it/lib/rules_block/state_block.d.ts)

### `state` 中的 `md` 引用

这个 `md` 引用应该就是当前 `markdown-it` 对象的一个引用，也就是说，用这个对象可以实现自定义处理函数的==嵌套==。至于嵌套成了什么样子，可以查看我曾经编写过的 [`mdit-plugin-callouts`](https://github.com/widcardw/mdit-plugin-callouts/blob/edf61aef0c64be5194a7a0b618db174e075c2f65/src/index.ts#L106-L111) 插件，之所以能够在自定义块内再构造一个自定义块，实际上就是用了这样一种递归操作。

但是呢，我写这个插件的时间都好久远了，我都不知道它具体是怎么操作的了，就当作是这样干的吧。

## 作业

有了这些基础，我相信读者应该也有一定的能力依葫芦画瓢写一个插件了，那么就布置一个作业吧。

> [!question] 作业
> 编写一个 `wikilink` 的 markdown-it 插件，能够将 `![[./abc.png]]` 这种链接翻译为 `<img src='./abc.png' />`，同时也能够适配视频和音频，分别生成 `<video>` 和 `<audio>` 标签的元素。
>
> 作业答案可以参考 https://github.com/widcardw/mdit-plg-double-bracket-media


