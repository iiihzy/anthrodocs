"use client";

import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      const html = await codeToHtml(code, {
        lang: language,
        theme: "github-dark",
        transformers: [
          {
            pre(node) {
              node.properties.class =
                "m-0 overflow-x-auto p-4 text-sm leading-relaxed";
            },
            code(node) {
              node.properties.class = "font-mono";
            },
          },
        ],
      });
      setHighlightedCode(html);
    };
    highlight();
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLanguage = language === "text" ? "" : language;

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-black/10 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-xs font-medium text-white/70">{filename}</span>
          )}
          {displayLanguage && !filename && (
            <span className="text-xs font-medium text-white/50 uppercase">
              {displayLanguage}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={copied ? "已复制" : "复制代码"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative">
        {showLineNumbers ? (
          <div className="flex">
            {/* Line Numbers */}
            <div className="select-none border-r border-white/10 bg-white/5 py-4 pr-3 pl-4 text-right">
              {code.split("\n").map((_, i) => (
                <div
                  key={i}
                  className="font-mono text-xs leading-relaxed text-white/30"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Code */}
            <div
              className="flex-1 overflow-x-auto py-4 pl-4"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>
        ) : (
          <div
            className="overflow-x-auto py-4 px-4"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        )}
      </div>
    </div>
  );
}

// 内联代码样式组件
export function InlineCode({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm text-black/90 dark:bg-white/10 dark:text-white/90">
      {children}
    </code>
  );
}
