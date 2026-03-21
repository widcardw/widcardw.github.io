---
title: Mac 上常用的软件
pubDate: 2024-12-29
updatedDate: 2026-1-1
tags:
  - 软件
  - macOS
description: 备份一下，以便后续设备迁移后能找到对应列表，打勾为常用
---

## 游戏

### 八音盒

[sing-box](https://sing-box.sagernet.org/) (Go)

社区有做 GUI，我 fork 了一下 [GUI.for.SingSox](https://github.com/widcardw/GUI.for.SingBox)，稍微改了改；可以在设置中下载内核

### X 光

- [2dust](https://2dust.link/) (C#)

### 原神

- [Verge-Rev](https://www.clashverge.dev/guide/quickstart.html) (Tauri)
- [Nyanpasu](https://nyanpasu.elaina.moe/zh-CN/) (Tauri)

## 输入法

- ✅ [Rime](https://rime.im) 小狼毫/鼠须管
- ✅ [rime-frost](https://github.com/gaboolic/rime-frost) 输入法方案
- ✅ 自定义的部分配置，见 [gist](https://gist.github.com/widcardw/23005e112780fec16fb35e1fff221f4b)

## 云同步

- ✅ [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/download)
  - 无法连接时，可使用《游戏》或 [Watt Toolkit](https://steampp.net) 加速
- iCloud (仅备忘录)

## 文献管理

- ✅ [Zotero](https://zotero.org) + OneDrive
- ✅ [Obsidian](https://obsidian.md)
  - Excalidraw
  - Asciimath
  - Advanced tables
  - Various Complements

## 代码编辑器

- ✅ [VSCode](https://code.visualstudio.com/)
  - 点击 Other platforms 下载 Apple Silicon Zip 版本，则不会下载完整的 Universal 版本，更瘦身，[详情](https://twitter.com/yetone/status/1886814901051777118).
  - Trae/Lingma/CodeBuddy 插件辅助编写代码
- ✅ [Zed](https://zed.dev)
  - VSCode Icons Theme + Mariana Theme
  - 可作为默认的文本编辑器，例如可以当作临时的 Markdown 打开器。然而针对 GBK 等不统一的文本编码可能还要等官方维护。
  - AI Panel 功能在配置了 API Key 之后挺好用的
  - 已支持 OpenCode
- Trae 字节出品的 AI 编辑器
- [Sublime Text](https://www.sublimetext.com/download) 万能的文本编辑器
- [Intellij IDEA](https://www.jetbrains.com.cn/idea/download/?section=mac) (Community)
- 类 Vim (仅高级选手使用，不建议其他人折腾，而是直接用系统自带 Vim)
  - [Helix](https://helix-editor.com/) + [简单配置](https://github.com/widcardw/helix-config)
  - [NeoVim](https://neovim.io/) + [LazyVim](https://www.lazyvim.org/) + [Neovide](https://neovide.dev/)
- AI 编程工具
  - [Claude Code](https://docs.claude.com/zh-CN/docs/claude-code/overview)
    - 可使用国内的模型，手动配置 Base URL 和 API Key，参考[智谱开发文档](https://docs.bigmodel.cn/cn/guide/develop/claude)
    - 使用 [Claude Code Router](https://github.com/musistudio/claude-code-router) (命令行) 配置转发器，白嫖 modelscope 每日 2000 次额度
    - 或者使用 [CC Switch](https://github.com/farion1231/cc-switch) (Tauri) 工具切换 Claude Code 或者 CodeX 的提供商
  - [OpenCode](https://opencode.ai/)
    - 每天有免费次数，可用 Kimi / GLM / BigPickle 等

## 命令行工具

个人曾经用过的配置有

- Mac 自带终端 + starship + `brew install z...`
- Ghostty /iTerm2 + starship + `brew install z...`
- Warp + `brew install z...`

### 窗口工具

- ✅ [Ghostty](https://ghostty.org/)
  - 用 Zig 语言开发的一个终端，快捷键基本上也都与 iTerm2 类似
  - `brew install --cask ghostty@tip`
  - 配置文件[参考](https://gist.github.com/widcardw/9436707cd6ed36fe45df51608656e364)，尤其是需要使用 SSH 时，必备 `term = xterm-256color` 这个选项
- [iTerm2](https://iterm2.com) (可接入各种 AI，需要安装 iTerm AI 插件) (iTerm2 已经开始支持内嵌浏览器，相当于是屈服于 AI 大潮了)
  - 个人觉得最好搭配 starship 或者 oh-my-zsh 使用
- [Warp](https://warp.dev) (不支持接入第三方 AI，每个月有免费额度)
  - 个人觉得可以搭配 `z`, `zsh-syntax-highlighting`, `zsh-autosuggestion` 这三个插件使用，且可以完全不装 starship/oh-my-zsh
  - 支持打开文件夹，已经变成一个类 Agent 的工具了
- [WezTerm](https://wezterm.org/)
  - 如果喜欢折腾，可以考虑用这个软件，配置方法参考[视频](https://www.bilibili.com/video/BV1miWMe9Esq)

### 命令行内的软件

#### ohmyzsh

[参考链接](https://ohmyz.sh/)

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

- ✅ Edge (Chromium) 觉得更好用，所以就不用 Google Chrome 了
  - Edge Drop 可以跨设备传消息、文件等
- ✅ Google Chrome (Canary 支持垂直标签页，但是易用性不如 Edge)
- Safari
  - Darker
  - JSONPeep
  - Ad Block One
- Zen (FireFox) 不常用

## 效率

- ✅ [RayCast](https://www.raycast.com/) Spotlight 替代品
  - 剪贴板工具
  - Search Web Font
  - Search NPM
  - Wikipedia
  - ScreenOCR
  - iTranslate
  - Unsplash
  - Show IP Address
- ✅ 卸载工具 [Pearcleaner](https://github.com/alienator88/Pearcleaner)
- ✅ 安卓存储访问（现已收费，自行编译免费） [Axchange](https://github.com/Lakr233/Axchange)
- 👍 ✅ 快速打开终端或编辑器 [OpenInTerminal-Lite](https://github.com/Ji4n1ng/OpenInTerminal/blob/master/Resources/README-Lite.md)
- ✅ 截图 [Shottr](https://shottr.cc)
- ✅ Hidden Bar (App Store)
- ✅ 图片压缩、转 PDF 等 [ImageMagick](https://imagemagick.org/) `brew install imagemagick`
- 空间清理
  - 👍 ✅ [Mole](https://github.com/tw93/Mole)
  - Tencent Lemon (App Store)
  - Daisy Disk (App Store 付费)
    - [Squirrel Disk](https://www.squirreldisk.com/) (免费开源代替，但 UI 没那么好看)
- 绘图
  - ✅ [tldraw](https://tldraw.com) 在线版
  - ✅ [Excalidraw](https://excalidraw.com) 在线版或 Obsidian 插件
  - InkScape (入门较困难)
- 压缩软件 [MacZip](https://maczip.cn/)
- 性能监控 RunCat (App Store)
- 端口查看工具 [PortKiller](https://github.com/productdevbook/port-killer)

## 外设软件适配

- ✅ 鼠标 [Scroll Reverser](https://pilotmoon.com/scrollreverser)
- ✅ 键盘映射 [Karabiner Elements](https://karabiner-elements.pqrs.org/)

## 下载工具

- ✅ [FDM](https://www.freedownloadmanager.org/)
  - 不支持资源嗅探，但是我本人对资源嗅探并不那么刚需
  - 支持 BT，但在[配置](https://www.zhihu.com/question/489562853/answer/64776078424)后达到更好的效果
  - FDM Elephant 插件可以解析并下载视频
- ✅ [NDM](https://www.neatdownloadmanager.com/index.php/en/)
  - 可进行资源嗅探
  - 不支持 BT
- Python you-get / ytb-dl

## 桌面呈现

- ✅ 按键显示 [Keycastr](https://github.com/keycastr/keycastr) `brew install --cask keycastr`
- ✅ 分屏工具 [Rectangle](https://rectangleapp.com/)

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

- ✅ [ToDesk](https://www.todesk.com/) (跨互联网，清晰度尚可，自带按键映射)
- [Microsoft Remote Desktop](https://learn.microsoft.com/zh-cn/windows-server/remote/remote-desktop-services/clients/remote-desktop-mac) (仅内网，清晰度高，速度快)

## AI 工具

- 在线版
  - ✅ [Deepseek](https://deepseek.com)
  - ✅ [千问](https://chat.qwen.ai/)
  - ✅ [MiniMax](https://agent.minimaxi.com/)
  - ✅ [智谱](https://bigmodel.cn/) 需要自购 API
  - ✅ [火山引擎](https://console.volcengine.com/ark) 价格比较便宜
  - ✅ [Kimi](https://kimi.moonshot.cn)
  - [腾讯元宝](https://yuanbao.tencent.com)
  - [OpenRouter](https://openrouter.ai)
  - ✅ [ChatGPT](https://chatgpt.com) 🚀
  - ✅ [Perplexity](https://pplx.ai) 🚀
  - ✅ [Gemini](https://gemini.google.com) 🚀
  - [Poe](https://poe.com) 🚀
  - [Flowith](https://flowith.io) 🚀
- 本地版
  - [ChatWise](https://chatwise.app?atp=T8RvrL) 自己配置 API Key，作为一个本地的管理工具
  - [Alma](https://alma.now/) 带有记忆的 AI 工具
  - [Ollama](https://ollama.com) 有本地客户端
  - [Cherry Studio](https://cherry-ai.com)
  - RayCast 插件接入 Deepseek API
  - [ChatGPT](https://chatgpt.com) 🚀

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
