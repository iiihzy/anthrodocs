'use client'

import type { Parameter } from '../types'

interface Props {
  parameters: Parameter[]
}

export default function ParametersTable({ parameters }: Props) {
  if (!parameters || parameters.length === 0) return null

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">参数名</th>
          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">类型</th>
          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">必填</th>
          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">描述</th>
        </tr>
      </thead>
      <tbody>
        {parameters.map((p, i) => (
          <tr key={i} className="border-b border-gray-50">
            <td className="py-2 px-3 font-mono text-sm text-purple-600">{p.name}</td>
            <td className="py-2 px-3 text-gray-600">{p.type}</td>
            <td className="py-2 px-3">
              {p.required ? (
                <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-semibold">是</span>
              ) : (
                <span className="text-gray-400">否</span>
              )}
            </td>
            <td className="py-2 px-3 text-gray-500">{p.description || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}