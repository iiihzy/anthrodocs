import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { parseSpecFromString } from '../lib/parser.js'
import AppLayout from '../components/AppLayout'
import type { ApiDoc } from '../types'

async function getDoc(): Promise<{ doc: ApiDoc | null; yaml: string }> {
  const inputPath = process.env.SWAGGER_FILE || resolve(process.cwd(), '..', 'swagger.yaml')
  if (!existsSync(inputPath)) {
    return { doc: null, yaml: '' }
  }
  const raw = readFileSync(inputPath, 'utf-8')
  const doc = parseSpecFromString(raw)
  return { doc, yaml: raw }
}

export default async function HomePage() {
  const { doc, yaml } = await getDoc()

  return (
    <AppLayout initialDoc={doc} yaml={yaml} />
  )
}