---
title: Mac 上常用的软件
pubDate: 2024-12-29
updatedDate: 2026-7-29
tags:
  - 软件
  - macOS
description: 备份一下，以便后续设备迁移后能找到对应列表，打勾为常用
---

## 游戏

### 原神

- ✅ [Verge-Rev](https://www.clashverge.dev/guide/quickstart.html) (Tauri)
- [Nyanpasu](https://nyanpasu.elaina.moe/zh-CN/) (Tauri)
- [GUI.for.Clash](https://github.com/GUI-for-Cores/GUI.for.Clash) (Wails)

### 八音盒

[sing-box](https://sing-box.sagernet.org/) (Go)，社区有做  [GUI.for.SingSox](https://github.com/widcardw/GUI.for.SingBox)

### X 光

- [2dust](https://2dust.link/) (C#)

## 输入法

- ✅ [Rime](https://rime.im) 小狼毫/鼠须管
- ✅ [rime-frost](https://github.com/gaboolic/rime-frost) 输入法方案
- ✅ 自定义的部分配置，见 [gist](https://gist.github.com/widcardw/23005e112780fec16fb35e1fff221f4b)

## 云同步

- ✅ [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/download)
	- 无法连接时，可使用《游戏》或 [Watt Toolkit](https://steampp.net) 加速
- iCloud (仅备忘录)

## 磁盘

- [Free-NTFS-for-Mac](https://github.com/hoochanlon/Free-NTFS-for-Mac)

## 文献管理

- ✅ [Zotero](https://zotero.org) + OneDrive
- ✅ [Obsidian](https://obsidian.md)
	-  Excalidraw
	- Asciimath
	-  Advanced tables
	-  Various Complements

## 代码编辑器

- ✅ [VSCode](https://code.visualstudio.com/)
	- 点击 Other platforms 下载 Apple Silicon Zip 版本，则不会下载完整的 Universal 版本，更瘦身，[详情](https://twitter.com/yetone/status/1886814901051777118).
	-  Lingma/CodeBuddy/Claude Code 插件辅助编写代码
- ✅ [Zed](https://zed.dev)
	- VSCode Icons Theme
	- 可作为默认的文本编辑器，例如可以当作临时的 Markdown 打开器。然而针对 GBK 等不统一的文本编码可能还要等官方维护。
	- AI Panel 功能在配置了 API Key 之后挺好用的
- [Sublime Text](https://www.sublimetext.com/download) 万能的文本编辑器
- [Intellij IDEA](https://www.jetbrains.com.cn/idea/download/?section=mac) (Community)
- 类 Vim (仅高级选手使用，不建议其他人折腾，而是直接用系统自带 Vim)
	-  [Helix](https://helix-editor.com/) + [简单配置](https://github.com/widcardw/helix-config)
	- [NeoVim](https://neovim.io/) + [LazyVim](https://www.lazyvim.org/) + [Neovide](https://neovide.dev/)

### AI 编程工具

- ✅ [Reasonix](https://reasonix.io/)
	- 与 DeepSeek 适配性较好，有非常高的缓存命中率
- [OpenCode](https://opencode.ai/)
    - 每天有免费次数，可用 Kimi / GLM / BigPickle 等
- [Pi](https://pi.dev)
	- 配合 Oh My Pi 应该能达到更好的效果
	- 据说是 OpenClaw 底层使用的工具，优势自己找知乎吧
	- 在官网的 Packages 中可以加一些插件，相当于是 Agent 的 VSCode 了
- [Claude Code](https://docs.claude.com/zh-CN/docs/claude-code/overview)
    - 可使用国内的模型，手动配置 Base URL 和 API Key，参考[智谱开发文档](https://docs.bigmodel.cn/cn/guide/develop/claude)或 [DeepSeek 文档](https://api-docs.deepseek.com/zh-cn/guides/agent_integrations/claude_code)
    - 使用 [Claude Code Router](https://github.com/musistudio/claude-code-router) (命令行) 配置转发器，白嫖 modelscope 每日 2000 次额度
    - 可参考的[配置](https://gist.github.com/widcardw/a370780437a2ae2f1e25f89217563291)，写入到 `~/.claude/settings.json` 中，据说可以避免降低 KVCache 命中率

## 命令行工具

个人曾经用过的配置有以下方案，每个都加上了 `brew install z zsh-syntax-highlighting zsh-autosuggestion`

- Mac 自带终端 + starship
- Ghostty / iTerm2 + starship
- Warp

### 窗口工具

- ✅ [Ghostty](https://ghostty.org/)
    - 用 Zig 语言开发的一个终端，快捷键基本上也都与 iTerm2 类似
    - `brew install --cask ghostty@tip`
    - 配置文件[参考](https://gist.github.com/widcardw/9436707cd6ed36fe45df51608656e364)，尤其是需要使用 SSH 时，必备 `term = xterm-256color` 这个选项
- ✅ [tty7](https://github.com/l0ng-ai/tty7)
	- 使用 Zed 的 GPUI 库来做的一个工具，正在观望，看起来挺好的
- [Kero](https://kero.sh/) by [@localhost_4173](https://x.com/localhost_4173)
	- 开源且 Swift 原生的软件，能用自带的 Webview 在软件内开浏览器，正在观望
- [Otty](https://otty.sh/)
	- 是与 Typora 同一个公司出的，说是外观设计上非常好，而且自称是原生的，也正在观望
- [ORCA](https://www.onorca.dev/) 功能非常丰富的 AI Coding 工具
- [iTerm2](https://iterm2.com)
    - 老牌软件，也接入了 AI，能够打开浏览器，但是感觉用不着它的浏览器功能
- [Warp](https://warp.dev)
	- 不支持接入第三方 AI，每个月有免费额度
    - 个人觉得可以搭配 `z`, `zsh-syntax-highlighting`, `zsh-autosuggestion` 这三个插件使用，且可以完全不装 starship/oh-my-zsh
    - 支持打开文件夹，已经变成一个 Agent 的工具了
- [WezTerm](https://wezterm.org/)
    - 如果喜欢折腾，可以考虑用这个软件，配置方法参考[视频](https://www.bilibili.com/video/BV1miWMe9Esq)
    - 默认无 AI 接入，据说两年没更新了
- 其他
	- [cmux](https://cmux.com/)
	- [muxy](https://muxy.app/)
	- [Nutty](https://github.com/xiangjs6/Nutty) (C/C++)

### 命令行内的软件

starship 或者 oh-my-zsh 选其一即可，我个人用的 starship

#### starship

[参考链接](https://starship.rs)

安装 Starship

```sh
brew install starship
```

```sh title="启动"
eval "$(starship init zsh)"
```

Starship 配置文件参考 [`~/.config/starship.toml`](https://gist.github.com/widcardw/5308091c3200e5019e55a42b20285adf)

安装 zsh 相关插件（如果用的是 oh-my-zsh，那么就不用手动安装下面这些了）

```sh
brew install z zsh-syntax-highlighting zsh-autosuggestion
```

```sh title="~/.zshrc"
eval "$(starship init zsh)"   # 启动 starship

source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /opt/homebrew/etc/profile.d/z.sh
```

#### ohmyzsh

[参考链接](https://ohmyz.sh/)，用我这个配置的话非常的轻量化且配起来比 starship 简单

参考配置文件

```sh title="~/.zshrc"
export ZSH=$HOME/.oh-my-zsh
ZSH_THEME="amuse"
plugins = (
  git
  z
  zsh-autosuggestion
  zsh-syntax-highlighting
)
source $ZSH/oh-my-zsh.sh
```

## 开发环境

- ✅ Python [uv](https://docs.astral.sh/uv/)
  - 据说自从在 mac 上用过 uv 的都抛弃 conda 了，可直接使用 brew 自动安装的 Python
- Java
  - [Zulu](https://www.azul.com/downloads/)
  - [Oracle](https://www.oracle.com/java/technologies/downloads/#jdk23-mac)
- [Cargo](https://rustwiki.org/zh-CN/cargo/getting-started/installation.html) (Rust)
- Node.js
  - ✅ [官网](https://nodejs.org/)
  - [nvm](https://github.com/nvm-sh/nvm) `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
  - [fnm](https://github.com/Schniz/fnm) `curl -fsSL https://fnm.vercel.app/install | bash`
- ✅ [Postgresql](https://www.postgresql.org/download/macosx/) `brew install postgresql@15`

### 换源

#### uv

```toml title="~/.config/uv/uv.toml"
[[index]]
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
default = true
```

#### npm

```sh
# 设置使用镜像
npm config set registry https://registry.npmmirror.com
# 恢复原始
npm config set registry https://registry.npmjs.com
```

#### cargo

```toml title="~/.cargo/config.toml"
[source.crates-io]
replace-with = 'ustc'
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"
[net]
git-fetch-with-cli = true
```

#### go

https://learnku.com/go/wikis/38122 可以把以下命令写到 `.zshrc` 文件

```sh
# 启用 Go Modules 功能
go env -w GO111MODULE=on

# 配置 GOPROXY 环境变量，以下三选一

# 1. 七牛 CDN
go env -w  GOPROXY=https://goproxy.cn,direct

# 2. 阿里云
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct

# 3. 官方
go env -w  GOPROXY=https://goproxy.io,direct
```

## 浏览器

- ✅ Google Chrome 已支持垂直标签页，非常好用，可以在 chrome://flags 中打开
- ✅ Edge
  - Edge Drop 可以跨设备传消息、文件等
- Helium 注重隐私的“翻版 Chrome”，正在观望
- Safari
  - Darker
  - JSONPeep
  - Ad Block One
- Zen (FireFox) 不常用

## 效率

- 👍 ✅ [RayCast](https://www.raycast.com/) Spotlight 替代品
    - 剪贴板工具
    - Search Web Font
    - Search NPM
    - Wikipedia
    - ScreenOCR
    - iTranslate
    - Unsplash
    - Show IP Address
- 👍 ✅ 如果 macOS 版本为 26 及以上，可以将 Raycast 换成 [Tinycast](https://abue-ammar.github.io/tinycast/)，我也 [fork](https://github.com/widcardw/tinycast/tree/compat/macos15) 了一份，编译了 macOS 15 版本
	- 一般可以添加 Custom Commands 来实现各种自定义的指令
- 👍 ✅ 快速打开终端或编辑器 [OpenInTerminal-Lite](https://github.com/Ji4n1ng/OpenInTerminal/blob/master/Resources/README-Lite.md)
- ✅ 截图 [Shottr](https://shottr.cc)
- ✅ Hidden Bar (App Store)
- ✅ 图片压缩、转 PDF 等 [ImageMagick](https://imagemagick.org/) `brew install imagemagick`
- 空间清理
    - 👍 ✅ [Mole](https://github.com/tw93/Mole)
	- 👍 ✅ 卸载工具 [Pearcleaner](https://github.com/alienator88/Pearcleaner)
    - Daisy Disk (App Store 付费)
    - [Squirrel Disk](https://www.squirreldisk.com/) (免费开源代替，但 UI 没那么好看)
- 绘图
    - ✅ [tldraw](https://tldraw.com) 在线版
    - ✅ [Excalidraw](https://excalidraw.com) 在线版或 Obsidian 插件
    - InkScape (入门较困难)
- 压缩软件 [MacZip](https://maczip.cn/)
- 性能监控 RunCat (App Store)
- 端口查看工具 [PortKiller](https://github.com/productdevbook/port-killer)

## 快捷指令

打开 `Shortcut.app`，在其中添加快捷指令，能够通过 Raycast 或者 Tinycast 配置自定义命令快速打开

### OCR

[备份链接](https://www.icloud.com/shortcuts/fd393626c88747b0ad61e03ea7e2bb9c)

- 从 `快速操作` 接收 `任一` 输入，如果没有输入 `继续`（该步可能可以忽略）

以下的部分需要有中间线串联在一起

- `交互` 截屏（所选内容 `自定义`）
- 如果 `截屏` `有任何值`
	- 从 `截屏` 中提取文本
	- 使用 `新行` 合并 `图像中的文本`
	- 将 `合并后的文本` 拷贝至剪贴板
	- 显示 `合并后的文本` 通知
- 结束如果

命令行可使用 `shortcuts run "OCR"` 来运行这个快捷指令

## 外设软件适配

- 鼠标滚轮反转
	- ✅ [Scroll Reverser](https://pilotmoon.com/scrollreverser)
- 键盘映射 
	- ✅ [Karabiner Elements](https://karabiner-elements.pqrs.org/)
- 安卓存储访问
	- ✅ [Axchange](https://github.com/Lakr233/Axchange) 现已收费，自行编译免费
	- ✅ Andromeld (App Store) 基础功能免费，带屏幕映射，可购买完整版

## 下载工具

- ✅ [aria2](https://aria2.github.io/) `brew install aria2`
	- 常规下载 & BT，[配置参考](https://gist.github.com/widcardw/c74a5b6a01d9c1c353d47a8423fe0b37)
- ✅ [FDM](https://www.freedownloadmanager.org/)
    - 不支持资源嗅探，但是我本人对资源嗅探并不那么刚需
    - 支持 BT，但在[配置](https://www.zhihu.com/question/489562853/answer/64776078424)后达到更好的效果
- ✅ [NDM](https://www.neatdownloadmanager.com/index.php/en/)
    - 可进行资源嗅探
    - 不支持 BT
- Python you-get / ytb-dl

## 桌面呈现

- 按键显示
	- [Keycastr](https://github.com/keycastr/keycastr)
		- 直接安装 `brew install --cask keycastr`
		- 我 fork 了一个版本 [widcardw/keycastr](https://github.com/widcardw/keycastr/releases/tag/v0.10.5-better-svelte)，自定义配置项更多一些
	- [Keyviz](https://github.com/mulaRahul/keyviz) Tauri 构建，UI 更现代化，但长时间运行会有残影
- 分屏工具 [Rectangle](https://rectangleapp.com/)
- 屏幕笔 [MarkerOn](https://markeron.cn/)

## 影视

- ✅ 视频播放器 [IINA](https://iina.io/)
- ✅ 录屏 [OBS Studio](https://obsproject.com/zh-cn/download)
- ✅ 命令行视频处理工具 [FFmpeg](https://ffmpeg.org) `brew install ffmpeg`
- 视频剪辑
    - Davinci Resolve (App Store)
    - 剪映 (App Store)

## 办公

- ✅ [WPS 国际版](https://wps.com)（安装后界面会自动切换为中文）
- Microsoft 三件套（App Store）（体积太大了，似乎是基于模拟器跑的）

## 远程连接

- ✅ [贝瑞向日葵](https://sunlogin.oray.com/)
- [ToDesk](https://www.todesk.com/)
- [Microsoft Remote Desktop](https://learn.microsoft.com/zh-cn/windows-server/remote/remote-desktop-services/clients/remote-desktop-mac) (仅内网，清晰度高，速度快)

## AI 工具

- 在线版
    - ✅ [Deepseek](https://deepseek.com)
    - ✅ [ChatGPT](https://chatgpt.com) 🚀
    - ✅ [Gemini](https://gemini.google.com) 🚀
    - ✅ [Kimi](https://kimi.moonshot.cn)
    - ✅ [智谱](https://bigmodel.cn/) 需要自购 API
    - ✅ [千问](https://chat.qwen.ai/)
    - [MiniMax](https://agent.minimaxi.com/)
    - ✅ [火山引擎](https://console.volcengine.com/ark) 价格比较便宜
    - [OpenRouter](https://openrouter.ai)
    - ✅ [Perplexity](https://pplx.ai) 🚀
    - [Poe](https://poe.com) 🚀
    - [Flowith](https://flowith.io) 🚀
- 本地版
    - [ChatWise](https://chatwise.app?atp=T8RvrL) 自己配置 API Key，作为一个本地的管理工具
    - [Alma](https://alma.now/) 带有记忆的 AI 工具
    - [Ollama](https://ollama.com) 有本地客户端
    - [Cherry Studio](https://cherry-ai.com)
    - [ChatGPT/CodeX](https://chatgpt.com) 🚀

## 字体

- 编程
    - ✅ [Maple Mono NF](https://github.com/subframe7536/maple-font/releases/)
      - 设置变量 `calt`, `liga`, `cv01`, `cv35` 为 `true`
    - ✅ [Fira Code](https://github.com/tonsky/FiraCode/releases/)
    - ✅ [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
    - IBM Plex Mono
- 文字工作
    - ✅ [Inter](https://rsms.me/inter/)
    - ✅ [Linux Libertine](https://github.com/libertine-fonts/libertine) (ACM 模板论文正文字体)
    - Calibri
    - CMU Serif (Latin Modern Math)
    - ✅ [霞鹜文楷](https://github.com/lxgw/LxgwWenKai) (输入法配置字体)
    - 霞鹜新晰黑
    - 霞鹜新致宋 (但还是习惯了 Songti SC)
- 能区分大写 `I` 和小写 `l` 的一些无衬线字体字体
	- Microsoft Aptos
	- PT Sans
	- Segoe UI
	- Verdana

## 运行 Windows 程序

- ✅ GameHub 盖世游戏，可登录 Steam，可自行上传 EXE 可执行程序
- 腾讯应用宝
- [BrandyWine](https://github.com/SOHAM4884/Brandywine) 依赖安装麻烦而且不一定能正常运行

## 网页端工具

### PDF 处理

- ✅ https://pdfresizer.com/
- ✅ https://www.ilovepdf.com/
- ✅ [PDF 24 Tools 移除元数据](https://tools.pdf24.org/zh/remove-pdf-metadata)

### 数据转换

- [表格转 CSV](https://tableconvert.com/zh-cn/excel-to-csv)
- [Markdown 转 CSV](https://tableconvert.com/zh-cn/markdown-to-csv)

### 自己开发的

- https://tools.widcard.win
	- 时间差计算
	- JSON 格式化
	- URI 编解码
	- JSON / CSV / YAML / TOML 转换
	- 字符转义
	- Tex 表格转其他格式
- [Asciimath Parser](https://asciimath.widcard.win) 更方便的写数学公式

## Windows 可考虑使用的工具

https://gist.github.com/widcardw/bae18c37bfc43ed2f05fecdf0c9d6568
