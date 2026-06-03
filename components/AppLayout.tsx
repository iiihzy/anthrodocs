'use client'

import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import type { ApiDoc } from '../types'
import { findEndpointLines } from '../lib/utils'
import { generateMarkdownFromDoc } from '../lib/copy-md'
import YamlViewer from './YamlViewer'
import DocPreview from './DocPreview'
import SidebarNav from './SidebarNav'

interface Props {
  initialDoc: ApiDoc | null
  yaml: string
}

export default function AppLayout({ initialDoc, yaml }: Props) {
  const [previewScrollTop, setPreviewScrollTop] = useState(0)
  const [leftWidth, setLeftWidth] = useState(300)
  const [yamlHighlightLine, setYamlHighlightLine] = useState<number | null>(null)
  const resizing = useRef(false)
  const startX = useRef(0)
  const previewRef = useRef<HTMLDivElement>(null)
  const [copyOpen, setCopyOpen] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')

  useEffect(() => {
    if (!copyFeedback) return
    const t = setTimeout(() => setCopyFeedback(''), 2000)
    return () => clearTimeout(t)
  }, [copyFeedback])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (copyOpen) setCopyOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [copyOpen])

  const copyPage = useCallback(async () => {
    const el = previewRef.current
    if (!el) return
    const text = el.textContent || ''
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback('已复制页面内容')
    } catch {
      setCopyFeedback('复制失败')
    }
    setCopyOpen(false)
  }, [])

  const copyMarkdown = useCallback(async () => {
    if (!initialDoc) return
    const md = generateMarkdownFromDoc(initialDoc)
    try {
      await navigator.clipboard.writeText(md)
      setCopyFeedback('已复制 Markdown')
    } catch {
      setCopyFeedback('复制失败')
    }
    setCopyOpen(false)
  }, [initialDoc])

  const endpointLines = useMemo(() => {
    if (!initialDoc) return new Map<number, number>()
    return findEndpointLines(yaml, initialDoc.endpoints)
  }, [yaml, initialDoc])

  const handleEndpointClick = useCallback((idx: number) => {
    const line = endpointLines.get(idx)
    if (line !== undefined) setYamlHighlightLine(line)
  }, [endpointLines])

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    resizing.current = true
    startX.current = e.clientX - leftWidth
    document.body.classList.add('select-none')

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return
      ev.preventDefault()
      setLeftWidth(Math.max(300, Math.min(800, ev.clientX - startX.current)))
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

  return (
    <div className="flex flex-1 overflow-hidden">
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 flex-shrink-0 fixed top-0 left-0 right-0 z-20">
        <h1 className="text-sm font-semibold text-gray-800">Anthrodocs</h1>
        <span className="text-xs text-gray-400 ml-2">API 文档</span>
        <div className="flex-1" />
        {copyFeedback && (
          <span className="text-xs text-green-600 mr-3">{copyFeedback}</span>
        )}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
            onClick={(e) => { e.stopPropagation(); setCopyOpen(!copyOpen) }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
            <svg className={`w-3 h-3 transition-transform ${copyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {copyOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-30 py-1">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onClick={(e) => { e.stopPropagation(); copyPage() }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0 3-3m-3 3 3 3" />
                </svg>
                Copy page
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onClick={(e) => { e.stopPropagation(); copyMarkdown() }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Copy as markdown
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 mt-12 overflow-hidden">
        <div className="flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden" style={{ width: leftWidth }}>
          <div className="px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
            <span className="text-xs text-gray-400 font-medium">YAML 源码</span>
          </div>
          <YamlViewer value={yaml} highlightLine={yamlHighlightLine} />
        </div>

        <div
          className="w-1.5 bg-transparent hover:bg-gray-300 cursor-col-resize flex-shrink-0 transition-colors select-none"
          onMouseDown={onResizeStart}
        />

        <div ref={previewRef} className="flex-1 min-w-0 overflow-hidden flex">
          {initialDoc ? (
            <>
              <DocPreview doc={initialDoc} onScroll={setPreviewScrollTop} />
              <SidebarNav
                endpoints={initialDoc.endpoints}
                scrollTop={previewScrollTop}
                onEndpointClick={handleEndpointClick}
                onActiveChange={handleEndpointClick}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-400 text-sm">
              加载 swagger.yaml ...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}