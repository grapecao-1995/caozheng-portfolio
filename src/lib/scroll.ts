/**
 * 丝滑滚动：锚点跳转不再被浏览器整段遍历（会生硬地穿过 Projects 堆叠区），
 * 而是用 rAF + easeInOutCubic 以固定节奏滑动，途中滚动驱动的动画与之同步。
 *
 * index.css 给 html 设了 `scroll-behavior: smooth`，会让循环里的
 * window.scrollTo 每次都被插帧动画化（跳动），所以动画期间临时改回 auto。
 */

export function smoothScrollTo(targetY: number, distance?: number) {
  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'

  const startY = window.scrollY
  const diff = targetY - startY
  const d = distance ?? Math.abs(diff)
  // 时长随距离缩放，钳在 600–1000ms：近处利落，远处也一气呵成
  const duration = Math.min(1000, Math.max(600, d * 0.35))

  const finish = () => {
    html.style.scrollBehavior = prev
  }
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (reduce || Math.abs(diff) < 2) {
    window.scrollTo(0, targetY)
    finish()
    return
  }

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  let cancelled = false
  // 用户中途滚轮/触摸即让出手动滚动
  const cancel = () => {
    cancelled = true
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
    finish()
  }
  window.addEventListener('wheel', cancel, { passive: true })
  window.addEventListener('touchstart', cancel, { passive: true })

  const start = performance.now()
  const step = (now: number) => {
    if (cancelled) return
    const t = Math.min(1, (now - start) / duration)
    window.scrollTo(0, startY + diff * easeInOutCubic(t))
    if (t < 1) requestAnimationFrame(step)
    else cancel()
  }
  requestAnimationFrame(step)
}

/** 按 hash（如 '#contact'）丝滑滚动到目标元素。 */
export function smoothScrollToHash(hash: string) {
  if (typeof window === 'undefined') return
  const el = document.querySelector<HTMLElement>(hash)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY
  smoothScrollTo(top)
}
