'use client'

import React from 'react'

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const token = match[1]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>)
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={match.index} className="bg-black/5 px-1 py-0.5 rounded text-xs font-mono text-purple-600">{token.slice(1, -1)}</code>)
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        parts.push(<a key={match.index} href={linkMatch[2]} className="text-black underline underline-offset-2">{linkMatch[1]}</a>)
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

export default function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++
      elements.push(
        <pre key={key++} className="bg-black/5 rounded-lg p-4 overflow-x-auto mb-3 text-xs">
          <code className={`font-mono text-black/70${lang ? ` language-${lang}` : ''}`}>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    // Heading
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-black/80 mt-4 mb-2">{line.slice(4)}</h3>
      )
      i++
      continue
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-base font-semibold text-black/90 mt-5 mb-2">{line.slice(3)}</h2>
      )
      i++
      continue
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-lg font-bold text-black mt-5 mb-2">{line.slice(2)}</h1>
      )
      i++
      continue
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}\s*$/)) {
      elements.push(<hr key={key++} className="border-black/10 my-4" />)
      i++
      continue
    }

    // Table
    if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1].startsWith('|')) {
      const headerLine = line
      const rows: string[][] = []
      i++
      if (lines[i].startsWith('|')) i++ // skip separator
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i].split('|').filter(Boolean).map(c => c.trim()))
        i++
      }
      const headers = headerLine.split('|').filter(Boolean).map(c => c.trim())
      elements.push(
        <div key={key++} className="overflow-x-auto mb-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                {headers.map((h, hi) => (
                  <th key={hi} className="text-left py-2 px-3 font-semibold text-black/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-black/5">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 px-3 text-black/50">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // List item
    if (line.match(/^\s*[-*]\s/)) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        listItems.push(lines[i].replace(/^\s*[-*]\s/, ''))
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside mb-3 text-xs text-black/50 space-y-1">
          {listItems.map((item, li) => (
            <li key={li}>{parseInline(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```') && !lines[i].startsWith('###') && !lines[i].startsWith('##') && !lines[i].startsWith('#') && !lines[i].startsWith('|') && !lines[i].match(/^\s*[-*]\s/) && !lines[i].match(/^[-*_]{3,}\s*$/)) {
      paraLines.push(lines[i])
      i++
    }
    elements.push(
      <p key={key++} className="text-xs text-black/50 mb-3 leading-relaxed">{parseInline(paraLines.join(' '))}</p>
    )
  }

  return <div className="markdown-block">{elements}</div>
}