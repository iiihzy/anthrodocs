'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Endpoint } from '../types'

interface Props {
  endpoints: Endpoint[]
  scrollTop?: number
  onEndpointClick?: (idx: number) => void
  onActiveChange?: (idx: number) => void
}

export default function SidebarNav({ endpoints, scrollTop = 0, onEndpointClick, onActiveChange }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)

  const scrollTo = useCallback((idx: number) => {
    const cards = document.querySelectorAll('[data-endpoint-id]')
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    const cards = document.querySelectorAll('[data-endpoint-id]')
    let current = 0
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect()
      if (rect.top < 200) current = i
    }
    setActiveIdx(current)
  }, [scrollTop])

  useEffect(() => {
    onActiveChange?.(activeIdx)
  }, [activeIdx, onActiveChange])

  return (
    <div className="h-full w-64 flex-shrink-0 overflow-y-auto bg-white scroll-area">
      <div className="px-3 py-2 text-xs font-semibold text-black/40 uppercase tracking-wider border-b border-black/10">
        端点
      </div>
      <div className="py-1">
        {endpoints.map((ep, i) => (
          <button
            key={i}
            onClick={() => { scrollTo(i); onEndpointClick?.(i) }}
            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-black/5 transition-colors ${
              i === activeIdx ? 'bg-black/5 text-black' : 'text-black/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 method-${ep.method.toLowerCase()}`} />
            <span className="truncate">{ep.summary || `${ep.method.toUpperCase()} ${ep.path}`}</span>
          </button>
        ))}
      </div>
    </div>
  )
}