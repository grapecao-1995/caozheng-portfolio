import type { ReactElement } from 'react'

export interface DomeGalleryProps {
  /** 图片数组（URL 字符串或 { src, alt }） */
  images?: (string | { src: string; alt?: string })[]
  fit?: number
  fitBasis?: string
  minRadius?: number
  maxRadius?: number
  padFactor?: number
  /** 放大查看时的遮罩色 */
  overlayBlurColor?: string
  maxVerticalRotationDeg?: number
  dragSensitivity?: number
  enlargeTransitionMs?: number
  /** 球体分段数（默认 35） */
  segments?: number
  dragDampening?: number
  openedImageWidth?: string
  openedImageHeight?: string
  imageBorderRadius?: string
  openedImageBorderRadius?: string
  /** 是否灰白显示（默认 true，彩色请设 false） */
  grayscale?: boolean
}

declare const DomeGallery: (props: DomeGalleryProps) => ReactElement
export default DomeGallery
