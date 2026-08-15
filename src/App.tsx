import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import About from './components/sections/About'
import Services from './components/sections/Services'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'

/**
 * 区块顺序（提示词原文）：Hero → Marquee → About → Services → Projects
 * → Contact（整屏收尾：联系方式 + 微信二维码 + 微型版权）。
 */
export default function App() {
  return (
    <main style={{ overflowX: 'clip' }} className="relative bg-ink text-line">
      <ScrollProgress />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Projects />
      <Contact />
    </main>
  )
}

/** 顶部阅读进度条：品牌渐变细线，随滚动增长 */
function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const spring = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  const scaleX = reduce ? scrollYProgress : spring

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-[#B600A8] via-[#7621B0] to-[#0EA5E9]"
      style={{ scaleX }}
    />
  )
}
