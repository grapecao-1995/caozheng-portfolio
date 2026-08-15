import type { ReactElement } from 'react'

export interface CircularGalleryItem {
  /** 图片 URL */
  image: string
  /** 标题文字（绘制在图片下方） */
  text: string
}

export interface CircularGalleryProps {
  items?: CircularGalleryItem[]
  /** 弯曲程度（默认 3，越大圆环越明显） */
  bend?: number
  /** 标题文字颜色（默认 #ffffff） */
  textColor?: string
  /** 图片圆角比例（默认 0.05） */
  borderRadius?: number
  /** canvas 字体（默认 'bold 30px Figtree'） */
  font?: string
  /** 自定义字体 URL（Google Fonts 样式表或字体文件） */
  fontUrl?: string
  /** 滚动速度（默认 2） */
  scrollSpeed?: number
  /** 滚动缓动（默认 0.05） */
  scrollEase?: number
}

declare const CircularGallery: (props: CircularGalleryProps) => ReactElement
export default CircularGallery
