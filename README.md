# 曹政 · 个人作品集网站

视觉 / AI / 品牌设计师曹政的个人作品集。
**暗色 · 霓虹紫**，版面参考 motionsites：超大 vw 渐变标题、滚动跑马灯、3D 挂绳 ID 卡、等高对齐画廊。

## 线上地址

- 生产：https://caozheng-portfolio.pages.dev （Cloudflare Pages）
- 本地开发：`npm run dev` → http://localhost:5180

## 快速开始

```bash
npm install       # 安装依赖
npm run dev       # 本地开发（端口 5180）
npm run build     # 生产构建 → dist/
npm run preview   # 预览构建产物（端口 5181）
```

## 区块结构

```
Hero      → 全屏：超大 vw 渐变标题 + 肖像 + CTA
Marquee   → 两行视频跑马灯，随滚动反向横移
About     → 四角作品图装饰 + 逐字显现介绍
Services  → 白底反差区，5 项服务 Masonry 卡片 + 咨询卡
Projects  → 3 个项目等高对齐画廊，点击任意图打开大图预览（lightbox）
Contact   → 3D 挂绳 ID 卡（可拖拽甩动）+ 联系方式一键复制 + 作品漂移墙
```

另有「查看更多案例」页（`?case=` 参数，ScrollStack 邀请 + 微信二维码）。

## 内容修改

所有可替换内容集中在 **`src/lib/site.ts`**：姓名、联系方式、服务项、项目与图片列表、跑马灯视频列表。

## 图片策略

- 项目作品图：画廊网格与作品漂移墙使用 `-thumb.webp` 缩略图（640px，q75），点开 lightbox 加载 `1600px q82` 大图 —— 小图轻量、点开清晰。
- 图片统一 WebP；微信二维码保留 PNG 无损。
- 3D 挂绳卡片（three.js）与案例页（lenis）均按需懒加载，不影响首屏。

## 技术栈

React 18 · Vite 6 · TypeScript · Tailwind CSS 3 · Framer Motion · three.js（react-three-fiber / rapier）· lenis · lucide-react

## 部署

Cloudflare Pages：

- 构建命令：`npm run build`
- 输出目录：`dist`
- 或本地直传：`npx wrangler pages deploy dist`
