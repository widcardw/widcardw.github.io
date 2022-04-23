import { defineNavbarConfig } from "vuepress-theme-hope";

export default defineNavbarConfig([
  "/",
  "/pages/projects",
  // { text: "友情链接", icon: "link", link: "/pages/links" },
  {
    text: "使用主题",
    icon: "note",
    link: "https://vuepress-theme-hope.github.io/v2/zh/",
  },
]);
