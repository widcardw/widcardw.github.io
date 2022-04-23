import { defineSidebarConfig } from "vuepress-theme-hope";

export default defineSidebarConfig([
  "/",
  "/pages/projects",
  {
    text: "文章",
    icon: "note",
    prefix: "article/",
    collapsable: true,
    children: [
      {
        text: "随笔",
        icon: "edit",
        prefix: "blog/",
        collapsable: true,
        children: ["blog-transfer", "methodology", "MyFirstBlog" ],
      },
      {
        text: "尝试",
        icon: "discover",
        prefix: "trials/",
        collapsable: true,
        children: ["MPV-use-notes"]
      },
      {
        text: "笔记",
        icon: "note",
        prefix: "notes/",
        collapsable: true,
        children: ["database-review", "manimgl-installation", "vectorized-mobject"]
      },
      {
        text: "垃圾箱",
        icon: "restrict",
        prefix: "garbage/",
        collapsable: true,
        children: ["garbage01"]
      },
    ],
  },
]);
