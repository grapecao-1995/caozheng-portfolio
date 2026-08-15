import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { marqueeImages } from '../../lib/site'

const row1 = [...marqueeImages.slice(0, 11)]
const row2 = [...marqueeImages.slice(11)]

// 双倍复制即可满足视口 + 平移范围的无缝覆盖；三倍复制会多出一倍视频解码压力
const double = (arr: string[]) => [...arr, ...arr]

/**
 * 跑马灯：两行作品缩略图，随页面滚动相反方向横向移动。
 * 性能优化：视频「靠近视口才挂载播放」（懒加载），远离视口的格子弹占位图，
 * 大幅降低多视频同时解码的负担，滚动更丝滑。
 */
export default function Marquee() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // 行 1 随滚动向右移动，行 2 向左移动
  const x1 = useTransform(scrollYProgress, [0, 1], [-200, 260])
  const x2 = useTransform(scrollYProgress, [0, 1], [200, -260])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink pt-24 pb-10 sm:pt-32 md:pt-40"
    >
      <motion.div
        className="flex gap-4"
        style={{ x: x1, willChange: 'transform' }}
      >
        {double(row1).map((src, i) => (
          <MarqueeTile key={`r1-${i}`} src={src} />
        ))}
      </motion.div>

      <motion.div
        className="mt-10 flex gap-4 sm:mt-12 md:mt-16"
        style={{ x: x2, willChange: 'transform' }}
      >
        {double(row2).map((src, i) => (
          <MarqueeTile key={`r2-${i}`} src={src} />
        ))}
      </motion.div>
    </section>
  )
}

function MarqueeTile({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  // 进入视口附近（提前 600px 预载）才挂载视频并播放
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          obs.disconnect()
        }
      },
      { rootMargin: '600px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="shrink-0 overflow-hidden rounded-2xl bg-ink-800 transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]"
    >
      {near ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          draggable={false}
          aria-hidden="true"
          className="h-[200px] w-[300px] object-cover transition-transform duration-500 ease-out hover:scale-[1.05] sm:h-[240px] sm:w-[360px] lg:h-[270px] lg:w-[420px]"
        />
      ) : (
        /* 占位图：等宽高的深色底 + 轻微呼吸，避免空档 */
        <div className="h-[200px] w-[300px] animate-pulse bg-ink-700/60 sm:h-[240px] sm:w-[360px] lg:h-[270px] lg:w-[420px]" />
      )}
    </div>
  )
}
