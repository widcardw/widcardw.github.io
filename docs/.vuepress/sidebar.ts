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
        children: ["MPV-use-notes", "SublimeLinter"]
      },
      {
        text: "笔记",
        icon: "note",
        prefix: "notes/",
        collapsable: true,
        children: ["database-review", "manimgl-installation", "vectorized-mobject", "quadratic_bezier_shader", "mongodb-notes", "vite-rsw"]
      },
      {
        text: "manim updater 教程文档",
        icon: "edit",
        prefix: "updater_tutorials/",
        collapsable: true,
        children: ["c01_front_knowledge", "c02_basic_usage", "c03_time_based_updater", "c04_update_from_func", "c05_write_your_own_anim"]
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
