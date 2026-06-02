import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { parseSpecFromString } from './lib/parser.js'
import AppLayout from './components/AppLayout'

export function createAnthrodocsPage(yamlRelativePath: string) {
  return async function AnthrodocsPage() {
    const absPath = resolve(process.cwd(), yamlRelativePath)

    if (!existsSync(absPath)) {
      return (
        <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
          找不到 {yamlRelativePath}，请确认文件路径。
        </div>
      )
    }

    const yaml = readFileSync(absPath, 'utf-8')

    try {
      const doc = parseSpecFromString(yaml)
      return <AppLayout initialDoc={doc} yaml={yaml} />
    } catch (e) {
      return (
        <div className="flex items-center justify-center h-screen text-red-500 text-sm">
          解析失败: {e instanceof Error ? e.message : String(e)}
        </div>
      )
    }
  }
}