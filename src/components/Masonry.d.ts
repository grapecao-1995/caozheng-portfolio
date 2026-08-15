import type { ReactElement, ReactNode } from 'react'

export interface MasonryItem {
  /** 唯一 id（供 GSAP 选择器定位） */
  id: string
  /** 卡片高度（px） */
  height: number
  /** 图片模式：背景图 URL */
  img?: string
  /** 图片模式：点击打开的链接（linkable=true 时） */
  url?: string
  [key: string]: unknown
}

export interface MasonryProps {
  items: MasonryItem[]
  /** 各断点列数，对应 [≥1500, ≥1000, ≥600, ≥400]（默认 [5,4,3,2]） */
  columns?: number[]
  /** 卡片间距 px（默认 16） */
  gap?: number
  ease?: string
  duration?: number
  /** 入场错峰间隔（默认 0.05s） */
  stagger?: number
  /** 入场方向（默认 bottom：从底部弹出） */
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random'
  /** 悬停缩放（默认 true） */
  scaleOnHover?: boolean
  hoverScale?: number
  /** 入场时模糊聚焦（默认 true） */
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
  /** 是否点击打开 url（默认 true；内容模式请设为 false） */
  linkable?: boolean
  /** 自定义卡片内容渲染（替代背景图模式） */
  renderContent?: (item: MasonryItem) => ReactNode
}

declare const Masonry: (props: MasonryProps) => ReactElement
export default Masonry
