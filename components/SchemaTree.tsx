'use client'

import { useState } from 'react'
import type { SchemaNode } from '../types'

const TYPE_COLORS: Record<string, string> = {
  string: 'text-emerald-600 bg-emerald-50',
  integer: 'text-blue-600 bg-blue-50',
  number: 'text-blue-600 bg-blue-50',
  boolean: 'text-orange-600 bg-orange-50',
  array: 'text-cyan-600 bg-cyan-50',
  object: 'text-gray-600 bg-gray-100',
}

interface SchemaTreeProps {
  tree: SchemaNode[] | null
}

export default function SchemaTree({ tree }: SchemaTreeProps) {
  if (!tree || tree.length === 0) return null

  return (
    <div className="schema-tree-root">
      {tree.map((node, i) => (
        <SchemaNodeRow key={i} node={node} depth={0} />
      ))}
    </div>
  )
}

function SchemaNodeRow({ node, depth }: { node: SchemaNode; depth: number }) {
  const [collapsed, setCollapsed] = useState(depth >= 3)
  const hasChildren = node.children && node.children.length > 0
  const hasVariants = node.variants && node.variants.length > 0
  const isExpandable = hasChildren || hasVariants

  const typeColor = TYPE_COLORS[node.type] || 'text-gray-500 bg-gray-50'

  return (
    <div className="schema-node">
      <div
        className="schema-node-row"
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 py-1.5">
          {isExpandable ? (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}
              >
                <path d="M 3 1 L 8 5 L 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          ) : (
            <span className="flex-shrink-0 w-4" />
          )}

          <span className="font-mono text-sm font-semibold text-purple-700">{node.name}</span>

          <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-medium ${typeColor}`}>
            {node.type}
            {node.format ? ` (${node.format})` : ''}
          </span>

          {node.required ? (
            <span className="text-[11px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">required</span>
          ) : (
            <span className="text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">optional</span>
          )}

          {node.enum && node.enum.length > 0 && (
            <span className="text-[11px] text-gray-400">
              Enum: <code className="text-gray-600">{node.enum.join(', ')}</code>
            </span>
          )}

          {node.default !== undefined && (
            <span className="text-[11px] text-gray-400">
              Default: <code className="text-gray-600">{node.default}</code>
            </span>
          )}

          {node.description && (
            <span className="text-[11px] text-gray-400 truncate hidden sm:inline">{node.description}</span>
          )}
        </div>
      </div>

      {isExpandable && !collapsed && (
        <div className="schema-node-children">
          {hasChildren && node.children!.map((child, i) => (
            <SchemaNodeRow key={i} node={child} depth={depth + 1} />
          ))}
          {hasVariants && (
            <div className="schema-node-variants">
              <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1 mb-1" style={{ paddingLeft: `${(depth + 1) * 20}px` }}>
                oneOf
              </div>
              {node.variants!.map((variant, i) => (
                <SchemaNodeRow key={i} node={variant} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}