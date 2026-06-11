import type { MDXComponents } from "mdx/types";

// ─── Callout 组件 ────────────────────────────────────────────────
type CalloutType = "info" | "warning" | "error" | "success" | "tip";

const calloutStyles: Record<CalloutType, { border: string; bg: string; icon: string; title: string }> = {
  info:    { border: "border-sky-500/40",    bg: "bg-sky-50",       icon: "i", title: "Info" },
  warning: { border: "border-amber-500/40",  bg: "bg-amber-50",     icon: "!", title: "Warning" },
  error:   { border: "border-red-500/40",    bg: "bg-red-50",       icon: "x", title: "Error" },
  success: { border: "border-emerald-500/40",bg: "bg-emerald-50",   icon: "✓",title: "Success" },
  tip:     { border: "border-violet-500/40", bg: "bg-violet-50",    icon: "→",title: "Tip" },
};

function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const s = calloutStyles[type];
  return (
    <div className={`my-5 rounded-none border ${s.border} ${s.bg} px-4 py-3`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-black/70">
        {title || s.title}
      </p>
      <div className="text-sm leading-relaxed text-black/80">{children}</div>
    </div>
  );
}

// ─── Steps 组件 ──────────────────────────────────────────────────
function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 border-l-2 border-black/15 pl-6 [counter-reset:step]">
      {children}
    </div>
  );
}

function Step({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="relative mb-6 last:mb-0">
      <div className="absolute -left-[33px] top-0.5 flex h-5 w-5 items-center justify-center rounded-none border border-black/20 bg-[#eaf2ef] text-[10px] font-bold text-black/60 [counter-increment:step] before:content-[counter(step)]" />
      <h4 className="mb-1 text-sm font-semibold text-black">{title}</h4>
      <div className="text-sm leading-relaxed text-black/75">{children}</div>
    </div>
  );
}

// ─── FileTree 组件 ───────────────────────────────────────────────
function FileTree({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-none border border-black/15 bg-white/70 px-4 py-3 font-mono text-sm">
      {children}
    </div>
  );
}

function File({
  name,
  highlight,
}: {
  name: string;
  highlight?: boolean;
}) {
  return (
    <div className={`py-0.5 pl-4 ${highlight ? "font-semibold text-[#B3001B]" : "text-black/80"}`}>
      {name}
    </div>
  );
}

function Folder({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="text-black/80">
      <div className="py-0.5 font-semibold">{name}/</div>
      <div className="pl-4">{children}</div>
    </div>
  );
}

// ─── MDX 组件映射 ────────────────────────────────────────────────
export const mdxComponents: MDXComponents = {
  // ── 标题 ──
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-4 mt-10 text-3xl font-bold tracking-tight text-black" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-3 mt-10 border-b border-black/10 pb-2 text-xl font-semibold tracking-tight text-[#00205c]" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-2 mt-8 text-lg font-semibold text-black" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mb-2 mt-6 text-base font-semibold text-black/90" {...props} />
  ),

  // ── 段落和文本 ──
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-[0.94rem] leading-7 text-black/80" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-black" {...props} />
  ),

  // ── 列表 ──
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-6 marker:text-black/30" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-6 marker:text-black/40 marker:font-semibold" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[0.94rem] leading-relaxed text-black/80" {...props} />
  ),

  // ── 内联代码 ──
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded-none border border-black/15 bg-black/[0.04] px-1.5 py-0.5 font-mono text-[0.88em] text-[#B3001B]" {...props} />
  ),

  // ── 代码块 (rehype-pretty-code 兼容) ──
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // rehype-pretty-code 会生成带 style 属性的 <pre>，保留其内联样式
    const hasStyle = !!props.style;
    if (hasStyle) {
      // 来自 rehype-pretty-code 的代码块 — 仅加外层容器
      return (
        <div className="group relative my-6 overflow-hidden rounded-none border border-black/15">
          <div className="overflow-x-auto p-0">
            <pre className="m-0 overflow-visible p-4 font-mono text-sm leading-relaxed" {...props}>
              {children}
            </pre>
          </div>
        </div>
      );
    }
    // 普通代码块回退
    return (
      <div className="group relative my-6 overflow-hidden rounded-none border border-black/15 bg-[#18181C]">
        <div className="overflow-x-auto p-4">
          <pre className="m-0 overflow-visible bg-transparent p-0 font-mono text-sm leading-relaxed text-white/90" {...props}>
            {children}
          </pre>
        </div>
      </div>
    );
  },

  // ── 引用块 ──
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 border-l-2 border-[#00205c]/40 bg-[#eaf2ef]/50 py-3 pl-4 pr-3 text-[0.94rem] italic leading-relaxed text-black/70" {...props} />
  ),

  // ── 表格 ──
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-none border border-black/15">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-black/15 bg-[#eaf2ef]" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-black" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-black/8 px-4 py-3 text-black/80" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="transition-colors even:bg-black/[0.015] hover:bg-black/[0.03] [&:last-child_td]:border-b-0" {...props} />
  ),

  // ── 链接 ──
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-[#B3001B] no-underline hover:underline" {...props} />
  ),

  // ── 分割线 ──
  hr: () => <hr className="my-8 border-black/10" />,

  // ── 图片 ──
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="my-6 rounded-none border border-black/15" {...props} />
  ),

  // ── 自定义 MDX 组件 ──
  Callout,
  Steps,
  Step,
  FileTree,
  File,
  Folder,
};
