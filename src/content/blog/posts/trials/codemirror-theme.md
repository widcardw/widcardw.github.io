---
title: Codemirror 主题更改问题
pubDate: 2024-08-24
updatedDate: 2024-08-24
tags: 
  - codemirror
  - theme
description: 从各处挖来的代码，合并到一起做个整理。
---

## 基础用法

```js
let editor = new EditorView({
  parent: document.querySelector('#editor'),
  extensions: [
    basicSetup,
    // 添加其他插件
  ],
})
```

当组件声明周期结束时析构编辑器

```js
onCleanup(() => editor?.destroy())
```

## 取消外描边

像这样的样式，可以从 extensions 中去添加

```js
import { highlightActiveLine, scrollPastEnd } from '@codemirror/view'

let editor = new EditorView({
  extensions: [
    EditorView.theme({
      "&.cm-focused": { outline: "none" },
    }),
    EditorView.lineWrapping, // 自动换行
    scrollPastEnd(), // 底部空出一些空间
    // highlightActiveLine(), // 高亮当前行，一般是自带的
  ],
})
```

## 明暗主题

```js
const themeConfig = new Compartment()
let editor = new EditorView({
  extensions: [
    // 初始化时设定主题
    themeConfig.of(EditorView.theme({}, { dark: isDark() }))
  ],
})
```

动态设置明暗主题

```js
function setEditorTheme (dark: boolean) {
  editor.dispatch({
    effects: themeConfig.reconfigure(EditorView.theme({}, { dark: isDark() }))
  })
}

// Solidjs
createEffect(on(isDark, (v) => setEditorTheme(v)))
// Vuejs
let watchDarkStop = watch(isDark, v => setEditorTheme(v))
onBeforeUnmount(() => { watchDarkStop?.() })
```
