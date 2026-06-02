'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Endpoint } from '../types'

interface Props {
  endpoints: Endpoint[]
  scrollTop?: number
}

export default function SidebarNav({ endpoints, scrollTop = 0 }: Props) {
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

  return (
    <div className="fixed right-4 top-24 w-48 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm z-10">
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
        端点
      </div>
      <div className="py-1">
        {endpoints.map((ep, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${
              i === activeIdx ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
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