import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  /** 动画延迟（秒） */
  delay?: number
  /** 动画时长（秒） */
  duration?: number
  /** 起始位移 x */
  x?: number
  /** 起始位移 y */
  y?: number
  className?: string
  style?: CSSProperties
  /** 是否只触发一次 */
  once?: boolean
}

/**
 * 滚动进入视口时的淡入上移动画。
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  once = true,
}: FadeInProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '50px', amount: 0 }}
      transition={{
        duration: reduce ? 0 : duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
