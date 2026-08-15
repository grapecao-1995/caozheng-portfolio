import type { CSSProperties, ReactElement, ReactNode } from 'react'

export interface BorderGlowProps {
  children: ReactNode
  className?: string
  /** 边缘感应灵敏度（默认 30，越大越容易触发） */
  edgeSensitivity?: number
  /** 辉光颜色（HSL 空格格式，如 '40 80 80'） */
  glowColor?: string
  /** 卡片背景色（默认 #120F17） */
  backgroundColor?: string
  /** 圆角 px（默认 28） */
  borderRadius?: number
  /** 外发光扩散范围 px（默认 40，密集网格请调小） */
  glowRadius?: number
  /** 辉光强度（默认 1） */
  glowIntensity?: number
  /** 光锥展开角度（默认 25） */
  coneSpread?: number
  /** 入场扫描动画（默认 false） */
  animated?: boolean
  /** 网格渐变三色（默认紫/粉/蓝） */
  colors?: string[]
  /** 内部填充不透明度（默认 0.5） */
  fillOpacity?: number
  /** 额外样式（可传自定义 CSS 变量，如 --glow-border 边框色） */
  style?: CSSProperties & Record<`--${string}`, string | number>
}

declare const BorderGlow: (props: BorderGlowProps) => ReactElement
export default BorderGlow
