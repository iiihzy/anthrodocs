# Anthrodocs

Redoc 风格的 API 文档渲染器，专为 Next.js App Router 设计。

[![npm](https://img.shields.io/npm/v/anthrodocs)](https://www.npmjs.com/package/anthrodocs)
[![license](https://img.shields.io/npm/l/anthrodocs)](https://github.com/iiihzy/anthrodocs/blob/main/LICENSE)

支持 Swagger 2.0 / OpenAPI 3.x，亮色主题，左右分栏布局。

## 安装

```bash
npm install anthrodocs
```

需要 `next` ≥ 14、`react` ≥ 18、`react-dom` ≥ 18（peerDependencies，你的项目已自带）。

## 快速开始

```tsx
// app/docs/page.tsx
import { createAnthrodocsPage } from 'anthrodocs'

export default createAnthrodocsPage('docs/swagger.yaml')
```

一行代码即可。`createAnthrodocsPage` 接收相对于项目根目录的 YAML 路径，服务端解析并渲染完整文档。

---

### 远程 YAML（ISR）

```tsx
import { Anthrodocs, parseSpecFromString } from 'anthrodocs'

export default async function DocsPage() {
  const res = await fetch('https://api.example.com/swagger.yaml', {
    next: { revalidate: 3600 },
  })
  return <Anthrodocs initialDoc={parseSpecFromString(await res.text())} yaml={await res.text()} />
}
```

### 手动读取本地文件

```tsx
import { Anthrodocs, parseSpecFromString } from 'anthrodocs'
import { readFileSync } from 'fs'
import path from 'path'

export default async function DocsPage() {
  const yamlPath = path.join(process.cwd(), 'docs/swagger.yaml')
  const yaml = readFileSync(yamlPath, 'utf-8')
  return <Anthrodocs initialDoc={parseSpecFromString(yaml)} yaml={yaml} />
}
```

### 多版本文档

```
app/docs/v1/page.tsx → createAnthrodocsPage('docs/v1/swagger.yaml')
app/docs/v2/page.tsx → createAnthrodocsPage('docs/v2/swagger.yaml')
```

## 样式配置

### 导入 CSS

```tsx
// app/layout.tsx
import 'anthrodocs/styles.css'
```

### Tailwind

```ts
// tailwind.config.ts
export default {
  content: [
    './node_modules/anthrodocs/**/*.js',
    // ...
  ],
}
```

### 根布局

组件内部使用 `h-screen overflow-hidden`，无需额外处理：

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
```

## API

### `<Anthrodocs>`

主组件。服务端渲染，客户端提供交互（拖拽分栏、YAML 同步、端点导航）。

| 属性 | 类型 | 说明 |
|------|------|------|
| `initialDoc` | `ApiDoc \| null` | 解析后的文档 |
| `yaml` | `string` | 原始 YAML 字符串 |

### `createAnthrodocsPage(yamlPath: string): React.FC`

高阶函数，返回一个可直接作为 `page.tsx` 默认导出的组件。`yamlPath` 相对于 `process.cwd()`。

### `parseSpecFromString(yaml: string): ApiDoc`

解析 YAML / JSON 字符串为 `ApiDoc` 对象。浏览器安全，无 `fs` 依赖。

### 独立组件

| 组件 | 说明 |
|------|------|
| `YamlViewer` | 只读 YAML 源码，支持行高亮与自动滚动 |
| `DocPreview` | 文档预览区，渲染所有端点 |
| `SidebarNav` | 端点导航，点击跳转 + 滚动高亮同步 |
| `EndpointCard` | 单个端点（方法、路径、参数、响应） |
| `SchemaTree` | Redoc 风格的 Schema 递归树 |
| `ParametersTable` | 参数表格 |
| `JsonExample` | 基于 Schema 自动生成示例 JSON |

### 组件 Props

#### `YamlViewer`

| 属性 | 类型 | 说明 |
|------|------|------|
| `value` | `string` | YAML 内容 |
| `highlightLine` | `number \| null` | 高亮行号（0-based） |

#### `SidebarNav`

| 属性 | 类型 | 说明 |
|------|------|------|
| `endpoints` | `Endpoint[]` | 端点列表 |
| `scrollTop` | `number` | 预览区滚动位置 |
| `onEndpointClick` | `(idx: number) => void` | 点击端点回调 |
| `onActiveChange` | `(idx: number) => void` | 当前激活端点变化回调 |

#### `EndpointCard`

| 属性 | 类型 | 说明 |
|------|------|------|
| `endpoint` | `Endpoint` | 端点数据 |
| `index` | `number` | 端点序号 |

#### `SchemaTree`

| 属性 | 类型 | 说明 |
|------|------|------|
| `nodes` | `SchemaNode[]` | Schema 节点数组 |
| `depth` | `number` | 当前缩进层级 |

#### `ParametersTable`

| 属性 | 类型 | 说明 |
|------|------|------|
| `params` | `Parameter[]` | 参数数组 |

#### `JsonExample`

| 属性 | 类型 | 说明 |
|------|------|------|
| `nodes` | `SchemaNode[]` | Schema 节点数组 |

### 工具函数

```ts
import { findEndpointLines, groupParamsByIn } from 'anthrodocs'

// 将端点映射到 YAML 行号（用于同步高亮）
const lineMap = findEndpointLines(yaml, doc.endpoints)

// 按参数位置分组（path / query / header）
const grouped = groupParamsByIn(endpoint.parameters)
```

### 类型

```ts
import type {
  ApiDoc,       // 解析后的文档根对象
  Endpoint,      // 单个端点
  Parameter,     // 参数
  Response,      // 响应
  RequestBody,   // 请求体
  SchemaNode,    // Schema 树节点
  SecurityDef,   // 安全定义
} from 'anthrodocs'
```

完整类型定义：

```ts
interface ApiDoc {
  title: string
  version: string
  description: string
  baseUrl: string
  security: SecurityDef[]
  endpoints: Endpoint[]
}

interface Endpoint {
  method: string
  path: string
  summary: string
  description: string
  parameters: Parameter[]
  requestBody: RequestBody | null
  responses: Response[]
  yamlLine?: number
}

interface Parameter {
  name: string
  in: string
  type: string
  required: boolean
  description: string
  format?: string
}

interface Response {
  status: string
  description: string
  schema: Record<string, unknown> | null
  schemaTree?: SchemaNode[] | null
  isEmpty: boolean
}

interface RequestBody {
  contentType: string
  schema: Record<string, unknown> | null
  schemaTree: SchemaNode[] | null
}

interface SchemaNode {
  name: string
  type: string
  subType?: string
  required: boolean
  description: string
  enum?: string[]
  default?: string
  format?: string
  children?: SchemaNode[]
  variants?: SchemaNode[]
}

interface SecurityDef {
  type: string
  name: string
  in: string
}
```

## 特性

- 左右分栏：YAML 源码（可拖拽调节宽度）+ 文档预览 + 端点导航
- 全部端点平铺展开，滚动浏览
- Redoc 风格 Schema 树（类型着色、必填标记、层级折叠、`oneOf` 变体）
- 基于 Schema 自动生成 JSON 示例
- 端点与 YAML 源码双向同步（点击/滚动时自动跳转）
- 滚动条默认透明，hover 时显示
- SSR 优先，服务端解析 YAML 并渲染
- 支持 Swagger 2.0 / OpenAPI 3.x

## 常见问题

**样式不生效？** 确保已导入 `anthrodocs/styles.css` 且 Tailwind `content` 包含 `./node_modules/anthrodocs/**/*.js`。

**YAML 文件找不到？** `createAnthrodocsPage` 的路径相对于 `process.cwd()`（项目根目录），不是页面文件所在目录。

**pnpm 报错？** 创建 `.npmrc`：

```
public-hoist-pattern[]=anthrodocs
```

## 开发

```bash
git clone https://github.com/iiihzy/anthrodocs.git
cd anthrodocs
npm install
npm run dev          # http://localhost:3333
npm run build:lib    # 编译 lib 输出到 dist/
```

通过环境变量指定 YAML 文件：

```bash
SWAGGER_FILE=/path/to/swagger.yaml npm run dev
```

## License

MIT