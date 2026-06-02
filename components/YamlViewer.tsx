'use client'

import { useEffect, useRef } from 'react'

interface Props {
  value: string
  highlightLine?: number | null
}

export default function YamlViewer({ value, highlightLine }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lines = value.split('\n')

  useEffect(() => {
    if (highlightLine == null || !containerRef.current) return
    const el = containerRef.current.querySelector(`[data-yaml-line="${highlightLine}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [highlightLine])

  return (
    <div ref={containerRef} className="flex-1 min-h-0 overflow-auto bg-gray-50 scroll-area">
      <pre className="p-4 text-xs font-mono leading-relaxed text-gray-700 select-text whitespace-pre">
        {lines.map((line, i) => (
          <div
            key={i}
            data-yaml-line={i}
            className={`${highlightLine === i ? 'bg-indigo-100 -mx-4 px-4' : ''}`}
          >
            {line}
          </div>
        ))}
      </pre>
    </div>
  )
}