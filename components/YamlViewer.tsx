'use client'

interface Props {
  value: string
}

export default function YamlViewer({ value }: Props) {
  return (
    <pre className="flex-1 overflow-auto p-4 text-xs font-mono leading-relaxed text-gray-700 bg-gray-50 select-text whitespace-pre">
      {value}
    </pre>
  )
}