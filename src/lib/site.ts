/**
 * ─────────────────────────────────────────────────────────────
 *  网站全部可替换内容集中在这里。
 *  想改姓名 / 联系方式 / 项目 / 服务 / 文案，改这一个文件即可。
 * ─────────────────────────────────────────────────────────────
 */

/* ------------------------------------------------------------------ */
/*  基础身份信息 —— 改成你自己的                                      */
/* ------------------------------------------------------------------ */
export const profile = {
  name: '曹政', // ← 你的名字
  nameEn: 'CAO ZHENG', // ← 英文名 / 拼音
  role: '视觉设计师 · AI 设计师 · 品牌设计师',
  // 联系方式（先占位，替换成真实信息）
  wechat: 'caozheng199542', // ← 微信号（对应二维码图 images/contact/wechat-qr.png）
  phone: '17616527588', // ← 手机号
  email: '792672793@qq.com', // ← 邮箱
}

/* ------------------------------------------------------------------ */
/*  导航（提示词原文：About / Price / Projects / Contact）             */
/* ------------------------------------------------------------------ */
export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Price', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

/* ------------------------------------------------------------------ */
/*  Hero 首屏                                                          */
/* ------------------------------------------------------------------ */
export const hero = {
  heading: "HI, I'M\nCAO ZHENG", // ← 大标题（真名拼音，\n 强制断为两行）
  tagline: '专注电商设计、网页设计与AI视觉创意创作', // ← 底部左侧描述
  portrait: '/images/hero/portrait.webp',
  // ↑ 换你的肖像：1:1 正方形比例（如 2048×2048），CSS 按方形完整显示不裁切。
  cta: { label: 'Contact Me', href: '#contact' },
}

/* ------------------------------------------------------------------ */
/*  跑马灯视频（本地 images/marquee/*.mp4，GIF 转码，随 build 打包）    */
/* ------------------------------------------------------------------ */
export const marqueeImages = [
  '/images/marquee/marquee-01.mp4',
  '/images/marquee/marquee-02.mp4',
  '/images/marquee/marquee-03.mp4',
  '/images/marquee/marquee-04.mp4',
  '/images/marquee/marquee-05.mp4',
  '/images/marquee/marquee-06.mp4',
  '/images/marquee/marquee-07.mp4',
  '/images/marquee/marquee-08.mp4',
  '/images/marquee/marquee-09.mp4',
  '/images/marquee/marquee-10.mp4',
  '/images/marquee/marquee-11.mp4',
  '/images/marquee/marquee-12.mp4',
  '/images/marquee/marquee-13.mp4',
  '/images/marquee/marquee-14.mp4',
  '/images/marquee/marquee-15.mp4',
  '/images/marquee/marquee-16.mp4',
  '/images/marquee/marquee-17.mp4',
  '/images/marquee/marquee-18.mp4',
  '/images/marquee/marquee-19.mp4',
  '/images/marquee/marquee-20.mp4',
]

/* ------------------------------------------------------------------ */
/*  About（提示词原文段落）                                             */
/* ------------------------------------------------------------------ */
export const about = {
  heading: 'About me',
  text: '我是曹政，拥有多年视觉设计经验，主攻电商设计、网页设计与 AI 设计。\n专注亚马逊、阿里国际站跨境视觉打造，赋能外贸商家展现品牌优势。\n期待携手合作，共同打造富有竞争力的跨境视觉作品。',
}

/* ------------------------------------------------------------------ */
/*  Services（提示词原文五项）                                          */
/* ------------------------------------------------------------------ */
export interface Service {
  index: string
  /** 图标 key（对应 Services 组件内的 lucide 图标映射） */
  icon: string
  name: string
  desc: string
}

export const services: Service[] = [
  {
    index: '01',
    icon: 'ecommerce',
    name: '电商视觉设计',
    desc: '为亚马逊、阿里国际站打造产品主图、详情页面与店铺视觉，优化页面观感，提升商品转化效果。',
  },
  {
    index: '02',
    icon: 'ai',
    name: 'AI 视觉创作',
    desc: '借助 AI 工具高效生成产品素材、场景效果图与创意画面，快速实现多样化视觉方案。',
  },
  {
    index: '03',
    icon: 'web',
    name: '网页设计',
    desc: '搭建简洁现代的独立站与品牌页面，兼顾版式美感、浏览体验与海外客户转化需求。',
  },
  {
    index: '04',
    icon: 'brand',
    name: '品牌视觉设计',
    desc: '打造统一品牌形象，包含 LOGO、视觉规范、宣传物料，塑造具备辨识度的外贸品牌风格。',
  },
  {
    index: '05',
    icon: 'layout',
    name: '跨境图文排版',
    desc: '产品图文优化、海报、宣传素材排版输出，适配海外平台规范，贴合海外买家审美。',
  },
]

/* ------------------------------------------------------------------ */
/*  Projects（提示词原文三个项目 + CloudFront 图片）                     */
/* ------------------------------------------------------------------ */
export interface Project {
  index: string
  category: string
  name: string
  tag: string // Client / Personal
  /** 卡片上的简短介绍 */
  blurb: string
  images: string[]
}

/**
 * 由大图 URL 派生缩略图 URL（同目录、`-thumb` 后缀）。
 * 画廊网格 / 作品漂移墙用缩略图，点开大图预览用原图 —— 保证小图轻量、点开清晰。
 */
export function thumbOf(url: string): string {
  return url.replace(/\.webp$/, '-thumb.webp')
}

export const projects: Project[] = [
  {
    index: '01',
    category: '跨境电商',
    name: '亚马逊电商设计',
    tag: '视觉设计 · 全品类',
    blurb: '亚马逊全品类视觉整体升级：从产品主图、A+ 详情页到品牌旗舰店，以统一视觉语言提升点击与转化。',
    images: [
      '/images/projects/project-01-01.webp',
      '/images/projects/project-01-02.webp',
      '/images/projects/project-01-03.webp',
      '/images/projects/project-01-04.webp',
      '/images/projects/project-01-05.webp',
      '/images/projects/project-01-06.webp',
      '/images/projects/project-01-07.webp',
      '/images/projects/project-01-08.webp',
      '/images/projects/project-01-09.webp',
      '/images/projects/project-01-10.webp',
      '/images/projects/project-01-11.webp',
      '/images/projects/project-01-12.webp',
      '/images/projects/project-01-13.webp',
      '/images/projects/project-01-14.webp',
      '/images/projects/project-01-15.webp',
      '/images/projects/project-01-16.webp',
      '/images/projects/project-01-17.webp',
      '/images/projects/project-01-18.webp',
      '/images/projects/project-01-19.webp',
      '/images/projects/project-01-20.webp',
      '/images/projects/project-01-21.webp',
      '/images/projects/project-01-22.webp',
      '/images/projects/project-01-23.webp',
      '/images/projects/project-01-24.webp',
      '/images/projects/project-01-25.webp',
    ],
  },
  {
    index: '02',
    category: 'B2B电子商务',
    name: '国际站与工业机械视觉',
    tag: '机械设备 · 海报展示',
    blurb: '国际站与工业机械视觉：B2B 产品海报与场景化宣传物料，突出机械质感与专业信任感。',
    images: [
      '/images/projects/project-02-01.webp',
      '/images/projects/project-02-02.webp',
      '/images/projects/project-02-03.webp',
      '/images/projects/project-02-04.webp',
      '/images/projects/project-02-05.webp',
      '/images/projects/project-02-06.webp',
      '/images/projects/project-02-07.webp',
      '/images/projects/project-02-08.webp',
      '/images/projects/project-02-09.webp',
      '/images/projects/project-02-10.webp',
      '/images/projects/project-02-11.webp',
    ],
  },
  {
    index: '03',
    category: '店铺装修',
    name: '国际站店铺装修设计',
    tag: '视觉设计 · 详情页',
    blurb: '国际站店铺装修：从店招、导航到产品详情页的一站式店铺视觉，打造完整统一的店铺体验。',
    images: [
      '/images/projects/project-03-01.webp',
      '/images/projects/project-03-02.webp',
      '/images/projects/project-03-03.webp',
      '/images/projects/project-03-04.webp',
      '/images/projects/project-03-05.webp',
      '/images/projects/project-03-06.webp',
      '/images/projects/project-03-07.webp',
      '/images/projects/project-03-08.webp',
      '/images/projects/project-03-09.webp',
      '/images/projects/project-03-10.webp',
      '/images/projects/project-03-11.webp',
      '/images/projects/project-03-12.webp',
      '/images/projects/project-03-13.webp',
      '/images/projects/project-03-14.webp',
      '/images/projects/project-03-15.webp',
      '/images/projects/project-03-16.webp',
      '/images/projects/project-03-17.webp',
      '/images/projects/project-03-18.webp',
      '/images/projects/project-03-19.webp',
      '/images/projects/project-03-20.webp',
      '/images/projects/project-03-21.webp',
      '/images/projects/project-03-22.webp',
      '/images/projects/project-03-23.webp',
      '/images/projects/project-03-24.webp',
      '/images/projects/project-03-25.webp',
      '/images/projects/project-03-26.webp',
      '/images/projects/project-03-27.webp',
      '/images/projects/project-03-28.webp',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  底部页脚（联系方式收尾，细条，不占整屏）                             */
/* ------------------------------------------------------------------ */
export const footer = {
  copyright: '© 2026 曹政 · 3D CREATOR / VISUAL DESIGNER',
}
