import type { CSSProperties, ReactElement } from 'react'

export interface DriftWallItem {
  /** 图片 URL */
  image: string
  /** 标题（无障碍 / 悬停提示） */
  title?: string
  /** 点击跳转链接（可选） */
  href?: string
}

export interface DriftWallProps {
  items?: DriftWallItem[]
  /** 列数（默认 5） */
  columns?: number
  tileWidth?: number
  tileHeight?: number
  gap?: number
  radius?: number
  /** 3D 倾斜角（度） */
  tilt?: number
  turn?: number
  roll?: number
  perspective?: number
  depth?: number
  /** 漂移速度（默认 42） */
  speed?: number
  /** 漂移方向 */
  direction?: 'up' | 'down'
  /** 列速度差异（默认 0.45） */
  variance?: number
  /** 鼠标视差（默认 0.6） */
  parallax?: number
  pauseOnHover?: boolean
  /** 悬停抬升高度 */
  lift?: number
  /** 边缘渐隐（0-1，默认 0.6） */
  fade?: number
  /** 默认压暗程度（默认 0.55） */
  dim?: number
  grayscale?: boolean
  overlayColor?: string
  className?: string
  style?: CSSProperties
}

declare const DriftWall: (props: DriftWallProps) => ReactElement
export default DriftWall
