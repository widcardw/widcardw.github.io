---
title: SublimeLinter 使用记录
date: 2022-04-28
tags:
  - sublime
  - linter
category: linter
article: true
abstract: 后来发现基于 LSP 的 pyright 好像要更好一些
---

# SublimeLinter 使用记录

> [!tip] 注意
> 其实使用 Sublime-lsp 和 pyright 会更好一些，本文讲的 linter 还得手动配置

## 1. 安装

Sublime Text 上安装插件还是相当方便的，只需 <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> 即可打开 Package Control，在其中搜索插件并安装所对应的插件就可以了。

首先我们需要安装 SublimeLinter 插件，然后再装上以 SublimeLinter 打头的对应的 linter 。此处就以 pylint 为例。

## 2. 配置

### 2.1. PATH

光是安装这两个插件还不够，因为 linter 是以 pip install 安装的 ==pylint 可执行程序== 来驱动的。因此我们需要让 pylint 这个程序能够在 `PATH` 中找到，或者将它写到 SublimeLinter 设置中的 `paths` 参数中。此处使用后者的方案。

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> 打开 Preferences: SublimeLinter settings

```json
{
  "paths": {
    "linux": [],
    "osx": [
      "/Users/leeocoy/Library/Python/3.9/bin"
    ],
    "windows": []
  }
}
```

这样 SublimeLinter 就能找到 linter 的路径了。

### 2.2. linter

我们安装了 pylint，就需要在 linters 参数中写入我们所需要的 linter

```json
{
  "linters": {
    "pylint": { // 此处为 pylint
      "args": [
        "--disable=missing-class-docstring",
        "--disable=missing-function-docstring",
        "--disable=missing-module-docstring",
        "--disable=R0903,R0904,R0913,R0914,W0614,C0103"
      ]
    }
  }
}
```

以及，可以参照默认的规范，或者官方文档来修改参数。此处的配置屏蔽了一些警告，防止整个文件看起来很乱。

## 3. 完整配置

```json
// SublimeLinter Settings - User
{
  "paths": {
    "linux": [],
    "osx": [
      "/Users/leeocoy/Library/Python/3.9/bin"
    ],
    "windows": []
  },
  "lint_mode": "background",
  "linters": {
    "pylint": {
      "args": [
        "--disable=missing-class-docstring",
        "--disable=missing-function-docstring",
        "--disable=missing-module-docstring",
        "--disable=R0903,R0904,R0913,R0914,W0614,C0103"
      ]
    }
  }
}
```

对于其他的 linter，例如 eslint 等，都可以使用类似的操作。
