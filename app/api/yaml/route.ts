import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export async function GET() {
  try {
    const inputPath = process.env.SWAGGER_FILE || resolve(process.cwd(), '..', 'swagger.yaml')
    const raw = readFileSync(inputPath, 'utf-8')
    return NextResponse.json({ yaml: raw })
  } catch {
    return NextResponse.json({ yaml: '' }, { status: 404 })
  }
}