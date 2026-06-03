# Anthrodocs

Redoc 风格的 API 文档渲染组件 — 专为 Next.js SSR 设计。

[![npm version](https://img.shields.io/npm/v/anthrodocs)](https://www.npmjs.com/package/anthrodocs)
[![license](https://img.shields.io/npm/l/anthrodocs)](https://github.com/iiihzy/anthrodocs/blob/main/LICENSE)

支持 Swagger 2.0 和 OpenAPI 3.x，亮色主题，左右分栏布局（YAML 源码 + 文档预览）。

## 安装

```bash
npm install anthrodocs
```

依赖 `next` / `react` / `react-dom`（作为 peerDependencies，你的 Next.js 项目已自带）。

## 快速开始

### 方式 1: 一行代码（推荐）

```tsx
// app/docs/page.tsx
import { createAnthrodocsPage } from 'anthrodocs'

export default createAnthrodocsPage('docs/swagger.yaml')
```

### 方式 2: 自定义数据获取

```tsx
// app/docs/page.tsx
import { Anthrodocs, parseSpecFromString } from 'anthrodocs'
import fs from 'fs'
import path from 'path'

export default async function DocsPage() {
  const yamlPath = path.join(process.cwd(), 'docs', 'swagger.yaml')
  const yaml = fs.readFileSync(yamlPath, 'utf-8')
  const doc = parseSpecFromString(yaml)

  return <Anthrodocs initialDoc={doc} yaml={yaml} />
}
```

### 方式 3: 远程 YAML（ISR）

```tsx
// app/docs/page.tsx
import { Anthrodocs, parseSpecFromString } from 'anthrodocs'

export default async function DocsPage() {
  const res = await fetch('https://api.example.com/swagger.yaml', {
    next: { revalidate: 3600 },
  })
  const yaml = await res.text()
  const doc = parseSpecFromString(yaml)

  return <Anthrodocs initialDoc={doc} yaml={yaml} />
}
```

### 方式 4: 多页面路由

如果需要为不同版本的 API 文档创建多个路由：

```tsx
// app/docs/v1/page.tsx
export { default } from 'app/docs/v2/page' // 或使用 createAnthrodocsPage
```

## 样式配置

### 导入 CSS

```tsx
// app/layout.tsx
import 'anthrodocs/styles.css'
```

### 配置 Tailwind 扫描路径

确保 `tailwind.config.ts` 的 `content` 包含组件文件：

```ts
// tailwind.config.ts
export default {
  content: [
    './node_modules/anthrodocs/**/*.{ts,tsx}',
    // ... 你的其他路径
  ],
}
```

### 根布局

Anthrodocs 内部使用 `h-screen overflow-hidden` 锁定视口。页面组件会自动处理布局，无需额外配置：

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

## API 参考

### `parseSpecFromString(yaml: string): ApiDoc`

解析 YAML / JSON 字符串，返回标准化的中间表示（IR）。

```ts
import { parseSpecFromString } from 'anthrodocs'

const doc = parseSpecFromString(yamlString)
// doc: { title, version, description, baseUrl, security, endpoints }
```

### `createAnthrodocsPage(yamlPath: string): React.FC`

工厂函数，生成可直接导出的 Next.js 页面组件。

| 参数 | 类型 | 说明 |
|------|------|------|
| `yamlPath` | `string` | 相对于项目根目录的 YAML 文件路径 |

```ts
createAnthrodocsPage('docs/api.yaml')
// 等价于 path.join(process.cwd(), 'docs/api.yaml')
```

### `<Anthrodocs>`

主渲染组件。

| 属性 | 类型 | 说明 |
|------|------|------|
| `initialDoc` | `ApiDoc \| null` | 解析后的文档对象 |
| `yaml` | `string` | 原始 YAML 字符串 |

### 独立组件

如需自定义布局，可单独导入组件：

```ts
import {
  YamlViewer,      // 只读 YAML 源码展示（支持行高亮）
  DocPreview,      // 文档预览（端点列表 + Schema 树）
  SidebarNav,      // 端点导航（点击跳转 + 滚动同步）
  EndpointCard,    // 单个端点卡片
  SchemaTree,      // Redoc 风格 Schema 树形展开
  ParametersTable, // 参数表格
  JsonExample,     // 基于 Schema 的 JSON 示例生成器
} from 'anthrodocs'
```

### 工具函数

```ts
import { findEndpointLines, groupParamsByIn } from 'anthrodocs'

// 查找每个端点在 YAML 中对应的行号
const lineMap = findEndpointLines(yaml, doc.endpoints)

// 按参数位置分组（path / query / header）
const grouped = groupParamsByIn(endpoint.parameters)
```

### 类型导出

```ts
import type {
  ApiDoc,
  Endpoint,
  Parameter,
  Response,
  SchemaNode,
  SecurityDef,
  RequestBody,
} from 'anthrodocs'
```

## 特性

- **左右分栏**：YAML 源码（可拖拽调节宽度）+ 文档预览 + 端点导航
- **端点平铺**：所有端点全部展开，通过滚动浏览
- **Schema 树形**：Redoc 风格（类型着色、必填标记、多层级折叠、oneOf 变体）
- **JSON 示例**：根据 Schema 自动生成示例 payload
- **YAML 同步**：点击端点或滚动文档时，YAML 面板自动跳转到对应位置
- **悬停滚动条**：默认透明，hover 时显示
- **SSR 优先**：服务端解析 YAML 并渲染，首屏无闪烁
- 支持 Swagger 2.0 和 OpenAPI 3.x

## 常见问题

### 样式不生效？

确保 Tailwind 的 `content` 配置包含 `anthrodocs` 的路径，且已导入 `anthrodocs/styles.css`。

### YAML 文件找不到？

`createAnthrodocsPage` 从 `process.cwd()` 解析相对路径。确保文件路径相对于项目根目录，而非页面文件所在目录。

### 报错 "Cannot find module 'anthrodocs'"？

检查 `node_modules` 中是否已安装。如果使用 pnpm，可能需要配置 `.npmrc`：

```
public-hoist-pattern[]=anthrodocs
```

## 开发

```bash
git clone https://github.com/iiihzy/anthrodocs.git
cd anthrodocs
npm install
npm run dev     # http://localhost:3333
npm run build   # 生产构建
```

默认读取项目根目录 `../swagger.yaml`。可通过环境变量指定：

```bash
SWAGGER_FILE=/path/to/your/swagger.yaml npm run dev
```

## License

MIT