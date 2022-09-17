import{u as e,o as p,c as l,w as c,a as n,b as s,_ as i}from"./app.cd993408.js";const u=n("div",{class:"markdown-body"},[n("h1",{id:"sublimelinter-%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95",tabindex:"-1"},"SublimeLinter \u4F7F\u7528\u8BB0\u5F55"),n("details",{class:"custom-callout tip",open:""},[n("summary",{class:"callout-title"},[n("div",null,"\u6CE8\u610F"),n("div",{class:"callout-fold"})]),n("blockquote",null,[n("p",null,"\u5176\u5B9E\u4F7F\u7528 Sublime-lsp \u548C pyright \u4F1A\u66F4\u597D\u4E00\u4E9B\uFF0C\u672C\u6587\u8BB2\u7684 linter \u8FD8\u5F97\u624B\u52A8\u914D\u7F6E")])]),n("h2",{id:"1.-%E5%AE%89%E8%A3%85",tabindex:"-1"},"1. \u5B89\u88C5"),n("p",null,[s("Sublime Text \u4E0A\u5B89\u88C5\u63D2\u4EF6\u8FD8\u662F\u76F8\u5F53\u65B9\u4FBF\u7684\uFF0C\u53EA\u9700 "),n("kbd",null,"\u2318"),s(),n("kbd",null,"\u21E7"),s(),n("kbd",null,"P"),s(" \u5373\u53EF\u6253\u5F00 Package Control\uFF0C\u5728\u5176\u4E2D\u641C\u7D22\u63D2\u4EF6\u5E76\u5B89\u88C5\u6240\u5BF9\u5E94\u7684\u63D2\u4EF6\u5C31\u53EF\u4EE5\u4E86\u3002")]),n("p",null,"\u9996\u5148\u6211\u4EEC\u9700\u8981\u5B89\u88C5 SublimeLinter \u63D2\u4EF6\uFF0C\u7136\u540E\u518D\u88C5\u4E0A\u4EE5 SublimeLinter \u6253\u5934\u7684\u5BF9\u5E94\u7684 linter \u3002\u6B64\u5904\u5C31\u4EE5 pylint \u4E3A\u4F8B\u3002"),n("h2",{id:"2.-%E9%85%8D%E7%BD%AE",tabindex:"-1"},"2. \u914D\u7F6E"),n("h3",{id:"2.1.-path",tabindex:"-1"},"2.1. PATH"),n("p",null,[s("\u5149\u662F\u5B89\u88C5\u8FD9\u4E24\u4E2A\u63D2\u4EF6\u8FD8\u4E0D\u591F\uFF0C\u56E0\u4E3A linter \u662F\u4EE5 pip install \u5B89\u88C5\u7684 "),n("mark",null,"pylint \u53EF\u6267\u884C\u7A0B\u5E8F"),s(" \u6765\u9A71\u52A8\u7684\u3002\u56E0\u6B64\u6211\u4EEC\u9700\u8981\u8BA9 pylint \u8FD9\u4E2A\u7A0B\u5E8F\u80FD\u591F\u5728 "),n("code",null,"PATH"),s(" \u4E2D\u627E\u5230\uFF0C\u6216\u8005\u5C06\u5B83\u5199\u5230 SublimeLinter \u8BBE\u7F6E\u4E2D\u7684 "),n("code",null,"paths"),s(" \u53C2\u6570\u4E2D\u3002\u6B64\u5904\u4F7F\u7528\u540E\u8005\u7684\u65B9\u6848\u3002")]),n("p",null,[n("kbd",null,"\u2318"),s(),n("kbd",null,"\u21E7"),s(),n("kbd",null,"P"),s(" \u6253\u5F00 Preferences: SublimeLinter settings")]),n("pre",{class:"language-json"},[n("code",{class:"language-json"},[n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token property"},'"paths"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token property"},'"linux"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token property"},'"osx"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),s(`
      `),n("span",{class:"token string"},'"/Users/leeocoy/Library/Python/3.9/bin"'),s(`
    `),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token property"},'"windows"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),n("span",{class:"token punctuation"},"]"),s(`
  `),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("p",null,"\u8FD9\u6837 SublimeLinter \u5C31\u80FD\u627E\u5230 linter \u7684\u8DEF\u5F84\u4E86\u3002"),n("h3",{id:"2.2.-linter",tabindex:"-1"},"2.2. linter"),n("p",null,"\u6211\u4EEC\u5B89\u88C5\u4E86 pylint\uFF0C\u5C31\u9700\u8981\u5728 linters \u53C2\u6570\u4E2D\u5199\u5165\u6211\u4EEC\u6240\u9700\u8981\u7684 linter"),n("pre",{class:"language-json"},[n("code",{class:"language-json"},[n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token property"},'"linters"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token property"},'"pylint"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(),n("span",{class:"token comment"},"// \u6B64\u5904\u4E3A pylint"),s(`
      `),n("span",{class:"token property"},'"args"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),s(`
        `),n("span",{class:"token string"},'"--disable=missing-class-docstring"'),n("span",{class:"token punctuation"},","),s(`
        `),n("span",{class:"token string"},'"--disable=missing-function-docstring"'),n("span",{class:"token punctuation"},","),s(`
        `),n("span",{class:"token string"},'"--disable=missing-module-docstring"'),n("span",{class:"token punctuation"},","),s(`
        `),n("span",{class:"token string"},'"--disable=R0903,R0904,R0913,R0914,W0614,C0103"'),s(`
      `),n("span",{class:"token punctuation"},"]"),s(`
    `),n("span",{class:"token punctuation"},"}"),s(`
  `),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("p",null,"\u4EE5\u53CA\uFF0C\u53EF\u4EE5\u53C2\u7167\u9ED8\u8BA4\u7684\u89C4\u8303\uFF0C\u6216\u8005\u5B98\u65B9\u6587\u6863\u6765\u4FEE\u6539\u53C2\u6570\u3002\u6B64\u5904\u7684\u914D\u7F6E\u5C4F\u853D\u4E86\u4E00\u4E9B\u8B66\u544A\uFF0C\u9632\u6B62\u6574\u4E2A\u6587\u4EF6\u770B\u8D77\u6765\u5F88\u4E71\u3002"),n("h2",{id:"3.-%E5%AE%8C%E6%95%B4%E9%85%8D%E7%BD%AE",tabindex:"-1"},"3. \u5B8C\u6574\u914D\u7F6E"),n("pre",{class:"language-json"},[n("code",{class:"language-json"},[n("span",{class:"token comment"},"// SublimeLinter Settings - User"),s(`
`),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token property"},'"paths"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token property"},'"linux"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token property"},'"osx"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),s(`
      `),n("span",{class:"token string"},'"/Users/leeocoy/Library/Python/3.9/bin"'),s(`
    `),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},","),s(`
    `),n("span",{class:"token property"},'"windows"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),n("span",{class:"token punctuation"},"]"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property"},'"lint_mode"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token string"},'"background"'),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token property"},'"linters"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token property"},'"pylint"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"{"),s(`
      `),n("span",{class:"token property"},'"args"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),s(`
        `),n("span",{class:"token string"},'"--disable=missing-class-docstring"'),n("span",{class:"token punctuation"},","),s(`
        `),n("span",{class:"token string"},'"--disable=missing-function-docstring"'),n("span",{class:"token punctuation"},","),s(`
        `),n("span",{class:"token string"},'"--disable=missing-module-docstring"'),n("span",{class:"token punctuation"},","),s(`
        `),n("span",{class:"token string"},'"--disable=R0903,R0904,R0913,R0914,W0614,C0103"'),s(`
      `),n("span",{class:"token punctuation"},"]"),s(`
    `),n("span",{class:"token punctuation"},"}"),s(`
  `),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("p",null,"\u5BF9\u4E8E\u5176\u4ED6\u7684 linter\uFF0C\u4F8B\u5982 eslint \u7B49\uFF0C\u90FD\u53EF\u4EE5\u4F7F\u7528\u7C7B\u4F3C\u7684\u64CD\u4F5C\u3002")],-1),m="2022-04-28T00:00:00.000Z",y=["sublime","linter"],h="software",E=!0,_="\u540E\u6765\u53D1\u73B0\u57FA\u4E8E LSP \u7684 pyright \u597D\u50CF\u8981\u66F4\u597D\u4E00\u4E9B",x=[],f={__name:"SublimeLinter",setup(r,{expose:a}){const t={date:"2022-04-28T00:00:00.000Z",tags:["sublime","linter"],category:"software",article:!0,abstract:"\u540E\u6765\u53D1\u73B0\u57FA\u4E8E LSP \u7684 pyright \u597D\u50CF\u8981\u66F4\u597D\u4E00\u4E9B",meta:[]};return a({frontmatter:t}),e({meta:[]}),(d,g)=>{const o=i;return p(),l(o,{frontmatter:t},{default:c(()=>[u]),_:1})}}};export{_ as abstract,E as article,h as category,m as date,f as default,x as meta,y as tags};
