import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * 全局错误边界：渲染出错时不再白屏/黑屏，而是显示错误信息。
 * 同时监听 window error / unhandledrejection，异步错误也能浮出提示，便于定位。
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  componentDidMount() {
    window.addEventListener('error', this.handleWindowError)
    window.addEventListener('unhandledrejection', this.handleRejection)
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError)
    window.removeEventListener('unhandledrejection', this.handleRejection)
  }

  private handleWindowError = (e: ErrorEvent) => {
    console.error('[window error]', e.error ?? e.message)
    if (e.error instanceof Error) this.setState({ error: e.error })
  }

  private handleRejection = (e: PromiseRejectionEvent) => {
    console.error('[unhandled rejection]', e.reason)
    if (e.reason instanceof Error) this.setState({ error: e.reason })
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            background: '#0C0C0C',
            color: '#D7E2EA',
            fontFamily: 'system-ui, sans-serif',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>页面渲染出错了</h1>
          <p style={{ fontSize: 14, color: '#f87171', maxWidth: 640, wordBreak: 'break-all' }}>
            {this.state.error.message}
          </p>
          <pre
            style={{
              fontSize: 12,
              color: '#9ca3af',
              maxWidth: 720,
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              background: '#16161b',
              padding: 16,
              borderRadius: 12,
            }}
          >
            {this.state.error.stack}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 28px',
              borderRadius: 999,
              border: '1px solid rgba(215,226,234,0.3)',
              background: 'transparent',
              color: '#D7E2EA',
              cursor: 'pointer',
            }}
          >
            重新加载
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
