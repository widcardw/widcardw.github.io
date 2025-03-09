---
title: Mac 上常用的软件
pubDate: 2024-12-29
updatedDate: 2024-12-29
tags:
  - 软件
  - macOS
description: 备份一下，以便后续设备迁移后能找到对应列表
---

## 原神

- [Mihomo](https://mihomo.party)，启动！

## 输入法

- [Rime](https://rime.im) 小狼毫
- [rime-frost](https://github.com/gaboolic/rime-frost) 输入法方案
- 自定义的部分配置，见 [gist](https://gist.github.com/widcardw/23005e112780fec16fb35e1fff221f4b)

## 云同步

- [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/download)
	- 无法连接时，可使用 Mihomo 或 [Watt Toolkit](https://steampp.net) 加速
- iCloud (仅备忘录)

## 文献管理

- [Zotero](https://zotero.org) + OneDrive
- [Obsidian](https://obsidian.md)
	- Excalidraw
	- Asciimath
	- Advanced tables
	- Various Complements

## 代码编辑器

- [VSCode](https://code.visualstudio.com/)
	- 点击 Other platforms 下载 Apple Silicon Zip 版本，则不会下载完整的 Universal 版本，更瘦身，[详情](https://twitter.com/yetone/status/1886814901051777118).
	- Continue 插件接入 Deepseek API，实现代码辅助编写
- [Zed](https://zed.dev)
	- VSCode Icons Theme + Mariana Theme
- [Sublime Text](https://www.sublimetext.com/download)
- [Intellij IDEA](https://www.jetbrains.com.cn/idea/download/?section=mac) (Community)

## 命令行工具

- [Warp](https://warp.dev) (目前用这个，不支持接入第三方 AI)
- [iTerm2](https://iterm2.com) (可接入 AI)

## 开发环境

- Python [miniconda](https://docs.anaconda.com/miniconda/)
	- 有人说 Mamba 更快，还没尝试过，感觉目前不刚需
	- 杀出了一个 `uv`，据说也是依赖管理速度很快
- Java
	- [Zulu](https://www.azul.com/downloads/)
	- [Oracle](https://www.oracle.com/java/technologies/downloads/#jdk23-mac)
- [Cargo](https://rustwiki.org/zh-CN/cargo/getting-started/installation.html)
- Node.js
	- [官网](https://nodejs.org/)
	- [nvm](https://github.com/nvm-sh/nvm) `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
	- [fnm](https://github.com/Schniz/fnm) `curl -fsSL https://fnm.vercel.app/install | bash`
- [Postgresql](https://www.postgresql.org/download/macosx/) `brew install postgresql@15`

## 浏览器

- Edge (Chromium) 觉得更好用，所以就不用 Google Chrome 了
- Google Chrome
- Safari
	- Darker
	- JSONPeep
	- Ad Block One
- Zen (FireFox) 不常用

## 效率

- [RayCast](https://www.raycast.com/)
	- Search Web Font
	- Search NPM
	- Wikipedia
	- ScreenOCR
	- iTranslate
	- Unsplash
	- Show IP Address
- 卸载工具 [Pearcleaner](https://github.com/alienator88/Pearcleaner)
- 安卓存储访问 [Axchange](https://github.com/Lakr233/Axchange)
- 快速打开终端或编辑器 [OpenInTerminal-Lite](https://github.com/Ji4n1ng/OpenInTerminal/blob/master/Resources/README-Lite.md)
- 截图 [Shottr](https://shottr.cc)
- Hidden Bar (App Store)
- 绘图
	- [tldraw](https://tldraw.com)
	- [Excalidraw](https://excalidraw.com) 有 Obsidian 插件
	- InkScape (入门较困难)
	- Ascii-d (forked version) (主分支长时间未维护)
- 压缩软件 [MacZip](https://maczip.cn/)

## 外设软件适配

- 鼠标 [Scroll Reverser](https://pilotmoon.com/scrollreverser)
- 键盘映射 [Karabiner Elements](https://karabiner-elements.pqrs.org/)

## 下载工具

- [NDM](https://www.neatdownloadmanager.com/index.php/en/) 
	- 最近常用，可进行资源嗅探
	- 不支持 BT
- Python you-get
- [FDM](https://www.freedownloadmanager.org/)
	- 支持 BT，但在[配置](https://www.zhihu.com/question/489562853/answer/64776078424)后达到更好的效果
	- FDM Elephant 插件可以解析并下载视频
- [XDown](https://xdown.org)
	- 支持 BT，做种等
	- 浏览器插件有时候会自动安装，在这种情况下就不用再按照官网那样去手动安装插件了

## 桌面呈现

- 按键显示 [Keycastr](https://github.com/keycastr/keycastr) `brew install --cask keycastr`
- 分屏工具 [Rectangle](https://rectangleapp.com/)

## 影视

- [IINA](https://iina.io/)
- [OBS Studio](https://obsproject.com/zh-cn/download)
- [FFmpeg](https://ffmpeg.org) `brew install ffmpeg`
- Davinci Resolve (App Store)
- 剪映 (App Store)

## 办公

- [WPS 国际版](https://wps.com)（安装后界面会自动切换为中文）
- Mac 自带三件套 Pages, Keynote, Numbers（这个用的人真的多吗？）
- Microsoft 三件套（App Store）（主要是体积太大了）

## 远程连接

- [ToDesk](https://www.todesk.com/) (跨互联网，清晰度尚可，自带按键映射)
- [Microsoft Remote Desktop](https://learn.microsoft.com/zh-cn/windows-server/remote/remote-desktop-services/clients/remote-desktop-mac) (仅内网，清晰度高，速度快)

## AI 工具

- [Deepseek](https://deepseek.com)
- [通义千问](https://tongyi.aliyun.com/)
- [ChatGPT](https://chatgpt.com) 🚀
- [Poe](https://poe.com) 🚀
- [Flowith](https://flowith.io) 🚀
- [Gemini](https://gemini.google.com) 🚀
