'use client'

import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface FileInfo {
  title: string
  slug: string
}

interface DocGroup {
  name: string
  files: FileInfo[]
}

interface Props {
  groups: DocGroup[]
  currentSlug: string
  rawSource: string
  title: string
  description?: string
  children: React.ReactNode
}

const MIN_RIGHT_WIDTH = 300
const DEFAULT_RIGHT_WIDTH = 500

const TABS = ['Documentation', 'API Reference', 'Guides', 'FAQ'] as const
type Tab = (typeof TABS)[number]

const TAB_GROUP_MAP: Record<Tab, string[]> = {
  'Documentation': ['Documentation'],
  'API Reference': ['API Reference'],
  'Guides': ['Guides'],
  'FAQ': ['FAQ'],
}

const GROUP_TO_TAB: Record<string, Tab> = {
  'Documentation': 'Documentation',
  'API Reference': 'API Reference',
  'Guides': 'Guides',
  'FAQ': 'FAQ',
}

export default function MdxDocViewer({ groups, currentSlug, rawSource, title, description, children }: Props) {
  const router = useRouter()
  const initialGroup = groups.find((g) => g.files.some((f) => f.slug === currentSlug))?.name
  const defaultTab: Tab = initialGroup ? (GROUP_TO_TAB[initialGroup] || 'Documentation') : 'Documentation'
  const [selectedTab, setSelectedTab] = useState<Tab>(defaultTab)
  const containerRef = useRef<HTMLDivElement>(null)
  const filteredGroups = useMemo(() => {
    const allowed = TAB_GROUP_MAP[selectedTab]
    return groups.filter((g) => allowed.includes(g.name))
  }, [groups, selectedTab])
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH)
  const resizing = useRef(false)
  const startX = useRef(0)
  const [copyFeedback, setCopyFeedback] = useState('')

  useEffect(() => {
    if (!copyFeedback) return
    const t = setTimeout(() => setCopyFeedback(''), 2000)
    return () => clearTimeout(t)
  }, [copyFeedback])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const available = el.offsetWidth - 192 - 6
    const ratio = Math.round(available * 0.4)
    setRightWidth(Math.max(MIN_RIGHT_WIDTH, Math.min(800, ratio)))
  }, [])

  const copySource = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(rawSource)
      setCopyFeedback('Copied')
    } catch {
      setCopyFeedback('Copy failed')
    }
  }, [rawSource])

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    resizing.current = true
    startX.current = e.clientX + rightWidth
    document.body.classList.add('select-none')

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return
      ev.preventDefault()
      setRightWidth(Math.max(MIN_RIGHT_WIDTH, Math.min(800, startX.current - ev.clientX)))
    }
    const onUp = () => {
      resizing.current = false
      document.body.classList.remove('select-none')
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const lines = rawSource.split('\n')

  return (
    <div className="flex flex-1 overflow-hidden min-h-0" ref={containerRef}>
      <div className="flex flex-1 overflow-hidden min-h-0">
<div className="flex-shrink-0 border-r border-black/10 bg-white flex flex-col overflow-hidden w-48">
          <div className="border-b border-black/10">
            <div className="flex flex-col">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`text-left text-sm font-semibold py-1.5 px-3 transition-colors ${
                    tab === selectedTab
                      ? 'text-black bg-black/[0.02] border-l-2 border-black'
                      : 'text-black/40 hover:text-black/60 hover:bg-black/[0.02]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
<div className="flex-1 overflow-auto scroll-area py-1">
            {filteredGroups.map((group) => (
              <div key={group.name}>
                {group.files.map((file) => (
                  <button
                    key={file.slug}
                    onClick={() => router.push(`/docs/${file.slug}`)}
                    className={`w-full text-left px-3 py-1 text-sm transition-colors truncate ${
                      file.slug === currentSlug
                        ? 'bg-black/5 text-black font-medium'
                        : 'text-black/60 hover:bg-black/5'
                    }`}
                  >
                    {file.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-end px-4 py-2 flex-shrink-0">
            {copyFeedback && (
              <span className="text-sm text-black/50 mr-3">{copyFeedback}</span>
            )}
            <button
              className="flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium text-black/60 bg-black/[0.02] border border-black/10 rounded hover:bg-black/5 transition-colors"
              onClick={copySource}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scroll-area">
            <div className="px-8 py-6">
              <header className="mb-8 border-b border-black/10 pb-8">
                <h1 className="text-3xl font-bold tracking-tight text-black">{title}</h1>
                {description && <p className="mt-4 text-lg text-black/60">{description}</p>}
              </header>
              <div className="prose max-w-none text-black">
                {children}
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-1.5 bg-transparent hover:bg-black/10 cursor-col-resize flex-shrink-0 transition-colors select-none"
          onMouseDown={onResizeStart}
        />

        <div className="flex-shrink-0 border-l border-black/10 bg-black/[0.02] flex flex-col overflow-hidden" style={{ width: rightWidth }}>
          <div className="px-3 py-1.5 text-sm font-semibold text-black/40 uppercase tracking-wider border-b border-black/5 flex-shrink-0">
            Source
          </div>
          <div className="flex-1 min-h-0 overflow-auto scroll-area">
            <pre className="p-4 text-sm font-mono leading-relaxed text-black/70 select-text whitespace-pre">
              {lines.map((line, i) => (
                <div key={i} data-source-line={i}>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
