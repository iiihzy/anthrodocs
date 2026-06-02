import type { Endpoint } from '../types'

export function groupParamsByIn<T extends { in: string }>(params: T[]) {
  const groups: Record<string, T[]> = {}
  for (const p of params) {
    if (!groups[p.in]) groups[p.in] = []
    groups[p.in].push(p)
  }
  return groups
}

export function findEndpointLines(yaml: string, endpoints: Endpoint[]) {
  const lines = yaml.split('\n')
  const map = new Map<number, number>()

  for (let i = 0; i < endpoints.length; i++) {
    const ep = endpoints[i]
    for (let j = 0; j < lines.length; j++) {
      const trimmed = lines[j].trimEnd()
      const indent = trimmed.length - trimmed.trimStart().length
      if (indent > 0 && trimmed.trimStart() === `${ep.path}:` || trimmed.trimStart().startsWith(`${ep.path}: `)) {
        const pathIndent = indent
        for (let k = j + 1; k < lines.length; k++) {
          const t = lines[k].trimEnd()
          const ki = t.length - t.trimStart().length
          if (ki <= pathIndent) break
          if (t.trimStart().startsWith(`${ep.method}:`)) {
            map.set(i, k)
            break
          }
        }
        break
      }
    }
  }

  return map
}