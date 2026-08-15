import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  /** 磁吸感应范围（像素，从元素边缘向外延伸） */
  padding?: number
  /** 位移强度（越小越跟手） */
  strength?: number
  className?: string
}

/**
 * 鼠标磁吸效果：光标靠近时元素向光标方向轻微偏移，离开时弹性复位。
 */
export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
      const triggerDist = Math.max(rect.width, rect.height) / 2 + padding

      if (dist < triggerDist) {
        setActive(true)
        setPos({ x: (e.clientX - cx) / strength, y: (e.clientY - cy) / strength })
      } else {
        setActive(false)
        setPos({ x: 0, y: 0 })
      }
    }

    const onLeave = () => {
      setActive(false)
      setPos({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [padding, strength, reduce])

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={reduce ? { x: 0, y: 0 } : { x: pos.x, y: pos.y }}
      transition={{
        duration: active ? 0.3 : 0.6,
        ease: active ? [0.2, 0.6, 0.2, 1] : [0.3, 0.25, 0.25, 1],
      }}
      style={{ willChange: 'transform', display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}
