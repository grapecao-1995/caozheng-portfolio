import { motion, useReducedMotion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { navLinks } from '../lib/site'
import { smoothScrollToHash } from '../lib/scroll'

/**
 * 顶部导航（提示词原文）：4 个链接均匀分布 justify-between，
 * 大写 + 字距拉开，悬停变淡。与 Hero 同屏静止展示，不吸顶。
 * 锚点点击走自定义缓动滚动，避免浏览器整段遍历堆叠动画。
 */
export default function Navbar() {
  const reduce = useReducedMotion()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      smoothScrollToHash(href)
    }
  }

  return (
    <motion.header
      className="relative z-30 px-6 pt-6 md:px-10 md:pt-8"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <nav className="shell flex justify-between">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="group relative text-sm font-medium uppercase tracking-wider text-line transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link.label}
            {/* 悬停渐变下划线 */}
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#B600A8] to-[#0EA5E9] transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </a>
        ))}
      </nav>
    </motion.header>
  )
}
