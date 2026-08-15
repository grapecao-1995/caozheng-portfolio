import { useState } from 'react'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import './CasePage.css'

/**
 * 案例大图页（「查看更多案例」点击后新开标签页）：
 * 使用 @react-bits/ScrollStack 滚动堆叠动效 ——
 * 滚过 3 张合作邀请文字卡后，最后钉住展示白底微信二维码。
 */
export default function CasePage({ title }: { title: string }) {
  const [done, setDone] = useState(false)

  return (
    <main className="case-page">
      {/* 背景氛围 */}
      <div aria-hidden className="case-glow case-glow--a" />
      <div aria-hidden className="case-glow case-glow--b" />

      {/* 顶栏 */}
      <header className="case-bar">
        <span className="case-brand">CAO ZHENG · {title}</span>
        <a className="case-back" href="/">
          ← 返回首页
        </a>
      </header>

      {/* 滚动堆叠：邀请文字 → 白底二维码 */}
      <ScrollStack
        className="case-stack"
        useWindowScroll
        itemDistance={90}
        itemScale={0.04}
        itemStackDistance={24}
        rotationAmount={1.1}
        blurAmount={2.5}
        onStackComplete={() => setDone(true)}
      >
        <ScrollStackItem itemClassName="case-card">
          <p className="case-kicker">Thanks for your interest</p>
          <p className="case-title">既然对我那么感兴趣，</p>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="case-card">
          <p className="case-kicker">Let&apos;s work together</p>
          <p className="case-title">
            那老板<strong>快快加我</strong>
          </p>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="case-card">
          <p className="case-kicker">Let&apos;s cooperate</p>
          <p className="case-title">
            和我<strong>合作</strong>吧！
          </p>
        </ScrollStackItem>

        {/* 最后：白底微信二维码 */}
        <ScrollStackItem itemClassName="scroll-stack-card--qr">
          <div className="case-qr-box">
            <img src="/images/微信二维码.png" alt="微信二维码（曹政）" draggable={false} />
          </div>
          <p className="case-qr-text">微信扫码 · 添加好友，合作即刻开始</p>
        </ScrollStackItem>
      </ScrollStack>

      {done && <p className="case-done">期待与你合作 🤝</p>}
    </main>
  )
}
