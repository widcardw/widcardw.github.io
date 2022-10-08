---
title: Projects
projects:
  Personal:
    - name: 'My slides'
      link: 'https://slides.widcard.win'
      desc: 'Presentations'
      icon: 'i-ri-slideshow-2-line'
    - name: 'My Notes'
      link: 'https://notes.widcard.win'
      desc: 'Notes of my courses'
      icon: 'i-ri-booklet-line'
  Manim:
    - name: 'Video Tutorials'
      link: 'https://space.bilibili.com/31976300/channel/collectiondetail?sid=79029&ctype=0'
      desc: 'Tutorial for updater'
      icon: 'i-ri-keynote-line'
    - name: 'MK home page'
      link: 'https://manim.org.cn'
      desc: 'Manim Kindergarten'
      icon: 'mk'
  TSX starters:
    - name: 'TSX starter lite'
      link: 'https://github.com/widcardw/vue-tsx-starter-lite'
      desc: 'Light version of TSX starter for vue'
      icon: 'i-ri-rocket-line'
    - name: 'TSX starter'
      link: 'https://github.com/widcardw/vue-tsx-starter'
      desc: 'TSX starter for vue'
      icon: 'i-ri-rocket-2-line'
  Games:
    - name: 'Lab'
      link: 'https://lab.widcard.win'
      desc: '数字华容道'
      icon: 'i-ri-gamepad-line'
  Markdown-it Tools:
    - name: 'Callouts'
      link: 'https://github.com/widcardw/mdit-plugin-callouts'
      desc: 'Callout block for markdown-it'
      icon: 'i-ri-code-s-slash-line'
    - name: 'Media'
      link: 'https://github.com/widcardw/mdit-plg-double-bracket-media'
      desc: 'Wiki link media for markdown-it'
      icon: 'i-ri-image-2-line'
    - name: 'Link'
      link: 'https://github.com/widcardw/mdit-plg-double-bracket-link'
      desc: 'Wiki link for markdown-it'
      icon: 'i-ri-link'
  Apps:
    - name: 'D4nm4ku'
      link: 'https://github.com/widcardw/D4nm4ku'
      desc: 'A danmaku viewer build with tauri'
      icon: 'i-ri-bilibili-fill'
    - name: 'Tauri-wubi'
      link: 'https://github.com/widcardw/tauri-wubi'
      desc: 'Wubi input method exerciser'
      icon: 'i-ri-wubi-input'
---

# Projects

<ListProjects :projects="frontmatter.projects" />
