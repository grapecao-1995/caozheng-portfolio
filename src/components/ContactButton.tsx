import { ArrowUpRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import { smoothScrollToHash } from '../lib/scroll'

interface ContactButtonProps {
  label?: string
  href?: string
  className?: string
}

/**
 * 渐变胶囊 CTA 按钮（参考 motionsites 样式）。
 * 点击锚点用自定义缓动滚动（丝滑滑到目标，而非浏览器整段遍历堆叠动画）。
 */
export default function ContactButton({
  label = 'Contact Me',
  href = '#contact',
  className = '',
}: ContactButtonProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      smoothScrollToHash(href)
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`group inline-flex items-center gap-2.5 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid #fff',
        outlineOffset: '-3px',
      }}
    >
      <span>{label}</span>
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={2.2}
      />
    </a>
  )
}
