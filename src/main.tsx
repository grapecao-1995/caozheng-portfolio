import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// 「查看更多案例」新开标签页带 ?case= 参数 → 渲染案例大图页（ScrollStack）。
// CasePage 依赖 lenis 等大库，仅在该页面打开时才加载。
const CasePage = lazy(() => import('./components/CasePage'))

const params = new URLSearchParams(window.location.search)
const isCasePage = params.has('case')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isCasePage ? (
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-line/50">
              加载中…
            </div>
          }
        >
          <CasePage title={params.get('title') ?? ''} />
        </Suspense>
      </ErrorBoundary>
    ) : (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )}
  </StrictMode>,
)
