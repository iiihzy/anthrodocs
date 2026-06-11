'use client'

import { useRef, useEffect } from 'react'
import type { Endpoint } from '../types'
import EndpointCard from './EndpointCard'

interface Props {
  doc: { title: string; version: string; baseUrl: string; endpoints: Endpoint[] }
  onScroll?: (scrollTop: number) => void
  onEndpointClick?: (idx: number) => void
}

export default function DocPreview({ doc, onScroll, onEndpointClick }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !onScroll) return
    const handler = () => onScroll(el.scrollTop)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [onScroll])

  const handleClick = (e: React.MouseEvent) => {
    if (!onEndpointClick) return
    const target = (e.target as HTMLElement).closest('[data-endpoint-id]') as HTMLElement | null
    if (target) {
      const idx = parseInt(target.dataset.endpointId || '', 10)
      if (!isNaN(idx)) onEndpointClick(idx)
    }
  }

  return (
    <div ref={ref} className="flex-1 min-h-0 min-w-0 overflow-y-auto pl-6 py-4 scroll-area" onClick={handleClick}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          {doc.title}
          <span className="text-xs font-medium text-black/50 bg-black/5 px-2 py-0.5 rounded-full">
            v{doc.version}
          </span>
        </h2>
        <p className="text-sm text-black/50 mt-1">
          <code className="bg-black/5 px-2 py-0.5 rounded text-purple-600 font-mono text-xs">{doc.baseUrl}</code>
        </p>
      </div>

      {doc.endpoints.map((ep, i) => (
        <EndpointCard key={i} endpoint={ep} />
      ))}
    </div>
  )
}