import { defineHopeConfig } from "vuepress-theme-hope";
import themeConfig from "./themeConfig";
import { path } from "@vuepress/utils";

export default defineHopeConfig({
  alias: {
    "@MyComponent": path.resolve(__dirname, "components/FriendComponent.vue"),
  },
  lang: "zh-CN",
  title: "widcardw",
  description: "widcardw 的博客",

  base: "/",

  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_2410206_mfj6e1vbwo.css",
      },
    ],
  ],

  public: './docs/public',
  
  themeConfig,

  extendsMarkdown: md => {
    md.use(require("./plugins/double-bracket-media.js"));
    md.use(require("./plugins/admonition-translator.js"), 'ad');
  }
});
