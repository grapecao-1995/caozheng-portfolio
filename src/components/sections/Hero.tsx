import { motion, useReducedMotion } from 'framer-motion'
import { hero } from '../../lib/site'
import ContactButton from '../ContactButton'
import Magnet from '../Magnet'
import Navbar from '../Navbar'

const ease = [0.25, 0.1, 0.25, 1] as const

/**
 * 首屏 Hero（提示词原文）：顶部静止导航 → 巨型渐变标题（逐行遮罩上推显现）
 * → 磁吸肖像（带缓慢浮动）→ 底部左侧描述 + 右侧 Contact Me。
 */
export default function Hero() {
  const reduce = useReducedMotion()
  const lines = hero.heading.split('\n')

  return (
    <section className="relative flex min-h-screen flex-col overflow-visible supports-[height:100svh]:min-h-[100svh]">
      <Navbar />

      {/* 巨型渐变标题：两行各自从遮罩中上推显现，错峰进入。
          标题先完整浮现并短暂停顿（约 1.2s），头像随后才出现 ——
          既让客户看清 "HI, I'M CAO ZHENG"，也为真实上线时预加载头像留出时间 */}
      <motion.h1
        className="mt-6 w-full text-center font-black uppercase leading-[0.98] tracking-tight sm:mt-4 md:-mt-5 text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
        initial="hidden"
        animate="show"
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden">
            <motion.span
              className="hero-heading block"
              variants={{
                hidden: { y: reduce ? 0 : '115%' },
                show: { y: 0 },
              }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.9, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      {/* 磁吸肖像：容器完全透明（无 bg/border/shadow），z-40 保证滚到下一个板块时肖像浮在顶层；
          Hero overflow-visible 保证磁吸下移/越界时不被裁切。
          出场时序：标题浮现后（约 1.1s）立刻淡入 + 轻微放大进入，
          之后进入 6s 缓慢浮动，与磁吸位移互不干扰 */}
      <div className="absolute left-1/2 top-1/2 z-40 w-[340px] -translate-x-1/2 -translate-y-1/2 bg-transparent sm:top-auto sm:bottom-0 sm:translate-y-0 sm:w-[420px] md:w-[540px] lg:w-[660px]">
        <Magnet padding={150} strength={3}>
          <motion.img
            src={hero.portrait}
            alt={hero.heading}
            draggable={false}
            className="aspect-square w-full select-none rounded-[28px] bg-transparent object-cover outline-none sm:rounded-[36px] md:rounded-[44px]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.96 }}
            animate={
              reduce
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 1, y: [0, -14, 0], scale: 1 }
            }
            transition={
              reduce
                ? { opacity: { duration: 0.6, ease } }
                : {
                    opacity: { delay: 1.1, duration: 0.8, ease },
                    scale: { delay: 1.1, duration: 0.8, ease },
                    y: { delay: 1.8, duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
          />
        </Magnet>
      </div>

      {/* 底部栏：左侧描述 + 右侧 CTA（在标题浮现后错峰出现） */}
      <div className="shell relative z-50 mt-auto flex items-end justify-between gap-6 pb-7 sm:pb-8 md:pb-10">
        <motion.p
          className="max-w-[300px] font-light leading-snug text-line sm:max-w-[340px]"
          style={{ fontSize: 'clamp(0.9rem, 1.35vw, 1.5rem)' }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease }}
        >
          {hero.tagline}
        </motion.p>
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7, ease }}
        >
          <ContactButton />
        </motion.div>
      </div>
    </section>
  )
}
