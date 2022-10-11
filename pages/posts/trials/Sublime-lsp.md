---
date: 2022-9-29
title: Sublime LSP 作为 linter
category: linter
tags: ['linter', 'sublime', 'LSP', 'Language-Server-Protocol']
---

# Sublime LSP 作为 linter

## 起因

在之前，我写过一篇 [[pages/posts/trials/SublimeLinter|SublimeLinter 对 Python 进行代码检查]]。它使用 pylint 作为检查器，但是未免有点 “过于追求规范” 了，它要求每个函数，每个类都有 doc-string，以及一些非常奇怪的警告。当时忆拾正在改 manim 的 SVG，他在没有代码提示的情况下，有不少包没引入（然而竟然没有报错！），所以我就把 SublimeLinter & pylint 的方案推荐给他了，但是体验也不算非常好（~~因为 manim 的代码本来写得就有点一言难尽~~）

在一个偶然之中，我了解到 VSCode 的插件，叫做 rust-analyzer，它使用了 Language Server Protocol 这一技术，这一方案定义了一套编辑器或 IDE 与语言服务器之间的使用协议。于是查看 Sublime LSP 文档，发现已经有不少可用的插件了，于是就立即改用这一方案（~~又是喜新厌旧~~

## 安装

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> 打开命令交互界面，分别安装 Sublime-LSP 和 LSP-pyright 即可。

## 配置项

使用这一方案的优势就是几乎零配置。但其实有一些选项还是很可能用到的，例如 eslint 中我们经常需要保存时直接格式化，这时就需要一些配置了。

```json
{
  "lsp_code_actions_on_save": {
    "source.fixAll.eslint": true,
    "source.organizeImports.eslint": true
  }
}
```

当然，更多的配置可以在 LSP: Preferences 中查看，本篇中就不多加赘述了。
