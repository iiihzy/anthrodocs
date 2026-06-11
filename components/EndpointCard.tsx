'use client'

import { useState } from 'react'
import type { Endpoint } from '../types'
import { groupParamsByIn } from '../lib/utils'
import ParametersTable from './ParametersTable'
import JsonExample from './JsonExample'
import SchemaTree from './SchemaTree'
import MarkdownBlock from './MarkdownBlock'

interface Props {
  endpoint: Endpoint
}

const PARAM_LABELS: Record<string, string> = {
  path: 'Path 参数',
  query: 'Query 参数',
  header: 'Header 参数',
}

function statusClass(status: string) {
  const code = parseInt(status, 10)
  if (code >= 200 && code < 300) return 'status-ok'
  if (code >= 300 && code < 400) return 'status-redirect'
  return 'status-error'
}

export default function EndpointCard({ endpoint: ep }: Props) {
  const [collapsed, setCollapsed] = useState(true)

  const methodClass = `method-${ep.method.toLowerCase()}`
  const nonBody = (ep.parameters || []).filter(p => p.in !== 'formData' && p.in !== 'body')
  const grouped = groupParamsByIn(nonBody)
  const epId = `ep-${ep.method}-${ep.path.replace(/[/{}]/g, '-')}`

  return (
    <div data-endpoint-id={epId} className="bg-white border border-black/10 rounded-lg mb-4 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-black/[0.02] border-b border-black/5 hover:bg-black/5 transition-colors text-left"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-xs text-black/40 transition-transform" style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${methodClass}`}>
          {ep.method.toUpperCase()}
        </span>
        <code className="font-mono text-sm text-black/70 flex-1">{ep.path}</code>
        <span className="text-sm text-black/50 truncate max-w-[200px]">{ep.summary}</span>
      </button>

      {!collapsed && (
        <div className="px-4 py-3">
          {ep.description && ep.description !== ep.summary && (
            <div className="mb-3">
              <MarkdownBlock text={ep.description} />
            </div>
          )}

          {Object.keys(grouped).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-black/70 mb-2">请求参数</h4>
              {Object.entries(grouped).map(([loc, params]) => (
                <div key={loc} className="mb-3">
                  <div className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">
                    {PARAM_LABELS[loc] || loc}
                  </div>
                  <ParametersTable parameters={params} />
                </div>
              ))}
            </div>
          )}

          {ep.requestBody && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-black/70 mb-2">请求体</h4>
              <p className="text-xs text-black/50 mb-2">
                Content-Type: <code className="bg-black/5 px-1.5 py-0.5 rounded text-purple-600">{ep.requestBody.contentType}</code>
              </p>
              {ep.requestBody.schemaTree && ep.requestBody.schemaTree.length > 0 && (
                <SchemaTree tree={ep.requestBody.schemaTree} />
              )}
            </div>
          )}

          {ep.responses && ep.responses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-black/70 mb-2">响应</h4>
              {ep.responses.map((resp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusClass(resp.status)}`}>
                      {resp.status}
                    </span>
                    {resp.description && <div className="text-sm text-black/50"><MarkdownBlock text={resp.description} /></div>}
                  </div>
                  {!resp.isEmpty && resp.schema && (
                    <div className="mb-2">
                      {resp.schemaTree && resp.schemaTree.length > 0 && (
                        <>
                          <SchemaTree tree={resp.schemaTree} />
                          <JsonExample tree={resp.schemaTree} />
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}