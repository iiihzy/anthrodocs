'use client'

import { useRef, useEffect } from 'react'
import type { Endpoint } from '../types'
import EndpointCard from './EndpointCard'

interface Props {
  doc: { title: string; version: string; baseUrl: string; endpoints: Endpoint[] }
  onScroll?: (scrollTop: number) => void
}

export default function DocPreview({ doc, onScroll }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !onScroll) return
    const handler = () => onScroll(el.scrollTop)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [onScroll])

  return (
    <div ref={ref} className="flex-1 min-h-0 min-w-0 overflow-y-auto pl-6 py-4 scroll-area">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {doc.title}
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            v{doc.version}
          </span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          <code className="bg-gray-100 px-2 py-0.5 rounded text-purple-600 font-mono text-xs">{doc.baseUrl}</code>
        </p>
      </div>

      {doc.endpoints.map((ep, i) => (
        <EndpointCard key={i} endpoint={ep} />
      ))}
    </div>
  )
}