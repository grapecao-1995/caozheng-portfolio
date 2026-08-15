import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 将文本复制到剪贴板，并短暂显示“已复制”状态。
 * - 安全上下文（https / localhost）下优先用 navigator.clipboard；
 * - 非安全上下文（如局域网 http://192.168.x.x）下回退到
 *   隐藏 textarea + document.execCommand('copy')（旧 API，http 下仍可用）。
 */
async function copyText(text: string): Promise<boolean> {
  // 1) 现代 Clipboard API（仅安全上下文可用）
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // 继续走回退
    }
  }
  // 2) 回退：隐藏 textarea + execCommand
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-9999px'
    ta.style.left = '-9999px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function useCopy(duration = 1600) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>()

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text)
      if (ok) {
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), duration)
      }
      return ok
    },
    [duration],
  )

  useEffect(() => {
    return () => window.clearTimeout(timer.current)
  }, [])

  return { copied, copy }
}
