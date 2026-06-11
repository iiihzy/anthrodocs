'use client'

import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import type { ApiDoc } from '../types'
import { findEndpointLines } from '../lib/utils'
import { generateMarkdownFromDoc, generatePageText } from '../lib/copy-md'
import YamlViewer from './YamlViewer'
import DocPreview from './DocPreview'
import SidebarNav from './SidebarNav'

interface Props {
  initialDoc: ApiDoc | null
  yaml: string
  fileNames?: string[]
  activeFile?: string
  onSwitchFile?: (fileName: string) => void
}

const MIN_YAML_WIDTH = 400

type LeftMode = 'source' | 'files'

export default function AppLayout({ initialDoc, yaml, fileNames, activeFile, onSwitchFile }: Props) {
  const [previewScrollTop, setPreviewScrollTop] = useState(0)
  const [leftWidth, setLeftWidth] = useState(400)
  const [leftMode, setLeftMode] = useState<LeftMode>('source')
  const [yamlHighlightLine, setYamlHighlightLine] = useState<number | null>(null)
  const resizing = useRef(false)
  const startX = useRef(0)
  const [copyOpen, setCopyOpen] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')

  const hasFiles = fileNames && fileNames.length > 1
  const label = (name: string) => name.replace(/\.ya?ml$/, '')

  useEffect(() => {
    if (!copyFeedback) return
    const t = setTimeout(() => setCopyFeedback(''), 2000)
    return () => clearTimeout(t)
  }, [copyFeedback])

  useEffect(() => {
    function handleClickOutside() {
      if (copyOpen) setCopyOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [copyOpen])

  const copyPage = useCallback(async () => {
    if (!initialDoc) return
    const text = generatePageText(initialDoc)
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback('已复制页面内容')
    } catch {
      setCopyFeedback('复制失败')
    }
    setCopyOpen(false)
  }, [initialDoc])

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
      setLeftWidth(Math.max(MIN_YAML_WIDTH, Math.min(800, ev.clientX - startX.current)))
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

  const handleFileSelect = (name: string) => {
    onSwitchFile?.(name)
    setLeftMode('source')
  }

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      <header className="h-9 bg-white border-b border-black/10 flex items-center px-3 flex-shrink-0">
        <span className="text-xs text-black/40 font-mono">{activeFile}</span>
        <div className="flex-1" />
        {copyFeedback && (
          <span className="text-xs text-black/50 mr-3">{copyFeedback}</span>
        )}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-black/60 bg-black/[0.02] border border-black/10 rounded hover:bg-black/5 transition-colors"
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
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-black/10 rounded shadow-lg z-30 py-1">
              <button
                className="w-full text-left px-3 py-2 text-sm text-black/70 hover:bg-black/5 flex items-center gap-2"
                onClick={(e) => { e.stopPropagation(); copyPage() }}
              >
                <svg className="w-4 h-4 text-black/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0 3-3m-3 3 3 3" />
                </svg>
                Copy page
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-black/70 hover:bg-black/5 flex items-center gap-2"
                onClick={(e) => { e.stopPropagation(); copyMarkdown() }}
              >
                <svg className="w-4 h-4 text-black/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Copy as markdown
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <div className="flex-shrink-0 border-r border-black/10 bg-white flex flex-col overflow-hidden" style={{ width: leftWidth }}>
          <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-black/5 flex-shrink-0">
            <button
              onClick={() => setLeftMode('source')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                leftMode === 'source'
                  ? 'bg-black/5 text-black font-medium'
                  : 'text-black/40 hover:text-black/60 hover:bg-black/5'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              源码
            </button>
            {hasFiles && (
              <button
                onClick={() => setLeftMode('files')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  leftMode === 'files'
                    ? 'bg-black/5 text-black font-medium'
                    : 'text-black/40 hover:text-black/60 hover:bg-black/5'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                文件
              </button>
            )}
          </div>

          {leftMode === 'source' ? (
            <YamlViewer value={yaml} highlightLine={yamlHighlightLine} />
          ) : (
            <div className="flex-1 overflow-auto scroll-area">
              {fileNames?.map((name) => (
                <button
                  key={name}
                  onClick={() => handleFileSelect(name)}
                  className={`w-full text-left px-3 py-2 text-sm border-b border-black/5 transition-colors ${
                    name === activeFile
                      ? 'bg-black/[0.03] text-black font-medium'
                      : 'text-black/60 hover:bg-black/5'
                  }`}
                >
                  {label(name)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="w-1.5 bg-transparent hover:bg-black/10 cursor-col-resize flex-shrink-0 transition-colors select-none"
          onMouseDown={onResizeStart}
        />

        <div className="flex-1 min-w-0 overflow-hidden flex">
          {initialDoc ? (
            <>
              <DocPreview doc={initialDoc} onScroll={setPreviewScrollTop} onEndpointClick={handleEndpointClick} />
              <SidebarNav
                endpoints={initialDoc.endpoints}
                scrollTop={previewScrollTop}
                onEndpointClick={handleEndpointClick}
                onActiveChange={handleEndpointClick}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full w-full text-black/40 text-sm">
              加载 swagger.yaml ...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}