import { defineThemeConfig } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default defineThemeConfig({
  // 部署的域名
  hostname: "https://widcardw.github.io",

  // 作者信息
  author: {
    name: "widcardw",
  },

  iconPrefix: "iconfont icon-",

  logo: "/links/avatar.jpg",

  // 仓库名
  repo: "widcardw/widcardw.github.io",

  // 文档在仓库中的目录
  docsDir: "docs",

  // navbar
  navbar: navbar,

  // sidebar
  sidebar: sidebar,

  footer: "Powered by VuePress Theme Hope",

  displayFooter: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    description: "不是多面手",
    intro: "/pages/about.html",
    medias: {
      Email: "mailto:widcardw@outlook.com",
      GitHub: "https://github.com/widcardw",
      Gmail: "mailto:widcardw0105@gmail.com",
      Zhihu: "https://www.zhihu.com/people/wu-hua-rou-68-55",
    },
  },

  encrypt: {
    config: {
      // "/guide/encrypt.html": ["1234"],
    },
  },

  plugins: {
    blog: {
      autoExcerpt: true,
    },

    // 如果你不需要评论，可以直接删除 comment 配置，
    // 以下配置仅供体验，如果你需要评论，请自行配置并使用自己的环境，详见文档。
    // 为了避免打扰主题开发者以及消耗他的资源，请不要在你的正式环境中直接使用下列配置!!!!!
    comment: {
      /**
       * Using giscus
       */
      type: "giscus",
      repo: "widcardw/giscus-discussion",
      repoId: "R_kgDOHOA75A",
      category: "Announcements",
      categoryId: "DIC_kwDOHOA75M4COuTG",

      /**
       * Using twikoo
       */
      // type: "twikoo",
      // envId: "https://twikoo.ccknbc.vercel.app",

      /**
       * Using Waline
       */
      // type: "waline",
      // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    },

    mdEnhance: {
      // enableAll: true,
      tex: true,
      mermaid: true,
      mark: true,
      container: true,
      tasklist: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },
  },
});
