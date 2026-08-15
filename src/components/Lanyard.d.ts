import type { ReactElement } from 'react'

export interface LanyardProps {
  /** 初始相机位置（默认 [0, 0, 30]） */
  position?: [number, number, number]
  /** 物理重力向量（默认 [0, -40, 0]） */
  gravity?: [number, number, number]
  /** 相机视场角（默认 20） */
  fov?: number
  /** 透明背景（默认 true） */
  transparent?: boolean
  /** 卡片正面图片 URL（默认使用模型内置纹理） */
  frontImage?: string | null
  /** 卡片背面图片 URL */
  backImage?: string | null
  /** 图片适配方式（默认 cover；二维码建议 contain 避免裁切） */
  imageFit?: 'cover' | 'contain'
  /** 挂绳带纹理 URL */
  lanyardImage?: string | null
  /** 挂绳带宽度（默认 1） */
  lanyardWidth?: number
  /** 挂绳锚点水平偏移（世界单位）：把卡片停靠位置移到画面右侧 */
  anchorX?: number
  /** 挂绳长度（世界单位，默认 3；调小则挂绳更短、卡片占比更大） */
  ropeLength?: number
  /** 进入视口时自动摆动一次（默认 true）：卡片摇晃后被阻尼停住 */
  swingOnView?: boolean
  /** 入场摆动强度（角速度 rad/s，默认 7，越大甩得越猛） */
  swingStrength?: number
  /** 持续轻晃（默认 false）：让卡片保持轻微摆动，更显生动 */
  idleSway?: boolean
  idleSwaySpeed?: number
  idleSwayStrength?: number
}

declare const Lanyard: (props: LanyardProps) => ReactElement
export default Lanyard
