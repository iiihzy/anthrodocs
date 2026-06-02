# Anthrodocs

Redoc 风格的 API 文档渲染组件 — 专为 Next.js SSR 设计。

支持 Swagger 2.0 和 OpenAPI 3.x，亮色主题，左右分栏布局（YAML 源码 + 文档预览）。

## 安装

```bash
npm install anthrodocs
```

依赖 `next` / `react` / `react-dom`（作为 peerDependencies，你的 Next.js 项目已自带）。

## 快速开始

### 方式 1: 一行代码

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

async function fetchSpec(url: string) {
  const res = await fetch(url, { next: { revalidate: 3600 } })
  return res.text()
}

export default async function DocsPage() {
  const yaml = await fetchSpec('https://api.example.com/swagger.yaml')
  const doc = parseSpecFromString(yaml)

  return <Anthrodocs initialDoc={doc} yaml={yaml} />
}
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

### 根布局要求

Anthrodocs 使用 `h-screen overflow-hidden` 锁定视口。确保你的根 `layout.tsx` 中 body 留空或不冲突：

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

`createAnthrodocsPage` 和 `Anthrodocs` 会自动在内部设置 `h-screen flex flex-col overflow-hidden`。

## API

### `parseSpecFromString(yaml: string): ApiDoc`

解析 YAML/JSON 字符串，返回标准化 IR。

```ts
import { parseSpecFromString } from 'anthrodocs'

const doc = parseSpecFromString(yamlString)
// doc.title, doc.version, doc.endpoints ...
```

### `<Anthrodocs>`

主渲染组件。Props：

| 属性 | 类型 | 说明 |
|------|------|------|
| `initialDoc` | `ApiDoc \| null` | 解析后的文档对象 |
| `yaml` | `string` | 原始 YAML 字符串 |

### `createAnthrodocsPage(yamlPath: string)`

工厂函数，生成可直接导出的 Next.js 页面组件。`yamlPath` 为项目根目录下的相对路径。

```ts
createAnthrodocsPage('docs/api.yaml')
// 等价于 process.cwd() + '/docs/api.yaml'
```

### 独立组件

如需自定义布局，可单独导入组件：

```ts
import { YamlViewer, DocPreview, SidebarNav } from 'anthrodocs'
```

## 特性

- 左右分栏：YAML 源码（可调节宽度）+ 文档预览 + 端点导航
- 端点全部平铺展示，通过滚动浏览
- Redoc 风格 Schema 树形展开（类型着色、必填标记、多层级折叠、oneOf 变体）
- JSON 示例自动生成（根据 Schema 推导示例值）
- 端点导航点击 / 滚动时 YAML 面板自动同步
- 悬停滚动条（默认透明，hover 显示）
- 支持 Swagger 2.0 和 OpenAPI 3.x

## 开发

```bash
cd web
npm install
npm run dev     # http://localhost:3333
npm run build   # 生产构建
npm start       # 生产运行
```

默认读取项目根目录 `../swagger.yaml`。可通过环境变量指定：

```bash
SWAGGER_FILE=/path/to/your/swagger.yaml npm run dev
```

## License

MIT