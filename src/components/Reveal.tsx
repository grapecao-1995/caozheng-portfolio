import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** 动画延迟（秒） */
  delay?: number
  className?: string
}

/**
 * 遮罩上推显现动画：内容从下方 115% 位置被“揭开”，
 * 用于大标题的入场，比普通淡入更有层次感。
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion()

  return (
    <span className={`block overflow-hidden ${className ?? ''}`}>
      <motion.span
        className="block"
        initial={reduce ? { opacity: 1 } : { y: '115%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
