import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { projects, thumbOf, type Project } from '../../lib/site'
import BorderGlow from '../BorderGlow'
import ContactButton from '../ContactButton'
import FadeIn from '../FadeIn'
import Reveal from '../Reveal'

const ease = [0.25, 0.1, 0.25, 1] as const

/* ------------------------------------------------------------------ */
/* 画廊排版配置（图片保持原始宽高比，零裁切）                            */
/* 每一行 = 等高对齐：行高由 行内宽高比之和 决定，行内图片按自身比例分宽， */
/* 左右边缘严格对齐，行与行高度接近，整体像精心编排的展览墙。             */
/* i = project.images 下标，a = 图片宽高比（w/h）。                      */
/* ------------------------------------------------------------------ */
interface TileCfg {
  i: number
  a: number
}
interface RowCfg {
  tiles: TileCfg[]
}
interface Comp {
  x2xl: RowCfg[]
  xl: RowCfg[]
  md: RowCfg[]
  base: RowCfg[]
}

/** 均匀比例图：按每行数量自动切分 */
function rowsOf(n: number, per: number, a: number): RowCfg[] {
  const rows: RowCfg[] = []
  for (let start = 0; start < n; start += per) {
    const count = Math.min(per, n - start)
    rows.push({ tiles: Array.from({ length: count }, (_, k) => ({ i: start + k, a })) })
  }
  return rows
}

/** 快捷构造一行：tiles = [图片下标, 宽高比] */
const r = (tiles: [number, number][]): RowCfg => ({
  tiles: tiles.map(([i, a]) => ({ i, a })),
})

/**
 * 项目 1（25 张：15 张 1:1 方形 + 4 张 2.44 横幅 + 3 张 1.62 横版 + 3 张 1:1 方形）
 * 0-14:1.0  15-18:2.44  19-21:1.62  22-24:1.0
 */
const P1: Comp = {
  x2xl: [
    r([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]]),
    r([[6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1]]),
    r([[12, 1], [13, 1], [14, 1], [22, 1], [23, 1], [24, 1]]),
    r([[15, 2.44], [16, 2.44]]),
    r([[17, 2.44], [18, 2.44]]),
    r([[19, 1.62], [20, 1.62], [21, 1.62]]),
  ],
  xl: [
    r([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]]),
    r([[5, 1], [6, 1], [7, 1], [8, 1], [9, 1]]),
    r([[10, 1], [11, 1], [12, 1], [13, 1], [14, 1]]),
    r([[15, 2.44], [22, 1], [23, 1]]),
    r([[16, 2.44], [24, 1], [19, 1.62]]),
    r([[17, 2.44], [20, 1.62]]),
    r([[18, 2.44], [21, 1.62]]),
  ],
  md: [
    r([[0, 1], [1, 1], [2, 1]]),
    r([[3, 1], [4, 1], [5, 1]]),
    r([[6, 1], [7, 1], [8, 1]]),
    r([[9, 1], [10, 1], [11, 1]]),
    r([[12, 1], [13, 1], [14, 1]]),
    r([[15, 2.44], [22, 1]]),
    r([[16, 2.44], [23, 1]]),
    r([[17, 2.44], [24, 1]]),
    r([[18, 2.44], [19, 1.62]]),
    r([[20, 1.62], [21, 1.62]]),
  ],
  base: [
    r([[0, 1], [1, 1]]),
    r([[2, 1], [3, 1]]),
    r([[4, 1], [5, 1]]),
    r([[6, 1], [7, 1]]),
    r([[8, 1], [9, 1]]),
    r([[10, 1], [11, 1]]),
    r([[12, 1], [13, 1]]),
    r([[14, 1], [22, 1]]),
    r([[15, 2.44], [23, 1]]),
    r([[16, 2.44], [24, 1]]),
    r([[17, 2.44], [19, 1.62]]),
    r([[18, 2.44], [20, 1.62]]),
    r([[21, 1.62]]),
  ],
}

/**
 * 项目 2（18 张混合比例）：按「横幅 / A4 横版 / 竖版」分层编排。
 * 0:1.0  1:0.75  2:2.4  3:1.0  4:1.33  5:0.75
 * 6:0.75  7:2.4  8:0.75  9:0.75  10:0.81
 * 11:1.42  12:1.42  13:1.42  14:1.47  15:1.47  16:1.41  17:0.71(竖)
 */
const P2: Comp = {
  x2xl: [
    r([[2, 2.4], [7, 2.4]]),
    r([[11, 1.42], [12, 1.42], [13, 1.42]]),
    r([[14, 1.47], [15, 1.47], [16, 1.41]]),
    r([[0, 1], [4, 1.33], [3, 1], [10, 0.81]]),
    r([[1, 0.75], [5, 0.75], [6, 0.75], [8, 0.75], [9, 0.75], [17, 0.71]]),
  ],
  xl: [
    { tiles: [{ i: 2, a: 2.4 }, { i: 7, a: 2.4 }] },
    { tiles: [{ i: 11, a: 1.42 }, { i: 12, a: 1.42 }, { i: 13, a: 1.42 }] },
    { tiles: [{ i: 14, a: 1.47 }, { i: 15, a: 1.47 }, { i: 16, a: 1.41 }] },
    { tiles: [{ i: 0, a: 1 }, { i: 4, a: 1.33 }, { i: 3, a: 1 }, { i: 10, a: 0.81 }] },
    { tiles: [{ i: 1, a: 0.75 }, { i: 5, a: 0.75 }, { i: 6, a: 0.75 }, { i: 8, a: 0.75 }, { i: 9, a: 0.75 }, { i: 17, a: 0.71 }] },
  ],
  md: [
    { tiles: [{ i: 2, a: 2.4 }, { i: 7, a: 2.4 }] },
    { tiles: [{ i: 11, a: 1.42 }, { i: 12, a: 1.42 }, { i: 13, a: 1.42 }] },
    { tiles: [{ i: 14, a: 1.47 }, { i: 15, a: 1.47 }, { i: 16, a: 1.41 }] },
    { tiles: [{ i: 0, a: 1 }, { i: 4, a: 1.33 }, { i: 3, a: 1 }] },
    { tiles: [{ i: 10, a: 0.81 }, { i: 1, a: 0.75 }, { i: 17, a: 0.71 }] },
    { tiles: [{ i: 5, a: 0.75 }, { i: 6, a: 0.75 }, { i: 8, a: 0.75 }, { i: 9, a: 0.75 }] },
  ],
  base: [
    { tiles: [{ i: 2, a: 2.4 }] },
    { tiles: [{ i: 7, a: 2.4 }] },
    { tiles: [{ i: 11, a: 1.42 }, { i: 12, a: 1.42 }] },
    { tiles: [{ i: 13, a: 1.42 }, { i: 14, a: 1.47 }] },
    { tiles: [{ i: 15, a: 1.47 }, { i: 16, a: 1.41 }] },
    { tiles: [{ i: 0, a: 1 }, { i: 4, a: 1.33 }] },
    { tiles: [{ i: 3, a: 1 }, { i: 10, a: 0.81 }] },
    { tiles: [{ i: 1, a: 0.75 }, { i: 17, a: 0.71 }] },
    { tiles: [{ i: 5, a: 0.75 }, { i: 6, a: 0.75 }] },
    { tiles: [{ i: 8, a: 0.75 }, { i: 9, a: 0.75 }] },
  ],
}

/** 项目 3（28 张 16:9 横图） */
const P3: Comp = {
  x2xl: rowsOf(28, 6, 1.8),
  xl: rowsOf(28, 4, 1.8),
  md: rowsOf(28, 3, 1.8),
  base: rowsOf(28, 2, 1.8),
}

const COMPS: Record<string, Comp> = { '01': P1, '02': P2, '03': P3 }

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

/**
 * Projects（精选项目）：
 * 无弹层、无二级菜单 —— 3 个项目全部平铺展开。
 * 每个项目 = 等高对齐画廊：图片原始比例零裁切、行内等高、左右严格对齐，
 * 行组合经过精心编排（横幅 / 横版 / 竖版分层），整齐而有设计感。
 * 图片逐张错峰入场，悬停放大 + 编号浮现，点击任意图片全屏预览。
 */
export default function Projects() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 w-full overflow-x-clip rounded-t-[40px] bg-ink px-5 pt-20 pb-16 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-20 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28 md:pb-24"
    >
      {/* 背景光晕（氛围） */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow left-[-6%] top-[4%] h-[380px] w-[380px] bg-[#B600A8]/12" />
        <div className="glow right-[-8%] bottom-[10%] h-[360px] w-[360px] bg-[#4A5BFF]/10" />
      </div>

      <div className="shell relative">
        {/* 头部：标题 */}
        <div className="mb-10 md:mb-16">
          <FadeIn delay={0} y={30}>
            <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-line/50">
              <span className="h-px w-10 bg-line/30" />
              Selected Works · 精选项目
            </p>
            <Reveal>
              <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-black uppercase leading-none tracking-tight">
                <span className="hero-heading">Project</span>
              </h2>
            </Reveal>
          </FadeIn>
        </div>

        {/* 项目块：全部平铺展开 */}
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24">
          {projects.map((project) => (
            <ProjectBlock
              key={project.index}
              project={project}
              onImageClick={(imgIndex) =>
                setLightbox({ images: project.images, index: imgIndex })
              }
            />
          ))}
        </div>

        {/* 底部 CTA：暗示还有更多案例 */}
        <FadeIn delay={0.1} y={24}>
          <div className="mt-16 flex flex-col items-center gap-6 border-t border-line/10 pt-12 text-center md:mt-24">
            <p className="max-w-md text-[clamp(0.95rem,1.3vw,1.05rem)] font-light leading-relaxed text-line/50">
              还有更多跨境视觉案例未一一展出 —— 欢迎联系索取完整作品集
            </p>
            <ContactButton />
          </div>
        </FadeIn>
      </div>

      {/* 图片大图预览（portal 到 body） */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            images={lightbox.images}
            initialIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

/** 单个项目块：头部信息行 + 等高对齐画廊 */
function ProjectBlock({
  project,
  onImageClick,
}: {
  project: Project
  onImageClick: (imgIndex: number) => void
}) {
  const reduce = useReducedMotion()
  const is2xl = useMediaQuery('(min-width: 1800px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const comp = COMPS[project.index]
  const rows = is2xl ? comp.x2xl : isXl ? comp.xl : isMd ? comp.md : comp.base

  return (
    <div>
      {/* 头部：序号 / 名称 / 查看更多案例 */}
      <FadeIn y={24}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex min-w-0 items-center gap-4 md:gap-6">
            <span className="hero-heading text-[clamp(2rem,5vw,64px)] font-black leading-none">
              {project.index}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-line/50">
                {project.category} · {project.tag}
              </p>
              <h3 className="mt-1 truncate text-xl font-semibold uppercase tracking-wide text-line md:text-3xl">
                {project.name}
              </h3>
            </div>
          </div>
          <a
            href={`/?case=${encodeURIComponent(project.index)}&title=${encodeURIComponent(project.name)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="group/case inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line/20 bg-ink-700/50 px-4 py-2 text-xs font-medium uppercase tracking-widest text-line/70 backdrop-blur transition-all duration-300 hover:border-[#B600A8]/60 hover:text-line hover:shadow-[0_0_24px_rgba(182,0,168,0.35)]"
          >
            查看更多案例
            <span className="case-more-icon flex h-7 w-7 items-center justify-center rounded-full text-line">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/case:-translate-y-0.5 group-hover/case:translate-x-0.5" />
            </span>
          </a>
        </div>
        <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-line/45 md:text-base">
          {project.blurb}
        </p>
        {/* 分隔线：进入视口时从左向右拉出 */}
        <motion.div
          aria-hidden
          className="mt-5 h-px origin-left bg-gradient-to-r from-line/25 via-line/10 to-transparent md:mt-6"
          initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </FadeIn>

      {/* 等高对齐画廊：行内等高、左右对齐、原始比例零裁切 */}
      <div className="mx-auto mt-7 flex w-full max-w-[1680px] flex-col gap-4 md:mt-9 md:gap-5">
        {rows.map((row, r) => {
          const sum = row.tiles.reduce((s, t) => s + t.a, 0)
          return (
            <div
              key={r}
              className="flex gap-4 md:gap-5"
              style={{ aspectRatio: `${sum} / 1` }}
            >
              {row.tiles.map((tile, k) => (
                <GalleryTile
                  key={tile.i}
                  src={thumbOf(project.images[tile.i])}
                  alt={`${project.name} ${tile.i + 1}`}
                  ratio={tile.a}
                  label={String(tile.i + 1).padStart(2, '0')}
                  delay={(Math.min(tile.i, 8) + k * 0.5) * 0.05}
                  onClick={() => onImageClick(tile.i)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 画廊单图：flex 按宽高比分宽，宽高比严格等于图片原始比例（零裁切）。
 *  BorderGlow 提供鼠标跟随的辉光边框，图片悬停放大保留。 */
function GalleryTile({
  src,
  alt,
  ratio,
  label,
  delay,
  onClick,
}: {
  src: string
  alt: string
  ratio: number
  label: string
  delay: number
  onClick: () => void
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="group relative min-w-0"
      style={{ flex: `${ratio} 1 0`, aspectRatio: `${ratio} / 1` }}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '40px' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      <BorderGlow
        className="h-full w-full"
        backgroundColor="#101014"
        borderRadius={16}
        glowRadius={14}
        glowIntensity={1.2}
        edgeSensitivity={25}
        coneSpread={30}
        fillOpacity={0.35}
        colors={['#B600A8', '#7621B0', '#0EA5E9']}
      >
        <button
          type="button"
          onClick={onClick}
          className="group relative block h-full w-full cursor-zoom-in text-left focus-visible:outline-none"
        >
          {/* 行高 = 行宽 / 行内宽高比之和，图块宽高比与原始图片一致 → 不裁切不变形 */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/85 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100"
          >
            <Expand className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 left-3 translate-y-1.5 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium tracking-widest text-white/90 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {label}
          </span>
        </button>
      </BorderGlow>
    </motion.div>
  )
}

/**
 * 图片全屏预览（lightbox）：click 遮罩/X/ESC 关闭，左右箭头或方向键切换，
 * 完整 object-contain 展示原图（不裁切）。
 */
function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[]
  initialIndex: number
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(initialIndex)
  const total = images.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % total)
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, total])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const prev = () => setIndex((i) => (i - 1 + total) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.img
        key={images[index]}
        src={images[index]}
        alt="放大预览"
        draggable={false}
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 backdrop-blur transition-colors hover:bg-white/15"
      >
        <X className="h-5 w-5" />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="上一张"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 backdrop-blur transition-colors hover:bg-white/15"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="下一张"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 backdrop-blur transition-colors hover:bg-white/15"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <span className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80">
        {index + 1} / {total}
      </span>
    </motion.div>,
    document.body,
  )
}
