import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface Doc {
  title: string;
  description?: string;
  order: number;
  group?: string;
  status: "draft" | "published" | "deprecated";
  slug: string;
  content: string;
}

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

// 读取所有文档
export async function getAllDocs(): Promise<Doc[]> {
  const docs: Doc[] = [];

  async function scanDir(dir: string, relativePath: string = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativeName = relativePath ? path.join(relativePath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        await scanDir(fullPath, relativeName);
      } else if (entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))) {
        const content = await fs.readFile(fullPath, "utf-8");
        const { data, content: mdxContent } = matter(content);

        const slugBase = relativeName.replace(/\\/g, "/").replace(/\.(mdx|md)$/, "");

        docs.push({
          title: data.title || slugBase,
          description: data.description,
          order: data.order ?? 999,
          group: data.group,
          status: data.status || "published",
          slug: slugBase,
          content: mdxContent,
        });
      }
    }
  }

  try {
    await scanDir(DOCS_DIR);
  } catch (error) {
    console.error("Error reading docs:", error);
  }

  return docs;
}

// 根据 slug 获取单个文档
export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const docs = await getAllDocs();
  return docs.find((doc) => doc.slug === slug) || null;
}

// 获取按组组织的文档
export async function getDocsByGroup(): Promise<Record<string, Doc[]>> {
  const docs = await getAllDocs();
  const grouped: Record<string, Doc[]> = {};

  // 按 group 分组
  for (const doc of docs) {
    const group = doc.group || "Other";
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(doc);
  }

  // 每组内按 order 排序
  for (const group of Object.keys(grouped)) {
    grouped[group].sort((a, b) => a.order - b.order);
  }

  return grouped;
}
