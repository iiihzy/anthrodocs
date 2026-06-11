'use client'

import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import type { ApiDoc } from 'anthrodocs'
import { DocPreview } from 'anthrodocs'
import { MDXRemote } from 'next-mdx-remote'
import { mdxComponents } from '@/components/mdx-content'

type PreloadedDoc = { doc: ApiDoc; yaml: string }

type FileTreeItem = {
  name: string
  path: string
  type: 'dir' | 'file'
  children?: FileTreeItem[]
}

interface Props {
  fileDocs: Record<string, PreloadedDoc>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mdxSerialized: Record<string, any>
  mdxSources: Record<string, string>
  tree: FileTreeItem[]
  defaultFile: string
}

const MIN_RIGHT_WIDTH = 160
const DEFAULT_RIGHT_WIDTH = 200

const TABS = ['Documentation', 'API Reference', 'Guides', 'FAQ'] as const
type Tab = (typeof TABS)[number]

const TAB_DIR_MAP: Record<Tab, string[]> = {
  'Documentation': ['documentation'],
  'API Reference': ['api-reference'],
  'Guides': ['guides'],
  'FAQ': ['faq'],
}

function FileTree({ items, activeFile, onSelect, depth = 0 }: {
  items: FileTreeItem[]
  activeFile: string
  onSelect: (path: string) => void
  depth?: number
}) {
  return (
    <>
      {items.map((item) => (
        <TreeItem key={item.path} item={item} activeFile={activeFile} onSelect={onSelect} depth={depth} />
      ))}
    </>
  )
}

function TreeItem({ item, activeFile, onSelect, depth }: {
  item: FileTreeItem
  activeFile: string
  onSelect: (path: string) => void
  depth: number
}) {
  const [expanded, setExpanded] = useState(true)

  if (item.type === 'dir') {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-3 py-1 text-sm flex items-center gap-1.5 text-black/50 hover:bg-black/5 transition-colors"
        >
          <svg
            className={`w-3 h-3 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="font-semibold text-black/60">{item.name}</span>
        </button>
        {expanded && item.children && (
          <div className="pl-3">
            <FileTree items={item.children} activeFile={activeFile} onSelect={onSelect} depth={depth + 1} />
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelect(item.path)}
      className={`w-full text-left px-3 py-1 text-sm transition-colors truncate font-mono block ${
        item.path === activeFile
          ? 'bg-black/5 text-black font-medium'
          : 'text-black/60 hover:bg-black/5'
      }`}
      style={{ paddingLeft: `${12 + depth * 14}px` }}
    >
      <span className={item.path.endsWith('.mdx') || item.path.endsWith('.md') ? 'text-black/40' : ''}>{item.name.replace(/\.(yaml|yml|mdx|md)$/, '')}</span>
    </button>
  )
}

function findFirstYaml(items: FileTreeItem[]): string | null {
  for (const item of items) {
    if (item.type === 'file' && (item.path.endsWith('.yaml') || item.path.endsWith('.yml'))) return item.path
    if (item.children) {
      const found = findFirstYaml(item.children)
      if (found) return found
    }
  }
  return null
}

function findFirstFile(items: FileTreeItem[]): string | null {
  for (const item of items) {
    if (item.type === 'file') return item.path
    if (item.children) {
      const found = findFirstFile(item.children)
      if (found) return found
    }
  }
  return null
}

type Heading = { text: string; level: number }

function extractHeadings(source: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Heading[] = []
  let match
  while ((match = headingRegex.exec(source)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    })
  }
  return headings
}

export function ApiDocsClient({ fileDocs, mdxSerialized, mdxSources, tree, defaultFile }: Props) {
  const [selectedTab, setSelectedTab] = useState<Tab>('API Reference')
  const [activeFile, setActiveFile] = useState(defaultFile)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH)
  const resizing = useRef(false)
  const startX = useRef(0)

const isMdx = activeFile.endsWith('.mdx') || activeFile.endsWith('.md')
  const currentDoc = fileDocs[activeFile]
  const currentSource = isMdx ? (mdxSources[activeFile] || '') : (currentDoc?.yaml || '')

  const filteredTree = useMemo(() => {
    const dirs = TAB_DIR_MAP[selectedTab]
    const topDirs = tree.filter((item) => item.type === 'dir' && dirs.includes(item.name))
    return topDirs.flatMap((d) => d.children || [])
  }, [tree, selectedTab])

  const handleSelect = useCallback((path: string) => {
    setActiveFile(path)
  }, [])

  const scrollToHeading = useCallback((text: string) => {
    requestAnimationFrame(() => {
      const el = contentRef.current
      if (!el) return
      const headings = el.querySelectorAll('h2, h3')
      for (const h of headings) {
        if (h.textContent?.trim() === text) {
          const scrollParent = el.closest('.scroll-area') || el
          const top = (h as HTMLElement).offsetTop - (scrollParent as HTMLElement).offsetTop - 20
          scrollParent.scrollTo({ top, behavior: 'smooth' })
          break
        }
      }
    })
  }, [])

  const scrollToEndpoint = useCallback((path: string) => {
    requestAnimationFrame(() => {
      const el = contentRef.current
      if (!el) return
      const allElements = el.querySelectorAll('*')
      for (const elem of allElements) {
        if (elem.children.length === 0 && elem.textContent?.trim().includes(path)) {
          const scrollParent = el.closest('.scroll-area') || el
          const top = (elem as HTMLElement).offsetTop - (scrollParent as HTMLElement).offsetTop - 20
          scrollParent.scrollTo({ top, behavior: 'smooth' })
          break
        }
      }
    })
  }, [])

  useEffect(() => {
    const firstYaml = findFirstYaml(filteredTree)
    if (firstYaml) {
      setActiveFile(firstYaml)
    } else {
      const firstFile = findFirstFile(filteredTree)
if (firstFile) setActiveFile(firstFile)
    }
  }, [selectedTab])

useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const available = el.offsetWidth - 192 - 4
    const ratio = Math.round(available * 0.22)
    setRightWidth(Math.max(MIN_RIGHT_WIDTH, Math.min(300, ratio)))
  }, [])

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    resizing.current = true
    startX.current = e.clientX + rightWidth
    document.body.classList.add('select-none')

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return
      ev.preventDefault()
      setRightWidth(Math.max(MIN_RIGHT_WIDTH, Math.min(300, startX.current - ev.clientX)))
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
            <FileTree items={filteredTree} activeFile={activeFile} onSelect={handleSelect} />
          </div>
        </div>

<div className="flex-1 min-w-0 overflow-auto scroll-area" ref={contentRef}>
          {isMdx && mdxSerialized[activeFile] ? (
            <div className="px-8 py-6">
              <MDXRemote {...mdxSerialized[activeFile]} components={mdxComponents} />
            </div>
          ) : currentDoc?.doc ? (
            <div className="px-8 py-6">
              <DocPreview doc={currentDoc.doc} />
            </div>
          ) : null}
        </div>

        <div
          className="w-0.5 bg-transparent hover:bg-black/10 cursor-col-resize flex-shrink-0 transition-colors select-none"
          onMouseDown={onResizeStart}
        />

<div className="flex-shrink-0 border-l border-black/10 bg-black/[0.02] flex flex-col" style={{ width: rightWidth }}>
          <div className="px-3 py-1.5 text-sm font-semibold text-black/40 uppercase tracking-wider border-b border-black/5 flex-shrink-0">
            On This Page
          </div>
          <div className="flex-1 min-h-0 overflow-auto scroll-area py-1">
            {isMdx ? (
              extractHeadings(currentSource).map((h, i) => (
                <button
                  key={i}
                  onClick={() => scrollToHeading(h.text)}
                  className="w-full text-left px-3 py-1 text-sm text-black/50 hover:text-black/80 hover:bg-black/5 transition-colors truncate block"
                  style={{ paddingLeft: `${12 + (h.level - 2) * 10}px` }}
                >
                  {h.text}
                </button>
              ))
            ) : currentDoc?.doc?.endpoints ? (
              currentDoc.doc.endpoints.map((ep, i) => (
                <button
                  key={i}
                  onClick={() => scrollToEndpoint(ep.path)}
                  className="w-full text-left px-3 py-1 text-sm text-black/50 hover:text-black/80 hover:bg-black/5 transition-colors block"
                >
                  <span className="font-mono text-xs text-black/30 mr-1.5">{ep.method?.toUpperCase()}</span>
                  {ep.summary || ep.path}
                </button>
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
