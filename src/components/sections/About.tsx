import { motion, useReducedMotion } from 'framer-motion'
import { about } from '../../lib/site'
import AnimatedText from '../AnimatedText'
import ContactButton from '../ContactButton'
import FadeIn from '../FadeIn'
import Reveal from '../Reveal'

/**
 * About（提示词原文）：四角 3D 装饰图（缓慢浮动）+ 渐变标题（遮罩显现）
 * + 逐字滚动段落 + 联系按钮。区块整体垂直居中，min-h-screen。
 */
export default function About() {
  const reduce = useReducedMotion()

  // 四角装饰图：各自不同的浮动节奏，增添生命力
  const corners = [
    {
      src: '/images/about/about-01.webp',
      className: 'absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]',
      delay: 0.1,
      duration: 6,
      float: 12,
    },
    {
      src: '/images/about/about-02.webp',
      className: 'absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]',
      delay: 0.25,
      duration: 7,
      float: 16,
    },
    {
      src: '/images/about/about-03.webp',
      className: 'absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]',
      delay: 0.15,
      duration: 5.5,
      float: 14,
    },
    {
      src: '/images/about/about-04.webp',
      className: 'absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]',
      delay: 0.3,
      duration: 6.5,
      float: 10,
    },
  ]

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 md:px-10 supports-[height:100svh]:min-h-[100svh]"
    >
      {/* 四角 3D 装饰图（提示词原文）：滑入 + 缓慢浮动 */}
      {corners.map((corner) => (
        <FadeIn
          key={corner.src}
          delay={corner.delay}
          duration={0.9}
          x={corner.src.includes('about-03') || corner.src.includes('about-04') ? 80 : -80}
          y={0}
          className={corner.className}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -corner.float, 0] }}
            transition={{ duration: corner.duration, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src={corner.src} alt="" className="w-full opacity-90" />
          </motion.div>
        </FadeIn>
      ))}

      {/* 中心内容：标题 / 段落间距 gap-10 sm:gap-14 md:gap-16 */}
      <div className="relative z-10 flex flex-col items-center gap-10 text-center sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <p className="mb-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em] text-line/50">
            <span className="h-px w-10 bg-line/30" />
            About · 关于我
            <span className="h-px w-10 bg-line/30" />
          </p>
          <Reveal>
            <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-black uppercase leading-none tracking-tight">
              <span className="hero-heading">{about.heading}</span>
            </h2>
          </Reveal>
        </FadeIn>

        <AnimatedText
          text={about.text}
          className="mx-auto max-w-[560px] font-medium leading-relaxed text-line text-[clamp(1rem,2vw,1.35rem)]"
        />

        {/* 段落与按钮间距 gap-16 sm:gap-20 md:gap-24（容器 gap 基础上再补） */}
        <FadeIn delay={0.15} y={20} className="mt-6 sm:mt-6 md:mt-8">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
