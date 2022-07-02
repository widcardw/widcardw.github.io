import { defineHopeConfig } from "vuepress-theme-hope";
import themeConfig from "./themeConfig";
import { path } from "@vuepress/utils";
import callout from "./plugins/callout";
import doubleBracketLink from "./plugins/double-bracket-link";
import doubleBracketMedia from "./plugins/double-bracket-media";

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
    md.use(doubleBracketMedia);
    md.use(doubleBracketLink);
    md.use(callout);
  }
});
