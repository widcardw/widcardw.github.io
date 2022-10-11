---
title: MPV 使用心得
date: 2021-01-23
tags:
  - software
category: software
article: true
---

# MPV 使用心得
## 我与MPV
最初接触到 MPV 是在 Elteoremadebeethoven 的视频。当时也只是看到了，也并没有去刻意的关注，毕竟跨平台的音视频播放器应该来说还是蛮多的。而且我们也没有什么特别的需求要在自己的电脑上安装过多不同种类的播放器，毕竟常用的一般都不会超过 3 个。有了一个 PotPlayer 不就够了吗。

之前有浏览过关于 FFmpeg 耻辱柱的信息，而 PotPlayer 的前身居然也在这上面。再加上现在国内似乎去不了 PotPlayer 的官网，想要下载到较为原装版本的 PotPlayer 似乎就变得有点困难。**但是**，当我回想起几年前接触到一个剪辑软件 Aviutl 的时候，教程中指导我们安装**完美解码**，而完美解码的安装包中就恰好有几款颇受大众推崇的播放器：PotPlayer，MPC-HC，MPC-BE。或许这也是在国内获取到 PotPlayer 的一种途径吧。

这时，我开始关注开源软件，去关注 github 上的那些高“星”项目。以此为契机，我打算去了解一下 FFmpeg 和 MPV ~~虽然到现在为止我还没有克隆过这两个仓库~~。在 2017 年，我就因 [Lmintlcx](https://github.com/lmintlcx) 的教程了解到了 FFmpeg，不过这也仅仅是为了给视频进行压制而学习的一点点技能。通过命令行进行操作，让我这个计算机系学生的某些“特征”得以展现出来。MPV 可以通过命令行进行操作，或许这也是我开始接触它的一个原因。

## 软件的安装

这是 MPV 的官网：[mpv.io](https://mpv.io)

这款软件和 FFmpeg 有一个共同之处，就是 Windows 用户只能使用其他用户编译的版本。也就是说，它是没有直接可用的安装包，并且我们需要手动的把它的路径写入Path。而 Linux 用户可以通过命令 `sudo apt-get install mpv` 来进行安装，由此可见在一定程度上 Windows 确实不太适合程序员。

具体安装过程不在这里展开。

## 初次接触

当我第一次使用这个播放器，我心中积压了满满的不快。右键暂停，占据了菜单的位置；一张满是快捷键的图，这真的是人能背下来的吗？播放结束自动关闭，这似乎不太符合我之前的习惯……因为这些原因，我差点直接把它删了。

网上教程零碎，英文文档令人头疼，但我却偏偏喜欢将时间花在这种事情上。自定义属性和快捷键，或许是 MPV 的一个小亮点，等到终于配置完成之后，操作终于能够渐渐熟悉起来。

这是我的一些配置，存放在 `%APPDATA%/Roaming/mpv` 当中。

```text
# mpv.conf  属性设置

no-border                   # 无边框
keep-open=yes               # 播放结束时不直接关闭
save-position-on-quit=yes   # 保存播放记录，下次打开继续播放
# Subtitle settings  字幕设置
sub-auto=fuzzy
sub-font-size=50
sub-ass-force-margins
```

```text
# input.conf  快捷键设设置

/        set  video-aspect 1.7777  # 16:9
?        set  video-aspect 1.3333  # 4:3
b        add  video-rotate 15      # 旋转15度
n        set  video-rotate 0       # 重置旋转角度
c        seek 0 absolute-percent ; set pause no  # 重新播放
```

## 再次研究

mpv 作为一个能够使用命令行进行操作的播放器，当然要有其特殊之处。但我却没有想到，这个播放器竟然能播放在线的视频。后来在搜索中发现，原来在 Linux 上安装 mpv 时，它会自动安装 youtube-dl 库，用来抓取网络上的视频。如果再使用 you-get 库，在命令中添加属性 `-p` 来指定播放器，同样能够在线观看视频。

```shell
mpv https://b23.tv/av666
you-get -p mpv https://b23.tv/av170001
```
这样即可直接抓取视频在本地播放，这一功能着实令人惊讶，也让我感叹爬虫与反爬之间的激烈竞争。~~不会爬虫还在这儿说，爪巴~~

## 再多 BB 两句

之后有机会一定要好好了解视频到底是怎样一个事物。C++ 已经学完了，但其中最基本的“流”概念都不知道，或许是真的可悲了。
