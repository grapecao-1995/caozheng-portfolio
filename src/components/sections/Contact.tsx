import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, Check, Copy, Mail, MessageCircle, Phone } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { footer, profile, projects, thumbOf } from '../../lib/site'
import { useCopy } from '../../lib/useCopy'
import DriftWall, { type DriftWallItem } from '../DriftWall'
import FadeIn from '../FadeIn'
import Reveal from '../Reveal'

// 3D 挂绳卡片依赖 three.js / rapier 等大库，按需加载：
// 懒加载 + 视口接近时才真正挂载，避免拖慢首屏。
const Lanyard = lazy(() => import('../Lanyard'))
import type { LanyardProps } from '../Lanyard'

const ease = [0.25, 0.1, 0.25, 1] as const

/** 作品墙素材：全部作品图缩略图（随 site.ts 项目数据自动同步） */
const WALL_ITEMS: DriftWallItem[] = projects.flatMap((p) =>
  p.images.map((image, i) => ({ image: thumbOf(image), title: `${p.name} ${i + 1}` })),
)

/** 断点监听（客户端渲染，无 SSR） */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** 元素宽度测量（ResizeObserver，用于自适应照片墙列数） */
function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, width] as const
}

/**
 * Contact（收尾区，左右排版 + 紫色点缀版）：
 * - 左列：眉标 + 标题（紫色渐变）+ 简介 + 三个联系方式（紫色悬停）+ 作品漂移墙。
 * - 右列：3D 挂绳 ID 卡（正面 = 微信二维码）。桌面端画布覆盖右侧约 68%、
 *   位于最上层 —— 卡片在右侧居中停放，摆动/轻晃时盖过左侧内容。
 * - 底部细条版权栏。
 */
export default function Contact() {
  const reduce = useReducedMotion()
  const phoneCopy = useCopy(1800)
  const wechatCopy = useCopy(1800)
  const emailCopy = useCopy(1800)
  const isLg = useMediaQuery('(min-width: 1024px)')

  // 3D 挂绳卡片按需挂载：视口接近（提前 700px）才加载 three.js 并渲染，
  // 用户滚到这里时卡片已经就绪。
  const sectionRef = useRef<HTMLElement>(null)
  const [showLanyard, setShowLanyard] = useState(false)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || showLanyard) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowLanyard(true)
          io.disconnect()
        }
      },
      { rootMargin: '700px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [showLanyard])

  // 照片墙：桌面 4 列（图片按容器宽度自适应尺寸，显得图片更多）；
  // 移动端 2 列
  const [wallRef, wallWidth] = useElementWidth<HTMLDivElement>()
  const wallCols = isLg ? 4 : 2
  const wallTileW = isLg
    ? Math.max(150, Math.floor((wallWidth - (wallCols - 1) * 16) / wallCols))
    : 170
  const wallTileH = Math.round(wallTileW * 0.75)

  const toast = phoneCopy.copied
    ? '手机号已复制到剪贴板！'
    : wechatCopy.copied
      ? '微信号已复制到剪贴板！'
      : emailCopy.copied
        ? '邮箱已复制到剪贴板！'
        : null

  const contacts = [
    {
      key: 'phone',
      label: '电话 / Phone',
      value: profile.phone,
      Icon: Phone,
      copied: phoneCopy.copied,
      copy: () => phoneCopy.copy(profile.phone),
    },
    {
      key: 'wechat',
      label: '微信号 / WeChat ID',
      value: profile.wechat,
      Icon: MessageCircle,
      copied: wechatCopy.copied,
      copy: () => wechatCopy.copy(profile.wechat),
    },
    {
      key: 'email',
      label: '邮箱 / Email',
      value: profile.email,
      Icon: Mail,
      copied: emailCopy.copied,
      copy: () => emailCopy.copy(profile.email),
    },
  ]

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })

  const lanyardProps = useMemo<LanyardProps>(
    () => ({
      // 正面：自定义卡片图（1600×2240，5:7）；背面：新名片背图（同规格）。
      // imageFit=cover：图片完全铺满卡片（无白边），比例相符时仅裁极小边缘。
      frontImage: '/images/contact/card-front.webp',
      backImage: '/images/contact/card-back-121121.webp',
      imageFit: 'cover',
      position: [0, 0, 13.5],
      fov: 20,
      gravity: [0, -40, 0],
      transparent: true,
      lanyardWidth: 1.2,
      // 挂绳纹理：替换默认 UI 图标为猫爪图案
      lanyardImage: '/images/contact/lanyard-paw.svg',
      // 锚点：卡片静止时在右侧部分居中偏左一点（约 73% 处）
      anchorX: 2.1,
      // 挂绳长度 1.6：绳带能正常展开（过短会让丝带挤成一团、模糊变形）
      ropeLength: 1.6,
      swingOnView: true,
      swingStrength: 12,
      idleSway: true,
      idleSwaySpeed: 2,
      idleSwayStrength: 1.2,
    }),
    [],
  )

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 overflow-x-clip bg-ink px-5 pt-10 sm:px-8 sm:pt-12 md:px-10 md:pt-14"
    >
      {/* 背景：细网格 + 紫/蓝光晕（氛围，紫色为主） */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <motion.div
          className="glow left-[-6%] top-[16%] h-[460px] w-[460px] bg-[#B600A8]/22"
          animate={reduce ? undefined : { x: [0, 36, 0], y: [0, -24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="glow left-[30%] bottom-[8%] h-[360px] w-[360px] bg-[#7C3AED]/18"
          animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 18, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="glow right-[-8%] top-[30%] h-[380px] w-[380px] bg-[#4A5BFF]/14"
          animate={reduce ? undefined : { x: [0, -32, 0], y: [0, 20, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="shell relative">
        {/* 左右分栏：左个人信息 + 作品墙 / 右挂绳（顶层覆盖） */}
        <div className="relative grid gap-10 lg:grid-cols-[6fr_5fr] lg:gap-14">
          {/* ── 左列：个人信息 + DriftWall ── */}
          <div className="relative flex flex-col justify-start space-y-2">
            <FadeIn delay={0} y={30}>
              <p className="mb-2 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-line/50">
                <span className="h-px w-10 bg-[#B600A8]/70" />
                Contact · 联系我
              </p>
              <Reveal delay={0.05}>
                <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-black uppercase leading-[0.95] tracking-tight">
                  <span className="hero-heading">Let&apos;s Work</span>
                  <br />
                  <span className="text-gradient-purple">Together</span>
                </h2>
              </Reveal>
            </FadeIn>

            <FadeIn delay={0.12} y={20}>
              <p className="max-w-md text-[clamp(0.95rem,1.3vw,1.05rem)] font-light leading-relaxed text-line/55">
                微信扫码即可添加好友 —— 或通过下方联系方式直接联系，通常 24
                小时内回复。
              </p>
            </FadeIn>

            {/* 联系方式：纵向三行，点击复制（紫色悬停）。
                层级在挂绳画布之上（z-30），保证可悬停、可点击。 */}
            <div className="relative z-30 flex flex-col gap-2.5">
              {contacts.map((c, i) => (
                <FadeIn key={c.key} delay={0.08 * i} y={16}>
                  <motion.button
                    type="button"
                    onClick={c.copy}
                    whileHover={reduce ? undefined : { y: -3 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="group flex w-full items-center gap-3.5 rounded-2xl border border-line/15 bg-ink-700/70 px-4 py-3 text-left backdrop-blur-md transition-colors duration-300 hover:border-[#B600A8]/45 hover:bg-ink-700"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line/15 bg-line/5 text-line transition-colors duration-300 group-hover:border-[#B600A8]/45 group-hover:text-[#e9d5ff]">
                      <c.Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-line/40">
                        {c.label}
                      </p>
                      <p className="font-latin mt-0.5 truncate text-sm font-medium text-line md:text-base">
                        {c.value}
                      </p>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line/15 text-line/60 transition-colors duration-300 group-hover:border-[#B600A8]/45 group-hover:text-[#e9d5ff]">
                      {c.copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.4} />
                      ) : (
                        <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                      )}
                    </span>
                  </motion.button>
                </FadeIn>
              ))}
            </div>

            {/* 作品漂移墙（DriftWall，无框、明亮、紫色氛围） */}
            <FadeIn delay={0.2} y={24} className="mt-3 lg:mt-4 lg:flex-1">
              <div
                ref={wallRef}
                className="relative h-[340px] w-full overflow-hidden sm:h-[430px] lg:h-full lg:min-h-[480px]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-[8%] top-[6%] h-[260px] w-[260px] rounded-full bg-[#7C3AED]/20 blur-[90px]"
                />
                <DriftWall
                  items={WALL_ITEMS}
                  columns={wallCols}
                  tileWidth={wallTileW}
                  tileHeight={wallTileH}
                  gap={16}
                  radius={16}
                  tilt={6}
                  turn={-8}
                  perspective={1200}
                  depth={100}
                  speed={34}
                  direction="up"
                  variance={0.4}
                  parallax={0.4}
                  lift={56}
                  fade={0.12}
                  dim={1}
                  overlayColor="#0A0312"
                />
              </div>
            </FadeIn>
          </div>

          {/* ── 右列：占位（桌面端挂绳覆盖其上） ── */}
          <div aria-hidden className="hidden lg:block" />

          {/* ── 挂绳：桌面 = 覆盖右半列、居中、最上层；移动 = 内容下方块级 ──
              画布接收指针事件（卡片可拖拽）；信息条 z-30 在画布 z-20 之上，仍可点击 */}
          {isLg ? (
            <div className="absolute inset-0 z-20">
              {showLanyard ? (
                <Suspense fallback={null}>
                  <Lanyard {...lanyardProps} />
                </Suspense>
              ) : null}
            </div>
          ) : (
            <div className="relative h-[520px]">
              {showLanyard ? (
                <Suspense fallback={null}>
                  <Lanyard {...lanyardProps} />
                </Suspense>
              ) : null}
            </div>
          )}
        </div>

        {/* 底部：微型版权栏 */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line/10 pt-6 pb-8 text-[11px] uppercase tracking-wider text-line/30 sm:flex-row">
          <span>{footer.copyright}</span>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-line/60"
          >
            回到顶部
            <ArrowUp className="h-3 w-3" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* 复制成功 Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded-full border border-line/20 bg-ink-800/95 px-5 py-3 text-sm text-line shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <Check className="h-4 w-4 text-emerald-400" strokeWidth={2.4} />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
