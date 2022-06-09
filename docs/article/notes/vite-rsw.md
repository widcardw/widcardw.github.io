---
date: 2022-06-09
tag: ['vite', 'wasm', '前端']
category: '踩坑'
article: true
---


# Vite Rsw 使用入门

## 来源

<https://github.com/rwasm/vite-plugin-rsw>

这个方法要比手动改 `vite.config.ts` 和 `tsconfig.json` 方便的多，感谢库作者

## 入门

### 0. Rust 换源

编辑 `~/.cargo/config`

```shell
$ vi ~/.cargo/config
```

写入以下内容

```bash
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
replace-with = 'ustc'
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
[net]
git-fetch-with-cli = true
```

### 1. 安装依赖

首先需要安装好各种各样的 rust 依赖，此处全部使用 cargo 来安装

```shell
$ cargo install wasm-pack
$ cargo install rsw
```

### 2. 初始化一个 Web 项目

新建一个文件夹

```shell
$ mkdir vite-rsw-test && cd vite-rsw-test
```

初始化 pnpm

```shell
$ pnpm init
```

安装 vite 和 vite-plugin-rsw

```shell
$ pnpm i vite
$ pnpm i vite-plugin-rsw
```

初始化 git

```shell
$ git init
```

### 3. 配置 Web 项目

新建 `vite.config.ts`，编写官网给的内容

```ts
import { defineConfig } from 'vite';
import ViteRsw from 'vite-plugin-rsw';

export default defineConfig({
  plugins: [
    ViteRsw(),
  ],
})
```

编辑 `package.json`

```json
"scripts": {
	"dev": "vite",
	"watch": "rsw watch",
	"rsw": "rsw",
	"build": "rsw build && pnpm fe:build",
	"fe:build": "tsc && vite build"
},
```

### 4. 初始化 Rust 项目

初始化 `rsw.toml`

```shell
$ rsw init
```

生成 rust crate

```toml
# rsw.toml
[new]
# using: wasm-pack | rsw | user, default is `wasm-pack`
using = "wasm-pack"
```

```shell
$ rsw new rsw-hello
```

> 这一步需要在 `git init` 之后才能成功执行，因为 `git fetch` 需要当前为一个 git 仓库

编辑 `rsw.toml`

```toml
# link type: npm | yarn | pnpm, default is `npm`
cli = "pnpm"

[[crates]]
name = "rsw-hello"
# <npm|yarn|pnpm> link
# ⚠️ Note: must be set to `true`, default is `false`
link = true
```

### 5. 编写 Web 基本部件

`index.html` 部分

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script type="module" src="/src/main.ts"></script>
    <div id="app"></div>
</body>
</html>
```

`/src/main.ts` 部分

```ts
import init, { greet } from 'rsw-hello'

init().then(() => {
    greet()
})
```

### 6. 启动

启动 Rsw 的监看

```shell
$ pnpm run watch
```

启动 vite 前端项目

```shell
$ pnpm run dev
```

```ad-warning
title: 注意

两个命令行需要分别开启，因为上面一个是监看 Rust 项目的，下面那个是监听 vite 前端项目的
```
