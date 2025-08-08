---
title: OneDrive 忽略上传某些文件
pubDate: 2025-04-28
updatedDate: 2025-04-28
tags:
  - OneDrive
  - 网盘
description: 微软社区给的解答，mac 上暂时还没去找解决方案
---

## 改注册表

注册表路径

```txt title="注册表路径"
HKLM\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreListFromGPO
```

创建项目：

| 数值名称           | 数值数据               |
| -------------- | ------------------ |
| back_files     | `*.bak`            |
| log_files      | `*.log`            |
| sqlite-journal | `*.sqlite-journal` |

重启 OneDrive 应用后生效。可以看到文件的右侧出现灰色的圆圈横杠，说明该文件不会被上传。然而，其实还是难以避免 Zotero 和 OneDrive 共同发力，创建超多个不同后缀的副本。

但有时候 OneDrive 会自动创建「设备名」作为文件名标识的备份文件，导致出现拷贝很多份的问题，这个恐怕是没什么办法。
