import { notFound } from "next/navigation";
import { readFileSync, readdirSync } from 'fs'
import { resolve, join, relative } from 'path'
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx-content";
import { getAllDocs, getDocBySlug, getDocsByGroup } from "@/lib/docs-utils";
import { parseSpecFromString } from 'anthrodocs/server'
import { serialize } from 'next-mdx-remote/serialize'
import { ApiDocsClient } from '../api-docs-client'
import MdxDocViewer from '../mdx-doc-viewer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxOptions: Record<string, any> = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: true,
        },
      ],
    ],
  },
};

// Generate static params
export async function generateStaticParams() {
  const docs = await getAllDocs();
  return [
    { slug: [] },
    ...docs.map((doc) => ({
      slug: doc.slug.split("/"),
    })),
  ];
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const slugStr = slug.join("/");

  if (!slugStr) {
    return {
      title: "Documentation - TokenGO Docs",
      description: "TokenGO developer guides and API reference documentation",
      alternates: { canonical: "/docs" },
      openGraph: {
        title: "Documentation - TokenGO Docs",
        description: "TokenGO developer guides and API reference documentation",
        type: "website",
        url: "/docs"
      },
      twitter: {
        card: "summary",
        title: "Documentation - TokenGO Docs",
        description: "TokenGO developer guides and API reference documentation"
      }
    };
  }

  const doc = await getDocBySlug(slugStr);

  if (!doc) {
    return { title: "Not Found" };
  }

  const canonical = `/docs/${slugStr}`;
  return {
    title: `${doc.title} - TokenGO Docs`,
    description: doc.description,
    alternates: { canonical },
    openGraph: {
      title: `${doc.title} - TokenGO Docs`,
      description: doc.description,
      type: "article",
      url: canonical
    },
    twitter: {
      card: "summary",
      title: `${doc.title} - TokenGO Docs`,
      description: doc.description
    }
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const slugStr = slug.join("/");

  if (!slugStr) {
    return <ApiDocsHomePage />;
  }

  const doc = await getDocBySlug(slugStr);

  if (!doc) {
    notFound();
  }

let rawSource: string
  try {
    rawSource = readFileSync(
      resolve(process.cwd(), 'content', 'docs', `${slugStr}.mdx`),
      'utf-8'
    )
  } catch {
    rawSource = readFileSync(
      resolve(process.cwd(), 'content', 'docs', `${slugStr}.md`),
      'utf-8'
    )
  }

  const groupedDocs = await getDocsByGroup()
  const groupOrder = ["Documentation", "API Reference", "Guides", "FAQ"]
  const groups = Object.entries(groupedDocs)
    .sort((a, b) => {
      const ai = groupOrder.indexOf(a[0])
      const bi = groupOrder.indexOf(b[0])
      if (ai === -1 && bi === -1) return a[0].localeCompare(b[0])
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
    .map(([name, files]) => ({
      name,
      files: files.map((f) => ({ title: f.title, slug: f.slug })),
    }))

  return (
    <div className="h-[calc(100dvh-4rem)]">
      <div className="mx-auto max-w-[1400px] h-full">
        <div className="h-full flex flex-col min-h-0">
          <MdxDocViewer
            groups={groups}
            currentSlug={doc.slug}
            rawSource={rawSource}
            title={doc.title}
            description={doc.description}
          >
            <MDXRemote source={doc.content} components={mdxComponents} options={mdxOptions} />
          </MdxDocViewer>
        </div>
      </div>
    </div>
  );
}

type FileTreeItem = {
  name: string
  path: string
  type: 'dir' | 'file'
  children?: FileTreeItem[]
}

function scanDir(dir: string, baseDir: string): FileTreeItem[] {
  const items: FileTreeItem[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const fullPath = join(dir, entry.name)
    const relPath = relative(baseDir, fullPath).replace(/\\/g, '/')

    if (entry.isDirectory()) {
      const children = scanDir(fullPath, baseDir).filter(
        (c) => c.type === 'dir' || c.type === 'file'
      )
      if (children.length > 0) {
        items.push({ name: entry.name, path: relPath, type: 'dir', children })
      }
    } else if (entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml') || entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
      items.push({ name: entry.name, path: relPath, type: 'file' })
    }
  }

  items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  return items
}

function flattenFiles(tree: FileTreeItem[]): FileTreeItem[] {
  const result: FileTreeItem[] = []
  for (const item of tree) {
    if (item.type === 'file') {
      result.push(item)
    }
    if (item.children) {
      result.push(...flattenFiles(item.children))
    }
  }
  return result
}

async function ApiDocsHomePage() {
  const docsDir = resolve(process.cwd(), 'content', 'docs')
  const tree = scanDir(docsDir, docsDir)
  const allFiles = flattenFiles(tree)

  const yamlFiles = allFiles.filter(f => f.path.endsWith('.yaml') || f.path.endsWith('.yml'))
  const fileDocs: Record<string, { doc: ReturnType<typeof parseSpecFromString>; yaml: string }> = {}
  for (const file of yamlFiles) {
    const yaml = readFileSync(resolve(docsDir, file.path), 'utf-8')
    fileDocs[file.path] = { doc: parseSpecFromString(yaml), yaml }
  }

  const mdxFiles = allFiles.filter(f => f.path.endsWith('.mdx') || f.path.endsWith('.md'))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mdxSerialized: Record<string, any> = {}
  const mdxSources: Record<string, string> = {}
  for (const file of mdxFiles) {
    const source = readFileSync(resolve(docsDir, file.path), 'utf-8')
    mdxSources[file.path] = source
    try {
      mdxSerialized[file.path] = await serialize(source, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark', keepBackground: true }]],
        },
      })
    } catch (e) {
      console.error('Error serializing MDX:', file.path, e)
    }
  }

  const defaultFile = yamlFiles[0]?.path || ''

  return (
    <div className="h-[calc(100dvh-4rem)]">
      <div className="mx-auto max-w-[1400px] h-full">
        <div className="h-full flex flex-col min-h-0">
          <ApiDocsClient fileDocs={fileDocs} mdxSerialized={mdxSerialized} mdxSources={mdxSources} tree={tree} defaultFile={defaultFile} />
        </div>
      </div>
    </div>
  )
}
