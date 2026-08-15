import {
  ArrowUpRight,
  Fingerprint,
  Globe,
  LayoutTemplate,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { services, type Service } from '../../lib/site'
import { smoothScrollToHash } from '../../lib/scroll'
import BorderGlow from '../BorderGlow'
import FadeIn from '../FadeIn'
import Masonry, { type MasonryItem } from '../Masonry'
import Reveal from '../Reveal'

/** 服务图标映射（icon key → lucide 图标） */
const ICONS: Record<string, LucideIcon> = {
  ecommerce: ShoppingBag,
  ai: Sparkles,
  web: Globe,
  brand: Fingerprint,
  layout: LayoutTemplate,
}

/** BorderGlow 统一参数：浅色卡片 + 高亮辉光 */
const GLOW_PROPS = {
  className: 'h-full w-full',
  backgroundColor: '#F6F7F9',
  borderRadius: 24,
  glowRadius: 18,
  glowIntensity: 1.5,
  edgeSensitivity: 12,
  coneSpread: 45,
  fillOpacity: 0.5,
  colors: ['#B600A8', '#E11D9C', '#7C3AED'],
  style: { '--glow-border': 'rgba(12, 12, 12, 0.14)' },
}

interface ServiceItem extends MasonryItem {
  content: ReactNode
}

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
 * Services：纯白反差区，圆角顶部。
 * 6 张卡片（5 项服务 + 1 张 CTA）使用 @react-bits/Masonry 动效：
 * 滚动到板块时从底部依次弹出（错峰 + 模糊聚焦），简洁利落。
 * 布局始终保持「3 列 × 2 行」，卡片高度随屏宽等比放大（全平台适配）。
 */
export default function Services() {
  const isXl = useMediaQuery('(min-width: 1600px)')
  const isLg = useMediaQuery('(min-width: 1200px)')
  // 卡片高度随屏幕宽度等比放大：340 → 400 → 480
  const cardH = isXl ? 380 : isLg ? 350 : 320

  const scrollToContact = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    smoothScrollToHash('#contact')
  }

  const items = useMemo<ServiceItem[]>(
    () => [
      ...services.map((service) => ({
        id: `service-${service.index}`,
        height: cardH,
        url: '',
        content: <ServiceCard service={service} />,
      })),
      {
        id: 'service-cta',
        height: cardH,
        url: '',
        content: <CtaCard onContact={scrollToContact} />,
      },
    ],
    [cardH],
  )

  return (
    <section
      id="services"
      className="relative rounded-t-[40px] bg-white px-5 pt-14 pb-20 sm:rounded-t-[50px] sm:px-8 sm:pt-16 sm:pb-24 md:rounded-t-[60px] md:px-10 md:pt-20 md:pb-28"
    >
      <div className="shell">
        {/* 头部：左标题 + 右简介 */}
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <FadeIn delay={0} y={30}>
            <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-ink/50">
              <span className="h-px w-10 bg-ink/30" />
              What I Do · 服务内容
            </p>
            <Reveal>
              <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-black uppercase leading-none tracking-tight text-ink">
                Services
              </h2>
            </Reveal>
          </FadeIn>
          <FadeIn delay={0.12} y={20}>
            <p className="max-w-sm text-[clamp(0.95rem,1.3vw,1.05rem)] font-light leading-relaxed text-ink/55">
              从电商主图到品牌整案，五项服务覆盖跨境出海的视觉全链路，以设计驱动转化。
            </p>
          </FadeIn>
        </div>

        {/* 卡片：从底部弹出（Masonry 动效，3 列 × 2 行） */}
        <div className="mx-auto max-w-6xl">
          <Masonry
            items={items}
            columns={[3, 3, 2, 1]}
            gap={18}
            animateFrom="bottom"
            stagger={0.09}
            duration={0.7}
            blurToFocus
            scaleOnHover={false}
            linkable={false}
            renderContent={(item) => (item as ServiceItem).content}
          />
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? Sparkles

  return (
    <BorderGlow {...GLOW_PROPS}>
      <div className="group relative flex h-full w-full flex-col p-6 transition-transform duration-500 hover:-translate-y-1 md:p-7">
        {/* 顶行：图标 + 序号 */}
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-line transition-all duration-500 group-hover:scale-105 group-hover:bg-[linear-gradient(123deg,#B600A8,#7621B0)] group-hover:text-white group-hover:shadow-[0_10px_26px_-10px_rgba(182,0,168,0.55)]">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="text-sm font-black tracking-widest text-ink/20 transition-colors duration-500 group-hover:text-ink/40">
            {service.index}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-wide text-ink md:text-[1.35rem]">
          {service.name}
        </h3>
        <p className="mt-2.5 flex-1 text-sm font-light leading-relaxed text-ink/55">
          {service.desc}
        </p>

        {/* 底部装饰箭头（无跳转，纯动效细节） */}
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-ink/35 transition-colors duration-500 group-hover:text-ink">
          了解更多
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </span>
      </div>
    </BorderGlow>
  )
}

/** CTA 卡（品牌渐变，补满 3×2 网格） */
function CtaCard({ onContact }: { onContact: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <BorderGlow {...GLOW_PROPS} style={{ '--glow-border': 'rgba(182,0,168,0.35)' }}>
      <a
        href="#contact"
        onClick={onContact}
        className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[inherit] p-6 text-white transition-transform duration-500 hover:-translate-y-1 md:p-7"
        style={{
          background:
            'linear-gradient(123deg, #B600A8 7%, #7621B0 47%, #BE4C00 100%)',
        }}
      >
        {/* 装饰光斑 */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125"
        />
        <p className="relative text-xs font-medium uppercase tracking-[0.3em] text-white/70">
          Have a project?
        </p>
        <div className="relative">
          <p className="text-xl font-semibold leading-snug md:text-[1.4rem]">
            聊聊你的下一个项目
          </p>
          <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
            免费咨询 · 通常 24 小时内回复
          </p>
        </div>
        <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium">
          联系我
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </span>
        </span>
      </a>
    </BorderGlow>
  )
}
