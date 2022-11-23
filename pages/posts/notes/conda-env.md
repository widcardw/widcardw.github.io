---
title: 折腾 conda 环境
date: 2022-10-29
category: 'python'
tags: ['python', 'conda', 'manim', '环境配置', 'env']
---

# 折腾 conda 环境

## 1. 起因

逛 Github 的时候发现了一个好玩的工具 [bcut_asr](https://github.com/SocialSisterYi/bcut-asr)，可以调用 B 站字幕识别的接口，想下载下来玩玩。然而他的环境是 Python 3.10，而我当年为了图方便，就直接用 homebrew 安装了 Python，版本是 3.9，也不知道怎么更新，于是在**大滑稽**的指导下，我开始使用 conda 了。

## 2. 安装

当然，在此时前，我得先把已经装过的 Python 卸载掉。

```sh
pip3 freeze > requirements.txt
pip3 uninstall -r requirements.txt -y
brew uninstall python@3.9
```

> [!caution]
> `brew uninstall python@3.9` 并不会同时卸载掉 `pip`，因此可能还需要手动把 `pip` 的可执行程序删除。
>
> 在 bash 中，使用 `which` 命令查看 `pip` 的位置
>
> ```sh
> which pip
> /opt/homebrew/bin
> ```
>
> 在访达中，使用 <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> 进入这个目录（或者使用 `rm` 命令），把 `pip` 和 `pip3` 这两个可执行程序删除。~~虽然这么做好像有点暴力，但是它有效~~

因为我对那些图形之类的库需求并不是很强硬，所以我就安装了 [miniconda](https://docs.conda.io/en/latest/miniconda.html)，直接下载 sh 文件就可以双击运行了。

## 3. 创建环境

安装完成之后，当然就是创建虚拟环境了。我们将 base 环境下的 Python 设置为 3.10

```sh
conda install python=3.10
```

这样，zsh 就会显示成这样

```sh
(base) ~
$ python --version
Python 3.10.6
```

## 4. 重装 manim

既然 manim 的环境都被删了，那么我们就来重新安装一下吧。

### 4.1. 创建一个新的环境

这个新创建的环境和 base 环境是隔离的。其实 conda 可以看作是做 Python 版本管理的工具。

```sh
(base) ~/Documents/manim
$ conda create -n manim
(base) ~/Documents/manim
$ conda activate manim
(manim) ~/Documents/manim
$ conda install python=3.10
```

### 4.2. 创建一个虚拟环境

我的工程目录大概是这样的：

```text
manim
  |--- .vscode            # 一些运行配置
  |--- wid_manim          # 我从 3b1b 处 fork 的 manim
  |      |--- docs
  |      |--- logo
  |      |--- manimlib    # 核心包都在这里
  |      |--- ...
  |--- manim_sandbox      # mk 写的一些 utils
  |--- my_videos          # 我做视频的源码
  |--- mk_homepage        # manim.org.cn 的主页
  |--- custom_config.yml  # 自定义配置
```

我们将 manim 看作是一个工程来管理，因此我们将依赖都安装在一个虚拟环境里。因此我们首先创建一个虚拟环境。

```sh
(manim) ~/Documents/manim
$ pip install virtualenv
(manim) ~/Documents/manim
$ virtualenv venv           # 创建虚拟环境
(manim) ~/Documents/manim
$ source venv/bin/activate  # 启用虚拟环境
(manim) (venv) ~/Documents/manim
$
```

### 4.3. 安装 manimgl 的依赖

由于我有可能会修改 manimgl 的源码，因此我选择本地安装，而不是直接安装发布到 pypi 上的包。

```sh
(manim) (venv) ~/Documents/manim
$ cd wid_manim
(manim) (venv) ~/Documents/manim/wid_manim
$ pip install -e .
```

安装完成后，在 `/ico i-vscode-icons-default-folder-opened;venv` 目录下，能看到 `/ico i-vscode-icons-default-folder-opened;bin` 和 `/ico i-vscode-icons-default-folder-opened;lib` 中已经出现了很多包，这说明依赖差不多就已经装好了。

### 4.4. 关于模块的引入

打开 `/ico i-vscode-icons-default-folder-opened;my_videos` 文件夹，发现原来的引入语句报错了，不能通过下面

```py
from manimlib import *
```

这条语句来导入 manim 的方法。原因其实也很简单，因为在 `/ico i-vscode-icons-default-folder-opened;venv/lib/Python3.10/site-packages` 中，并没有 `manimlib` 这个包，我们需要想办法从 `/ico i-vscode-icons-default-folder-opened;wid_manim` 中导入进来。

解决方案很明显，我可以这样干：

```py
from wid_manim.manimlib import *
```

这样，模块就被正确导入进来了。但是运行的时候，环境又不承认了

```
(manim) (venv) ~/Documents/manim
$ manimgl my_videos/videos/danmku.py
  ...
  File ".../manim/my_videos/videos/danmku.py", line 1, in <module>
    from wid_manim.manimlib import *
ModuleNotFoundError: No module named 'wid_manim'
```

环境并不承认我们有这个包，因为它似乎只认 `site-packages` 中的包。

这时，我想到了 pnpm 对于包的管理手段：软链接。可以通过创建软链接，将包索引到合理的位置。

```sh
(manim) (venv) ~/Documents/manim
$ ln -s /Users/name/Documents/manim/wid_manim/manimlib \
    venv/lib/python3.10/site-packages/manimlib
```

> [!caution]
> `/Users/name/Documents/manim/wid_manim/manimlib` 这个路径必须是完整的==绝对路径==，否则链接创建会失败！

打开 `/ico i-vscode-icons-default-folder-opened;venv/lib/python3.10/site-packages` 文件夹，可以发现多了一个 `/ico i-vscode-icons-file-type-lnk;manimlib` 的链接。此时， `/ico i-vscode-icons-default-folder-opened;my_videos` 中的模块也被正确引入了，用下面这条命令运行，也是成功的。

```sh
(manim) (venv) ~/Documents/manim
$ manimgl my_videos/videos/danmku.py
```

## 5. 再扯一下 manim 的运行

事实上，因为我选择了本地安装，manimgl 还可以通过下面的命令运行

```sh
(manim) (venv) ~/Documents/manim
$ python wid_manim/manimlib my_videos/videos/danmaku.py
```

其实这样是间接的使用了 `/ico i-vscode-icons-file-type-python;wid_manim/manimlib/__main__.py` 来启动，其实可以达到几乎相同的效果。而用这条命令可以导入其他包，例如 `manim_sandbox` 中的工具类。而如果想要直接用 `manimgl` 命令来执行的话，这就必须采用上面的软链接的方式，将它链接到虚拟环境中。

> 其实用这个长命令的话，就可以使用
>
> ```py
> from wid_manim.manimlib import *
> ```
>
> 来引入 `manimlib` 了，环境是不会报错的。

这条命令很长，我们依然是采用一个 `/ico i-vscode-icons-file-type-json;launch.json` 脚本来启动它。

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
      "program": "${workspaceFolder}/wid_manim/manimlib/__main__.py", // 设置运行程序
      "console": "integratedTerminal", // 使用 vsc 内置终端
      "args": [
        "${file}", // 当前文件路径
        "--config_file", // 配置文件参数
        "${workspaceFolder}/custom_config.yml" // 配置文件路径
      ]
    }
  ]
}
```

其中，`program` 关键字指定了运行的主程序，如果读者直接使用 pypi 包安装，并且使用的是下面的命令来启动

```sh
manimgl example.py
```

那么，你的主程序应当是 `manimgl`，而非上述的 `/ico i-vscode-icons-file-type-python;__main__.py` 文件。因此，你需要做出以下修改

```diff
- "program": "${workspaceFolder}/wid_manim/manimlib/__main__.py",
+ "program": "${workspaceFolder}/venv/bin/manimgl",
```


