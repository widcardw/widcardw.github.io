---
title: manimgl 安装记录
date: 2021-06-24
tags:
  - manim
category: manim
article: true
---

# manimgl 安装记录

> [!caution] 注意
> 本博客大部分配置依旧生效，但最好还是去官网 <https://docs.manim.org.cn> 查看具体的安装教程。

## 1. 关于 manimgl

`manimgl`，即原 [`3b1b/manim`](https://github.com/3b1b/manim) 下的 `shaders` 分支，现在已经合并到了主分支~~俗称偷家~~。

### 1.1. 一些区别

- 使用 `PyOpenGL` 和 `moderngl` 来进行图形的绘制和上色，相比于原来的 `cairo` 版本拥有更高的性能和速度。
- 使用 `Pyglet Window` 来进行窗口预览/交互，可以达到更高的效率。
- 在矢量图中将原来的三阶贝塞尔换成了二阶贝塞尔。
- ~~增加了不少图形、文字上的 bug~~
- ~~移除了 herobrine~~

## 2. 关于安装

### 2.1. 一些说明

其实已经有不少人都写过安装教程了（例如 [GZTime 的博客](https://blog.gztime.cc/posts/2021/758c52ab/), <https://docs.manim.org.cn>），~~我完全可以不写的~~。但许多人还是遇到了不少问题。

另外，暂时不是特别推荐使用 Windows Subsystem for Linux 来进行安装，因为没有图形化的界面对于**需要生成窗口的 Pyglet Window 模块**是相当尴尬的，同时有不少人也尝试安装图形界面，但解决这个问题的人好像真的不多。

### 2.2. 安装过程

#### 2.2.1. FFmpeg

- Windows 用户去[官网](https://ffmpeg.org)下载用户编译版本的 FFmpeg，并添加到环境变量 Path 中，直到在终端中输入 `ffmpeg -h` 能够显示 FFmpeg 的帮助信息。
- Linux 和 Mac OS 用户直接采用命令行安装，这里不再赘述。

#### 2.2.2. LaTeX

- Windows 用户依然是去 [Mik$\TeX$](https://www.miktex.org) 官网或 [$\TeX$Live](http://tug.org/texlive/) 官网下载安装器，并安装基本的 $\LaTeX$ 包，我在这里建议安装完整的包。
- Linux 用户直接用下面的命令行安装 $\TeX$Live Full.
	```bash
	sudo apt-get install texlive-full
	```
- Mac OS 用户可以选择 [Mac $\TeX$](http://www.tug.org/mactex/)，同样可以搜索后进行安装。

当然，如果你不想安装那么大的 $\LaTeX$ 包，而且你对它的需求**仅限于简单的数学公式**，可以考虑使用 [ManimGL-MathJax](https://github.com/manim-kindergarten/ManimGL-MathJax)，在本文的后面会提到。

#### 2.2.3. manimgl

##### 1. 使用 git 克隆仓库 <https://github.com/3b1b/manim.git>。

> [!tip]
> 如果直接下载 zip 包，则不会包含 `.git` 文件夹里面的一些环境。如果嫌慢，可以采用 `gitee` 进行中转，或者采用下面的国内镜像进行克隆。
> 
> ```bash
> git clone https://github.com.cnpmjs.org/3b1b/manim.git
> ```
> 
> 当然，如果你熟悉 `degit` 工具的话，那就再好不过了，虽然这样可能无法使用 `git pull` 更新代码
> 
> ```bash
> degit 3b1b/manim manimgl
> ```


##### 2. 进入该文件夹，使用命令行安装运行环境

```bash
pip install -e .  # 注意，最后有一个点
```

> [!caution]
 > 此时可能会遇到下面的报错（该部分来自 *manimgl 常见问题*）
 >
 > ```bash
 > CMake must be installed to build the following extensions
 > ```
 >
 > 可以先通过运行 `pip install cmake` 安装 `cmake`，再尝试。

##### 3. 配置参数

可以采用自带的方式来配置，在刚刚的目录下执行命令 `manimgl --config`，即可配置参数。在参数配置过程中，建议将环境安装在 local 而不是 global，否则如果你想要更改源码，你就必须在全局的 Python 环境中找到 site-packages 里面的 manimgl 包进行修改，可能相对来说会比较繁琐。

> [!tip]
> 同时，这个配置过程会让你指定 Tex 和 Text 的临时文件输出路径，将它们设置到合适的位置，否则会出现下面的报错。
> 
> ```shell
> $ OSError: C:\Users\...\Temp\Tex\<...>.svg not Found
> ```

### 2.3. 测试安装是否成功

在刚刚的目录下运行下面的命令，即测试 Grant 给的场景。

```bash
manimgl example_scenes.py OpeningManimExample
```

如果能正常打开一个窗口并能使得动画播放完，那么就是安装成功了。


### 2.4. 使用 VSCode 的脚本进行操作

> 该部分来自 [GZTime 的博客](https://blog.gztime.cc/posts/2021/758c52ab/)

使用该脚本，其本质就是让 VSCode 帮你写一个运行的脚本（~~大概~~），让你免于频繁地敲命令。`launch.json` 文件的内容将会放在[附录](#launch.json)。

在这里以一个脚本配置为例子，该例子仅针对本博客中的配置，与 GZTime 的配置有一点点区别，主要在于路径不同。

```json
{
  "name": "Preview manim", // manim 预览
  "type": "python",
  "request": "launch",
  "cwd": "${workspaceFolder}", // 设置当前工作路径
  "env": {
    "PYTHONPATH": "${workspaceFolder}" // 设置 Python 运行环境变量
  },
  "program": "${workspaceFolder}/manimlib/__main__.py", // 设置运行程序
  "console": "integratedTerminal", // 使用 vsc 内置终端
  "args": [
    "${file}", // 当前文件路径
    "--config_file", // 配置文件参数
    "${workspaceFolder}/custom_config.yml" // 配置文件路径
  ]
}
```

在配置完脚本之后，点击绿色的小三角运行，就相当于运行了下面的命令，同时，该方法也适用于打断点 debug，但是从性能来看似乎是不如直接敲命令的。

```bash
python manimlib/__main__.py example_scenes.py --config_file custom_config.yml
```

### 2.5. 关于在 `xxx.py` 中引入 `manim_sandbox` 的内容

> [!example] 已修复
> 在 [`Commit 7ecfc04`](https://github.com/3b1b/manim/commit/7ecfc041b3883db7eb55c79fb29f5b83feb86fdd) 之后，`manimlib/__main__.py` 文件中已经添加了
> ```python
> if "__name__" == __main__:
>     main()
> ```
> 
> 语句，因此添加该语句的操作可以忽略。


#### 2.5.1. 如何引入且不报路径错

如果你的 `manim_sandox` 和 `manimlib` 在同一级目录下，那么你可以在你的文件里这样引入模块

```python
from manimlib import *
from manim_sandbox.utils.imports import *
```

然后，可以继续用上面提到的**使用 VSCode 的脚本进行操作**来进行预览和输出文件，或者用它的命令来运行。

```bash
python manimlib xxx.py
```

#### 2.5.2. 使用 `manimgl xxx.py` 渲染报错的原因

因为 `manimgl` 命令会将环境切换到和你当前想要渲染的文件的同级目录下，也就是说如果当前文件和 `manim_sandbox` 的路径不同，那么就无法根据相对路径来索引到 `manim_sandbox` 文件夹，因此会出现路径错误。

### 2.6. 关于引入 ManimGL-MathJax

目前 GitHub 上 [ManimGL-MathJax](https://github.com/manim-kindergarten/ManimGL-MathJax) 的最新版本是 0.1.2 (2022/04/13)，但 https://pypi.org 上还没更新，直接用 pip install 可能会报错，因此建议手动克隆这个仓库，然后手动安装

```bash
git clone https://github.com/manim-kindergarten/ManimGL-MathJax.git
cd ManimGL-MathJax
pip install -e .
cd manimgl-mathjax
pnpm install   # 安装 asciimath-js 和 mathjax-full 依赖
```

## 3. 附录

### launch.json

*注：本部分不包含旧版的运行脚本*

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Preview manim", // manim 预览
      "type": "python",
      "request": "launch",
      "cwd": "${workspaceFolder}", // 设置当前工作路径
      "env": {
        "PYTHONPATH": "${workspaceFolder}" // 设置 Python 运行环境变量
      },
      "program": "${workspaceFolder}/manimlib/__main__.py", // 设置运行程序
      "console": "integratedTerminal", // 使用 vsc 内置终端
      "args": [
        "${file}", // 当前文件路径
        "--config_file", // 配置文件参数
        "${workspaceFolder}/custom_config.yml" // 配置文件路径
      ]
    },
    {
      "name": "Render manim", // manim 渲染 1080p@30
      "type": "python",
      "request": "launch",
      "cwd": "${workspaceFolder}", // 设置当前工作路径
      "env": {
        "PYTHONPATH": "${workspaceFolder}" // 设置 Python 运行环境变量
      },
      "program": "${workspaceFolder}/manimlib/__main__.py", // 设置运行程序
      "console": "integratedTerminal", // 使用 vsc 内置终端
      "args": [
        "${file}", // 当前文件路径
        "--hd", // --hd选项 使用 1080p@30
        "-w", // 写入文件
        "-o", // 完成后打开
        "--config_file", // 配置文件参数
        "${workspaceFolder}/custom_config.yml" // 配置文件路径
      ]
    },
    {
      "name": "Render manim 4k", // manim 渲染 4k@60
      "type": "python",
      "request": "launch",
      "cwd": "${workspaceFolder}", // 设置当前工作路径
      "env": {
        "PYTHONPATH": "${workspaceFolder}" // 设置 Python 运行环境变量
      },
      "program": "${workspaceFolder}/manimlib/__main__.py", // 设置运行程序
      "console": "integratedTerminal", // 使用 vsc 内置终端
      "args": [
        "${file}", // 当前文件路径
        "--uhd", // --uhd选项 使用 4k@60
        "-w", // 写入文件
        "-o", // 完成后打开
        "--config_file", // 配置文件参数
        "${workspaceFolder}/custom_config.yml" // 配置文件路径
      ]
    },
    {
      "name": "Export manim picture", // manim 导出最后一帧 4k
      "type": "python",
      "request": "launch",
      "cwd": "${workspaceFolder}", // 设置当前工作路径
      "env": {
        "PYTHONPATH": "${workspaceFolder}" // 设置 Python 运行环境变量
      },
      "program": "${workspaceFolder}/manimlib/__main__.py", // 设置运行程序
      "console": "integratedTerminal", // 使用 vsc 内置终端
      "args": [
        "${file}", // 当前文件路径
        "--uhd", // --uhd 选项 使用 4k@60
        "-w", // 写入文件
        "-o", // 完成后打开
        "-s", // 跳过动画
        "--config_file", // 配置文件参数
        "${workspaceFolder}/custom_config.yml" // 配置文件路径
      ]
    }
  ]
}
```

### 其他问题

#### WSL 下安装和预览

由于 `manimgl` 使用了 `Pyglet Window` 来进行实时预览，也就是说会跳出一个窗口，而 WSL 无法调出 GUI，因此用 WSL 你只能生成视频，无法实现预览的效果。

哦不对，这里面的图形接口依赖处理好像翔哥之前搞过，绕不过去，要不然早就可以搞在线版了 `¯\_(ツ)_/¯`

#### ControlsExample 无法运行

~~在 [#1551](https://github.com/3b1b/manim/pull/1551) 有解决方案，但会导致 [#1378](https://github.com/3b1b/manim/issues/1378) 的动画无法正确生成，因此暂时被搁置，等到有更好的解决方案，会对这两个问题进行解决。~~

似乎在 [`Commit 01670cf`](https://github.com/3b1b/manim/commit/01670cf8238a4419d108f65ce093693dfe72773f) 已经得到解决，可以尝试更新至最新版。

#### 关于 `pip install manimgl`

由于在 Pypi 上的镜像源不会一直保持更新，所以建议采用 `git clone` 和 `git pull` 来保持最新版，能够对 bug 的解决有一定的帮助。

#### 预览窗口的位置

可以通过在 `custom_config.yml` 中的 `window_position` 进行设置，使用说明可以在 `manimlib/default_config.yml` 中找到，Grant 的注释写的很清晰。

#### 更多问题

详见 <https://manim.org.cn>


