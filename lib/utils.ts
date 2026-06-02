export function groupParamsByIn<T extends { in: string }>(params: T[]) {
  const groups: Record<string, T[]> = {}
  for (const p of params) {
    if (!groups[p.in]) groups[p.in] = []
    groups[p.in].push(p)
  }
  return groups
}