import { ArrowUpRight } from 'lucide-react'

interface LiveProjectButtonProps {
  label?: string
  href?: string
  className?: string
}

/**
 * 幽灵描边胶囊按钮。
 */
export default function LiveProjectButton({
  label = 'Live Project',
  href = '#',
  className = '',
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-line px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-line transition-colors duration-300 hover:bg-line/10 sm:px-5 sm:py-2 sm:text-sm md:px-10 md:py-3 md:text-base ${className}`}
    >
      {label}
      <ArrowUpRight
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-4 md:w-4"
        strokeWidth={2.2}
      />
    </a>
  )
}
