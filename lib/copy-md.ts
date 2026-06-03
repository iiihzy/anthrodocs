import type { ApiDoc, Endpoint, Parameter, SchemaNode } from '../types'

function groupParamsByIn(params: Parameter[]): Record<string, Parameter[]> {
  const groups: Record<string, Parameter[]> = {}
  for (const p of params) {
    if (!groups[p.in]) groups[p.in] = []
    groups[p.in].push(p)
  }
  return groups
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

function generateExampleJson(tree: SchemaNode[] | null | undefined): string {
  if (!tree || tree.length === 0) return '{}'
  return JSON.stringify(buildSample(tree), null, 2)
}

const PARAM_LABELS: Record<string, string> = {
  path: 'Path Parameters',
  query: 'Query Parameters',
  header: 'Header Parameters',
}

function renderParametersTable(params: Parameter[]): string[] {
  const lines: string[] = []
  lines.push('| 参数名 | 类型 | 必填 | 描述 |')
  lines.push('|--------|------|------|------|')
  for (const p of params) {
    const desc = (p.description || '—').replace(/\|/g, '\\|')
    lines.push(`| \`${p.name}\` | ${p.type || 'string'} | ${p.required ? '是' : '否'} | ${desc} |`)
  }
  return lines
}

function renderEndpointMarkdown(ep: Endpoint, baseUrl: string): string[] {
  const lines: string[] = []
  const title = ep.summary || `${ep.method.toUpperCase()} ${ep.path}`

  lines.push(`## ${title}`)
  lines.push('')
  lines.push(`\`${ep.method.toUpperCase()}\` \`${ep.path}\``)
  lines.push('')

  if (ep.description && ep.description !== ep.summary) {
    lines.push(ep.description)
    lines.push('')
  }

  const nonBody = ep.parameters.filter(p => p.in !== 'formData' && p.in !== 'body')
  const grouped = groupParamsByIn(nonBody)

  if (Object.keys(grouped).length > 0 || ep.requestBody) {
    lines.push('### 请求参数')
    lines.push('')

    for (const [loc, params] of Object.entries(grouped)) {
      const label = PARAM_LABELS[loc] || `${loc} Parameters`
      lines.push(`#### ${label}`)
      lines.push('')
      lines.push(...renderParametersTable(params))
      lines.push('')
    }

    if (ep.requestBody) {
      const formParams = ep.parameters.filter(p => p.in === 'formData')
      if (formParams.length > 0) {
        lines.push('#### Form Data')
        lines.push('')
        lines.push(...renderParametersTable(formParams))
        lines.push('')
      } else {
        const ct = ep.requestBody.contentType || 'application/json'
        lines.push(`请求体类型: \`${ct}\``)
        lines.push('')
      }
    }
  }

  lines.push('### 请求示例')
  lines.push('')
  lines.push('```bash')
  lines.push(`curl -X ${ep.method.toUpperCase()} ${baseUrl}${ep.path}`)
  lines.push('```')
  lines.push('')

  if (ep.responses && ep.responses.length > 0) {
    lines.push('### 响应')
    lines.push('')

    for (const resp of ep.responses) {
      lines.push(`**Status**: ${resp.status}`)
      if (resp.description) {
        lines.push('')
        lines.push(resp.description)
      }
      lines.push('')
      lines.push('```json')
      lines.push(generateExampleJson(resp.schemaTree))
      lines.push('```')
      lines.push('')
    }
  }

  return lines
}

export function generateMarkdownFromDoc(doc: ApiDoc): string {
  const lines: string[] = []

  lines.push(`# ${doc.title} v${doc.version}`)
  lines.push('')
  lines.push(`> **Base URL**: \`${doc.baseUrl}\``)

  if (doc.security && doc.security.length > 0) {
    const authStr = doc.security.map(s => `\`${s.name}\``).join(', ')
    lines.push(`> **认证方式**: ${authStr}`)
  }
  lines.push('')
  lines.push('---')
  lines.push('')

  for (let i = 0; i < doc.endpoints.length; i++) {
    lines.push(...renderEndpointMarkdown(doc.endpoints[i], doc.baseUrl))
    if (i < doc.endpoints.length - 1) {
      lines.push('')
    }
  }

  return lines.join('\n') + '\n'
}

function renderEndpointText(ep: Endpoint, baseUrl: string): string[] {
  const lines: string[] = []
  const title = ep.summary || `${ep.method.toUpperCase()} ${ep.path}`

  lines.push(`${ep.method.toUpperCase()} ${ep.path}`)
  lines.push(title)
  lines.push('')

  if (ep.description && ep.description !== ep.summary) {
    lines.push(ep.description)
    lines.push('')
  }

  const nonBody = ep.parameters.filter(p => p.in !== 'formData' && p.in !== 'body')
  const grouped = groupParamsByIn(nonBody)

  if (Object.keys(grouped).length > 0) {
    lines.push('请求参数')
    lines.push('')

    for (const [loc, params] of Object.entries(grouped)) {
      const label = PARAM_LABELS[loc] || loc
      lines.push(`  ${label}`)
      for (const p of params) {
        const desc = p.description || '—'
        lines.push(`    ${p.name}  ${p.type || 'string'}  ${p.required ? '是' : '否'}  ${desc}`)
      }
      lines.push('')
    }
  }

  if (ep.responses && ep.responses.length > 0) {
    lines.push('响应')
    lines.push('')
    for (const resp of ep.responses) {
      lines.push(`  ${resp.status}${resp.description ? '  ' + resp.description : ''}`)
      const example = generateExampleJson(resp.schemaTree)
      lines.push(`  ${example.replace(/\n/g, '\n  ')}`)
      lines.push('')
    }
  }

  return lines
}

export function generatePageText(doc: ApiDoc): string {
  const lines: string[] = []

  lines.push(`${doc.title} v${doc.version}`)
  lines.push(`Base URL: ${doc.baseUrl}`)
  lines.push('')

  for (const ep of doc.endpoints) {
    lines.push(...renderEndpointText(ep, doc.baseUrl))
  }

  return lines.join('\n')
}