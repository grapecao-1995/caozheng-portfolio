import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
}

/**
 * 逐字滚动显现动画：随滚动进度，每个字符从 opacity 0.2 淡到 1。
 * 字符使用“隐形占位 + 绝对定位”的方式，保证布局不抖动。
 */
export default function AnimatedText({ text, className }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })
  const chars = text.split('')

  return (
    <p ref={ref} className={`relative ${className ?? ''}`}>
      {chars.map((ch, i) => (
        <Char
          key={i}
          char={ch}
          progress={scrollYProgress}
          start={reduce ? 0 : i / chars.length}
          end={reduce ? 1 : (i + 1) / chars.length}
        />
      ))}
    </p>
  )
}

function Char({
  char,
  progress,
  start,
  end,
}: {
  char: string
  progress: MotionValue<number>
  start: number
  end: number
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1])

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char}
      </motion.span>
    </span>
  )
}
