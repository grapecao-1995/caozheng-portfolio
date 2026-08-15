import type { CSSProperties, ReactElement, ReactNode } from 'react'

export interface MagicBentoItem {
  /** 卡片背景色 */
  color: string
  /** 小标签（顶部） */
  label?: string
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 自定义内容（优先于 label/title/description 渲染） */
  content?: ReactNode
  [key: string]: unknown
}

export interface MagicBentoProps {
  items?: MagicBentoItem[]
  /** 悬停文字自动截断（默认 true） */
  textAutoHide?: boolean
  /** 粒子星星效果（默认 true） */
  enableStars?: boolean
  /** 全局聚光跟随（默认 true） */
  enableSpotlight?: boolean
  /** 边框辉光（默认 true） */
  enableBorderGlow?: boolean
  /** 禁用全部动画（默认 false；移动端自动禁用） */
  disableAnimations?: boolean
  spotlightRadius?: number
  particleCount?: number
  enableTilt?: boolean
  /** 辉光颜色（RGB 逗号格式，如 '182, 0, 168'） */
  glowColor?: string
  clickEffect?: boolean
  enableMagnetism?: boolean
  style?: CSSProperties
}

declare const MagicBento: (props: MagicBentoProps) => ReactElement
export default MagicBento
