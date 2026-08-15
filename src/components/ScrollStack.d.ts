import type { ReactElement, ReactNode } from 'react'

export interface ScrollStackProps {
  children: ReactNode
  className?: string
  /** 卡片之间的滚动距离（默认 100） */
  itemDistance?: number
  /** 每张卡片的缩放递减（默认 0.03） */
  itemScale?: number
  /** 堆叠时卡片间距（默认 30） */
  itemStackDistance?: number
  /** 堆叠触发位置（百分比或 px，默认 '20%'） */
  stackPosition?: string | number
  /** 缩放结束位置（默认 '10%'） */
  scaleEndPosition?: string | number
  /** 卡片缩放基准（默认 0.85） */
  baseScale?: number
  scaleDuration?: number
  /** 旋转量（度，默认 0） */
  rotationAmount?: number
  /** 模糊量（px，默认 0） */
  blurAmount?: number
  /** 是否使用窗口滚动（默认 false：内部容器滚动） */
  useWindowScroll?: boolean
  /** 堆叠完成回调（最后一张卡片钉住时触发） */
  onStackComplete?: () => void
}

export declare const ScrollStackItem: (props: {
  children: ReactNode
  itemClassName?: string
}) => ReactElement

declare const ScrollStack: (props: ScrollStackProps) => ReactElement
export default ScrollStack
