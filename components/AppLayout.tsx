'use client'

import { useRef, useState } from 'react'
import type { ApiDoc } from '../types'
import YamlViewer from './YamlViewer'
import DocPreview from './DocPreview'
import SidebarNav from './SidebarNav'

interface Props {
  initialDoc: ApiDoc | null
  yaml: string
}

export default function AppLayout({ initialDoc, yaml }: Props) {
  const [previewScrollTop, setPreviewScrollTop] = useState(0)
  const [leftWidth, setLeftWidth] = useState(450)
  const resizing = useRef(false)
  const startX = useRef(0)

  const onResizeStart = (e: React.MouseEvent) => {
    resizing.current = true
    startX.current = e.clientX - leftWidth

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return
      setLeftWidth(Math.max(300, Math.min(800, ev.clientX - startX.current)))
    }
    const onUp = () => {
      resizing.current = false
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
        <div className="flex-shrink-0 border-r border-gray-200 bg-white flex flex-col" style={{ width: leftWidth }}>
          <div className="px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
            <span className="text-xs text-gray-400 font-medium">YAML 源码</span>
          </div>
          <YamlViewer value={yaml} />
        </div>

        <div
          className="w-1.5 bg-transparent hover:bg-gray-300 cursor-col-resize flex-shrink-0 transition-colors"
          onMouseDown={onResizeStart}
        />

        <div className="flex-1 relative overflow-hidden">
          {initialDoc ? (
            <>
              <DocPreview doc={initialDoc} onScroll={setPreviewScrollTop} />
              <SidebarNav endpoints={initialDoc.endpoints} scrollTop={previewScrollTop} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              加载 swagger.yaml ...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}