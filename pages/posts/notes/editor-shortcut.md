---
title: 文本编辑器的一些奇怪的快捷键
date: 2022-10-10
category: 'Shortcut'
tags: ['Shortcut', 'Editor']
---

# 文本编辑器的一些奇怪的快捷键

本文提到的与 Vim 的快捷键没有任何关系，仅针对如 Obsidian, VSCode, Sublime 等编辑器。当然，如果有快捷键冲突，那当我没说（

## 与 control 相关

> 此处的 control 指的不是 <kbd>⌘</kbd>，而是 <kbd>⌃</kbd>

|           按键            |               含义               | Hex | 速记                   |
|:-------------------------:|:--------------------------------:|:----------:| ---------------------- |
| <kbd>⌃</kbd> <kbd>A</kbd> |            跳转到行首            |   `0x01`   | A 是字母表的第一个字母 |
| <kbd>⌃</kbd> <kbd>B</kbd> |       光标向左移动一个字符       |   `0x02`   | Back                   |
| <kbd>⌃</kbd> <kbd>D</kbd> |      删除光标右侧的一个字符      |   `0x04`   | Delete                 |
| <kbd>⌃</kbd> <kbd>E</kbd> |            跳转到行尾            |   `0x05`   | End                    |
| <kbd>⌃</kbd> <kbd>F</kbd> |       光标向右移动一个字符       |   `0x06`   | Forward                |
| <kbd>⌃</kbd> <kbd>H</kbd> |      删除光标左侧的一个字符      |   `0x08`    |                        |
| <kbd>⌃</kbd> <kbd>K</kbd> |            删除至行尾            |   `0x0b`   |                        |
| <kbd>⌃</kbd> <kbd>N</kbd> |         光标移动到下一行         |   `0x0e`   | Next                   |
| <kbd>⌃</kbd> <kbd>O</kbd> | 在光标所在行的下一行创建一个新行 |   `0x0f`   | Open                   |
| <kbd>⌃</kbd> <kbd>P</kbd> |         光标移动到上一行         |   `0x10`   | Previous               |
| <kbd>⌃</kbd> <kbd>T</kbd> | 将光标所在的字符向后移动一个字符 |   `0x14`   |                        |
| <kbd>⌃</kbd> <kbd>V</kbd> |         光标移动到文件尾         |   `0x16`   | V 像是一个向下的箭头   |

上述按键中和移动光标相关的，与 <kbd>⇧</kbd> 组合可以选中选取中的文本，与 <kbd>⌥</kbd> 组合可以一次性移动一个单词或词语。

## 与 option 相关

在 macOS 中，<kbd>⌥</kbd> <kbd>A</kbd> 会得到一些希腊字母，其中 <kbd>A</kbd> 指代的是 ASCII 按键的任意一个，包括字母，数字，字符符号等，很怪。当然，在 iTerm2 中，我们可以找到 `/ico i-vscode-icons-file-type-config;Preferences > Profiles > Keys > General` 配置中，有 Option Key 的选项（分别是左右两个）

- [x] Normal
- [ ] Meta
- [ ] Esc+

默认选中的是 Normal，而如果选择 `Esc+` 这个选项，就可以在 iTerm2 中避免这种现象，将 <kbd>⌥</kbd> 键认为是功能组合键。

在常用编辑器中，经常使用 <kbd>⌥</kbd> 和鼠标操作来选择一些文本块。

- VSCode, Obsidian 中为 <kbd>⌥</kbd> <kbd>⇧</kbd> 鼠标选择（其实微软系应该都是这个组合，包括 Microsoft Word 也是）
- Sublime 中需要安装插件，但可以原生使用鼠标滚轮键选择文本块

## iTerm2 配置 <kbd>⌥</kbd> <kbd>→</kbd> 按照单词跳转

在 `/ico i-vscode-icons-file-type-config;Preferences > Profiles > Keys > Key Mappings` 中，将 Presets 更改为 ==Natural Text Editing==.

如果有需要，可以将 <kbd>⌥</kbd> <kbd>→</kbd> 对应的指令改为 ==Send Escape Sequence== Esc+<kbd>f</kbd>，将 <kbd>⌥</kbd> <kbd>←</kbd> 对应的指令改为 ==Send Escape Sequence== Esc+<kbd>b</kbd>



