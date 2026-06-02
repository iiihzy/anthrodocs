import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anthrodocs - API 文档',
  description: 'Anthropic 风格的 API 文档',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}