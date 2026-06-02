'use client'

import { useRef, useState, useMemo, useCallback } from 'react'
import type { ApiDoc } from '../types'
import { findEndpointLines } from '../lib/utils'
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

        <div className="flex-1 min-w-0 overflow-hidden flex">
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