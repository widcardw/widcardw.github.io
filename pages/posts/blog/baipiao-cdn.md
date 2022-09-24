---
date: 2022-09-24
category: 'software'
tags: ['CDN','静态部署']
---

# 如何使用 CloudFlare 和 GitHub 来给图片做 CDN

> 本来标题应该是 “白嫖”，但是突然想到我是从 CloudFlare 买的域名，还是花了钱的，所以也不能算是白嫖了，呜呜。

## Why

为什么要采用这一种方案呢？其实还是因为想白嫖，毕竟买域名的钱都花了，不用也说不过去。另外就是 CloudFlare 自身的图片 CDN 是按月来订购的，感觉好像有点贵，所以就继续白嫖 GitHub 了（x

## How

### 在 GitHub 上创建一个仓库

我使用 _CDN_ 作为仓库名，这样就能稍微好记一点，也符合它的含义。

在本地进行一些初始化工作，例如文件目录，_.gitignore_ 等等，这些也不用过多去阐述。另外，你需要上传一张图片，来作为需要 CDN 的对象。

下面是本地仓库的文件树

```text
.
|____.git
|____.gitignore
|____manim
| |____favicon.svg   # 图片文件
|____README.md
```

### 开启 GitHub Pages 服务

在 _Settings > pages_ 页面，将 main 分支部署到 GitHub Pages

### 在 CloudFlare 添加 DNS 规则

在 _域名 > DNS_ 页面中，添加一条规则

| 类型  | 名称 | 内容                 | 代理状态 | TTL |
|:-----:|:----:|:--------------------:|:--------:|:---:|
| CNAME | cdn  | widcardw.github.io | 已代理   | 自动    |

其中，内容中填写的是自己开启 GitHub Pages 服务后所获得的 url

### 在 GitHub Pages 服务中添加自定义域名

自定义域名为 **cdn**.widcard.win

等待片刻后，就可以通过 <https://cdn.widcard.win/manim/favicon.svg> 这个路径来访问资源了


