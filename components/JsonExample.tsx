'use client'

import { useState } from 'react'
import type { SchemaNode } from '../types'

interface Props {
  tree: SchemaNode[]
}

function sampleValue(node: SchemaNode): unknown {
  if (node.enum && node.enum.length > 0) return node.enum[0]
  if (node.default !== undefined) {
    if (node.type === 'integer' || node.type === 'number') return Number(node.default)
    if (node.type === 'boolean') return node.default === 'true'
    return node.default
  }

  switch (node.type) {
    case 'string':
      return 'string'
    case 'integer':
      return 0
    case 'number':
      return 0.0
    case 'boolean':
      return true
    case 'array':
      if (node.children && node.children.length > 0) {
        const childObj: Record<string, unknown> = {}
        for (const child of node.children) {
          childObj[child.name] = sampleValue(child)
        }
        return [childObj]
      }
      return ['string']
    case 'object': {
      const obj: Record<string, unknown> = {}
      if (node.children) {
        for (const child of node.children) {
          obj[child.name] = sampleValue(child)
        }
      }
      return obj
    }
    default:
      return null
  }
}

function buildSample(tree: SchemaNode[]): unknown {
  if (tree.length === 1 && tree[0].type === 'object') {
    return sampleValue(tree[0])
  }
  return tree.map(n => ({ [n.name]: sampleValue(n) }))
}

export default function JsonExample({ tree }: Props) {
  const [collapsed, setCollapsed] = useState(true)

  if (!tree || tree.length === 0) return null

  const sample = buildSample(tree)
  const json = JSON.stringify(sample, null, 2)

  return (
    <div className="mt-2 mb-3">
      <button
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1"
        onClick={() => setCollapsed(!collapsed)}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}
        >
          <path d="M2 1L6 4L2 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        示例
      </button>
      {!collapsed && (
        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-xs leading-relaxed text-gray-700 font-mono">
          <code>{json}</code>
        </pre>
      )}
    </div>
  )
}