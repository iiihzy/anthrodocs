"use client";
import {
  parseSpecFromString
} from "./chunk-A77TFQ7H.js";

// components/AppLayout.tsx
import { useRef as useRef3, useState as useState5, useMemo, useCallback as useCallback2, useEffect as useEffect4 } from "react";

// lib/utils.ts
function groupParamsByIn(params) {
  const groups = {};
  for (const p of params) {
    if (!groups[p.in]) groups[p.in] = [];
    groups[p.in].push(p);
  }
  return groups;
}
function findEndpointLines(yaml, endpoints) {
  const lines = yaml.split("\n");
  const map = /* @__PURE__ */ new Map();
  for (let i = 0; i < endpoints.length; i++) {
    const ep = endpoints[i];
    for (let j = 0; j < lines.length; j++) {
      const trimmed = lines[j].trimEnd();
      const indent = trimmed.length - trimmed.trimStart().length;
      if (indent > 0 && trimmed.trimStart() === `${ep.path}:` || trimmed.trimStart().startsWith(`${ep.path}: `)) {
        const pathIndent = indent;
        for (let k = j + 1; k < lines.length; k++) {
          const t = lines[k].trimEnd();
          const ki = t.length - t.trimStart().length;
          if (ki <= pathIndent) break;
          if (t.trimStart().startsWith(`${ep.method}:`)) {
            map.set(i, k);
            break;
          }
        }
        break;
      }
    }
  }
  return map;
}

// lib/copy-md.ts
function groupParamsByIn2(params) {
  const groups = {};
  for (const p of params) {
    if (!groups[p.in]) groups[p.in] = [];
    groups[p.in].push(p);
  }
  return groups;
}
function sampleValue(node) {
  if (node.enum && node.enum.length > 0) return node.enum[0];
  if (node.default !== void 0) {
    if (node.type === "integer" || node.type === "number") return Number(node.default);
    if (node.type === "boolean") return node.default === "true";
    return node.default;
  }
  switch (node.type) {
    case "string":
      return "string";
    case "integer":
      return 0;
    case "number":
      return 0;
    case "boolean":
      return true;
    case "array":
      if (node.children && node.children.length > 0) {
        const childObj = {};
        for (const child of node.children) {
          childObj[child.name] = sampleValue(child);
        }
        return [childObj];
      }
      return ["string"];
    case "object": {
      const obj = {};
      if (node.children) {
        for (const child of node.children) {
          obj[child.name] = sampleValue(child);
        }
      }
      return obj;
    }
    default:
      return null;
  }
}
function buildSample(tree) {
  if (tree.length === 1 && tree[0].type === "object") {
    return sampleValue(tree[0]);
  }
  return tree.map((n) => ({ [n.name]: sampleValue(n) }));
}
function generateExampleJson(tree) {
  if (!tree || tree.length === 0) return "{}";
  return JSON.stringify(buildSample(tree), null, 2);
}
var PARAM_LABELS = {
  path: "Path Parameters",
  query: "Query Parameters",
  header: "Header Parameters"
};
function renderParametersTable(params) {
  const lines = [];
  lines.push("| \u53C2\u6570\u540D | \u7C7B\u578B | \u5FC5\u586B | \u63CF\u8FF0 |");
  lines.push("|--------|------|------|------|");
  for (const p of params) {
    const desc = (p.description || "\u2014").replace(/\|/g, "\\|");
    lines.push(`| \`${p.name}\` | ${p.type || "string"} | ${p.required ? "\u662F" : "\u5426"} | ${desc} |`);
  }
  return lines;
}
function renderEndpointMarkdown(ep, baseUrl) {
  const lines = [];
  const title = ep.summary || `${ep.method.toUpperCase()} ${ep.path}`;
  lines.push(`## ${title}`);
  lines.push("");
  lines.push(`\`${ep.method.toUpperCase()}\` \`${ep.path}\``);
  lines.push("");
  if (ep.description && ep.description !== ep.summary) {
    lines.push(ep.description);
    lines.push("");
  }
  const nonBody = ep.parameters.filter((p) => p.in !== "formData" && p.in !== "body");
  const grouped = groupParamsByIn2(nonBody);
  if (Object.keys(grouped).length > 0 || ep.requestBody) {
    lines.push("### \u8BF7\u6C42\u53C2\u6570");
    lines.push("");
    for (const [loc, params] of Object.entries(grouped)) {
      const label = PARAM_LABELS[loc] || `${loc} Parameters`;
      lines.push(`#### ${label}`);
      lines.push("");
      lines.push(...renderParametersTable(params));
      lines.push("");
    }
    if (ep.requestBody) {
      const formParams = ep.parameters.filter((p) => p.in === "formData");
      if (formParams.length > 0) {
        lines.push("#### Form Data");
        lines.push("");
        lines.push(...renderParametersTable(formParams));
        lines.push("");
      } else {
        const ct = ep.requestBody.contentType || "application/json";
        lines.push(`\u8BF7\u6C42\u4F53\u7C7B\u578B: \`${ct}\``);
        lines.push("");
      }
    }
  }
  lines.push("### \u8BF7\u6C42\u793A\u4F8B");
  lines.push("");
  lines.push("```bash");
  lines.push(`curl -X ${ep.method.toUpperCase()} ${baseUrl}${ep.path}`);
  lines.push("```");
  lines.push("");
  if (ep.responses && ep.responses.length > 0) {
    lines.push("### \u54CD\u5E94");
    lines.push("");
    for (const resp of ep.responses) {
      lines.push(`**Status**: ${resp.status}`);
      if (resp.description) {
        lines.push("");
        lines.push(resp.description);
      }
      lines.push("");
      lines.push("```json");
      lines.push(generateExampleJson(resp.schemaTree));
      lines.push("```");
      lines.push("");
    }
  }
  return lines;
}
function generateMarkdownFromDoc(doc) {
  const lines = [];
  lines.push(`# ${doc.title} v${doc.version}`);
  lines.push("");
  lines.push(`> **Base URL**: \`${doc.baseUrl}\``);
  if (doc.security && doc.security.length > 0) {
    const authStr = doc.security.map((s) => `\`${s.name}\``).join(", ");
    lines.push(`> **\u8BA4\u8BC1\u65B9\u5F0F**: ${authStr}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  for (let i = 0; i < doc.endpoints.length; i++) {
    lines.push(...renderEndpointMarkdown(doc.endpoints[i], doc.baseUrl));
    if (i < doc.endpoints.length - 1) {
      lines.push("");
    }
  }
  return lines.join("\n") + "\n";
}
function renderEndpointText(ep, baseUrl) {
  const lines = [];
  const title = ep.summary || `${ep.method.toUpperCase()} ${ep.path}`;
  lines.push(`${ep.method.toUpperCase()} ${ep.path}`);
  lines.push(title);
  lines.push("");
  if (ep.description && ep.description !== ep.summary) {
    lines.push(ep.description);
    lines.push("");
  }
  const nonBody = ep.parameters.filter((p) => p.in !== "formData" && p.in !== "body");
  const grouped = groupParamsByIn2(nonBody);
  if (Object.keys(grouped).length > 0) {
    lines.push("\u8BF7\u6C42\u53C2\u6570");
    lines.push("");
    for (const [loc, params] of Object.entries(grouped)) {
      const label = PARAM_LABELS[loc] || loc;
      lines.push(`  ${label}`);
      for (const p of params) {
        const desc = p.description || "\u2014";
        lines.push(`    ${p.name}  ${p.type || "string"}  ${p.required ? "\u662F" : "\u5426"}  ${desc}`);
      }
      lines.push("");
    }
  }
  if (ep.responses && ep.responses.length > 0) {
    lines.push("\u54CD\u5E94");
    lines.push("");
    for (const resp of ep.responses) {
      lines.push(`  ${resp.status}${resp.description ? "  " + resp.description : ""}`);
      const example = generateExampleJson(resp.schemaTree);
      lines.push(`  ${example.replace(/\n/g, "\n  ")}`);
      lines.push("");
    }
  }
  return lines;
}
function generatePageText(doc) {
  const lines = [];
  lines.push(`${doc.title} v${doc.version}`);
  lines.push(`Base URL: ${doc.baseUrl}`);
  lines.push("");
  for (const ep of doc.endpoints) {
    lines.push(...renderEndpointText(ep, doc.baseUrl));
  }
  return lines.join("\n");
}

// components/YamlViewer.tsx
import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
function YamlViewer({ value, highlightLine }) {
  const containerRef = useRef(null);
  const lines = value.split("\n");
  useEffect(() => {
    if (highlightLine == null || !containerRef.current) return;
    const el = containerRef.current.querySelector(`[data-yaml-line="${highlightLine}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightLine]);
  return /* @__PURE__ */ jsx("div", { ref: containerRef, className: "flex-1 min-h-0 overflow-auto bg-black/[0.02] scroll-area", children: /* @__PURE__ */ jsx("pre", { className: "p-4 text-xs font-mono leading-relaxed text-black/70 select-text whitespace-pre", children: lines.map((line, i) => /* @__PURE__ */ jsx(
    "div",
    {
      "data-yaml-line": i,
      className: `${highlightLine === i ? "bg-black/10 -mx-4 px-4" : ""}`,
      children: line
    },
    i
  )) }) });
}

// components/DocPreview.tsx
import { useRef as useRef2, useEffect as useEffect2 } from "react";

// components/EndpointCard.tsx
import { useState as useState3 } from "react";

// components/ParametersTable.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function ParametersTable({ parameters }) {
  if (!parameters || parameters.length === 0) return null;
  return /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse text-sm", children: [
    /* @__PURE__ */ jsx2("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx2("th", { className: "text-left py-2 px-3 text-xs font-semibold text-black/40 uppercase tracking-wider border-b border-black/5", children: "\u53C2\u6570\u540D" }),
      /* @__PURE__ */ jsx2("th", { className: "text-left py-2 px-3 text-xs font-semibold text-black/40 uppercase tracking-wider border-b border-black/5", children: "\u7C7B\u578B" }),
      /* @__PURE__ */ jsx2("th", { className: "text-left py-2 px-3 text-xs font-semibold text-black/40 uppercase tracking-wider border-b border-black/5", children: "\u5FC5\u586B" }),
      /* @__PURE__ */ jsx2("th", { className: "text-left py-2 px-3 text-xs font-semibold text-black/40 uppercase tracking-wider border-b border-black/5", children: "\u63CF\u8FF0" })
    ] }) }),
    /* @__PURE__ */ jsx2("tbody", { children: parameters.map((p, i) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-black/5", children: [
      /* @__PURE__ */ jsx2("td", { className: "py-2 px-3 font-mono text-sm text-purple-600", children: p.name }),
      /* @__PURE__ */ jsx2("td", { className: "py-2 px-3 text-black/60", children: p.type }),
      /* @__PURE__ */ jsx2("td", { className: "py-2 px-3", children: p.required ? /* @__PURE__ */ jsx2("span", { className: "inline-block bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-semibold", children: "\u662F" }) : /* @__PURE__ */ jsx2("span", { className: "text-black/40", children: "\u5426" }) }),
      /* @__PURE__ */ jsx2("td", { className: "py-2 px-3 text-black/50", children: p.description || "\u2014" })
    ] }, i)) })
  ] });
}

// components/JsonExample.tsx
import { useState } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function sampleValue2(node) {
  if (node.enum && node.enum.length > 0) return node.enum[0];
  if (node.default !== void 0) {
    if (node.type === "integer" || node.type === "number") return Number(node.default);
    if (node.type === "boolean") return node.default === "true";
    return node.default;
  }
  switch (node.type) {
    case "string":
      return "string";
    case "integer":
      return 0;
    case "number":
      return 0;
    case "boolean":
      return true;
    case "array":
      if (node.children && node.children.length > 0) {
        const childObj = {};
        for (const child of node.children) {
          childObj[child.name] = sampleValue2(child);
        }
        return [childObj];
      }
      return ["string"];
    case "object": {
      const obj = {};
      if (node.children) {
        for (const child of node.children) {
          obj[child.name] = sampleValue2(child);
        }
      }
      return obj;
    }
    default:
      return null;
  }
}
function buildSample2(tree) {
  if (tree.length === 1 && tree[0].type === "object") {
    return sampleValue2(tree[0]);
  }
  return tree.map((n) => ({ [n.name]: sampleValue2(n) }));
}
function JsonExample({ tree }) {
  const [collapsed, setCollapsed] = useState(true);
  if (!tree || tree.length === 0) return null;
  const sample = buildSample2(tree);
  const json = JSON.stringify(sample, null, 2);
  return /* @__PURE__ */ jsxs2("div", { className: "mt-2 mb-3", children: [
    /* @__PURE__ */ jsxs2(
      "button",
      {
        className: "flex items-center gap-1.5 text-xs text-black/40 hover:text-black/60 transition-colors mb-1",
        onClick: () => setCollapsed(!collapsed),
        children: [
          /* @__PURE__ */ jsx3(
            "svg",
            {
              width: "8",
              height: "8",
              viewBox: "0 0 8 8",
              className: `transition-transform ${collapsed ? "" : "rotate-90"}`,
              children: /* @__PURE__ */ jsx3("path", { d: "M2 1L6 4L2 7", fill: "none", stroke: "currentColor", strokeWidth: "1.5" })
            }
          ),
          "\u793A\u4F8B"
        ]
      }
    ),
    !collapsed && /* @__PURE__ */ jsx3("pre", { className: "bg-black/[0.02] border border-black/10 rounded-lg p-4 overflow-x-auto text-xs leading-relaxed text-black/70 font-mono", children: /* @__PURE__ */ jsx3("code", { children: json }) })
  ] });
}

// components/SchemaTree.tsx
import { useState as useState2 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var TYPE_COLORS = {
  string: "text-emerald-600 bg-emerald-50",
  integer: "text-blue-600 bg-blue-50",
  number: "text-blue-600 bg-blue-50",
  boolean: "text-orange-600 bg-orange-50",
  array: "text-cyan-600 bg-cyan-50",
  object: "text-black/60 bg-black/5"
};
function SchemaTree({ tree }) {
  if (!tree || tree.length === 0) return null;
  return /* @__PURE__ */ jsx4("div", { className: "schema-tree-root", children: tree.map((node, i) => /* @__PURE__ */ jsx4(SchemaNodeRow, { node, depth: 0 }, i)) });
}
function SchemaNodeRow({ node, depth }) {
  const [collapsed, setCollapsed] = useState2(depth >= 3);
  const hasChildren = node.children && node.children.length > 0;
  const hasVariants = node.variants && node.variants.length > 0;
  const isExpandable = hasChildren || hasVariants;
  const typeColor = TYPE_COLORS[node.type] || "text-black/50 bg-black/[0.02]";
  return /* @__PURE__ */ jsxs3("div", { className: "schema-node", children: [
    /* @__PURE__ */ jsx4(
      "div",
      {
        className: "schema-node-row",
        style: { paddingLeft: `${depth * 20}px` },
        children: /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 flex-1 min-w-0 py-1.5", children: [
          isExpandable ? /* @__PURE__ */ jsx4(
            "button",
            {
              onClick: () => setCollapsed(!collapsed),
              className: "flex-shrink-0 w-4 h-4 flex items-center justify-center text-black/40 hover:text-black/60 transition-colors",
              children: /* @__PURE__ */ jsx4(
                "svg",
                {
                  width: "10",
                  height: "10",
                  viewBox: "0 0 10 10",
                  className: `transition-transform ${collapsed ? "" : "rotate-90"}`,
                  children: /* @__PURE__ */ jsx4("path", { d: "M 3 1 L 8 5 L 3 9", fill: "none", stroke: "currentColor", strokeWidth: "1.5" })
                }
              )
            }
          ) : /* @__PURE__ */ jsx4("span", { className: "flex-shrink-0 w-4" }),
          /* @__PURE__ */ jsx4("span", { className: "font-mono text-sm font-semibold text-purple-700", children: node.name }),
          /* @__PURE__ */ jsxs3("span", { className: `text-[11px] px-1.5 py-0.5 rounded font-mono font-medium ${typeColor}`, children: [
            node.type,
            node.format ? ` (${node.format})` : ""
          ] }),
          node.required ? /* @__PURE__ */ jsx4("span", { className: "text-[11px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium", children: "required" }) : /* @__PURE__ */ jsx4("span", { className: "text-[11px] text-black/40 bg-black/[0.02] px-1.5 py-0.5 rounded", children: "optional" }),
          node.enum && node.enum.length > 0 && /* @__PURE__ */ jsxs3("span", { className: "text-[11px] text-black/40", children: [
            "Enum: ",
            /* @__PURE__ */ jsx4("code", { className: "text-black/60", children: node.enum.join(", ") })
          ] }),
          node.default !== void 0 && /* @__PURE__ */ jsxs3("span", { className: "text-[11px] text-black/40", children: [
            "Default: ",
            /* @__PURE__ */ jsx4("code", { className: "text-black/60", children: node.default })
          ] }),
          node.description && /* @__PURE__ */ jsx4("span", { className: "text-[11px] text-black/40 truncate hidden sm:inline", children: node.description })
        ] })
      }
    ),
    isExpandable && !collapsed && /* @__PURE__ */ jsxs3("div", { className: "schema-node-children", children: [
      hasChildren && node.children.map((child, i) => /* @__PURE__ */ jsx4(SchemaNodeRow, { node: child, depth: depth + 1 }, i)),
      hasVariants && /* @__PURE__ */ jsxs3("div", { className: "schema-node-variants", children: [
        /* @__PURE__ */ jsx4("div", { className: "text-[11px] text-black/40 font-medium uppercase tracking-wider mt-1 mb-1", style: { paddingLeft: `${(depth + 1) * 20}px` }, children: "oneOf" }),
        node.variants.map((variant, i) => /* @__PURE__ */ jsx4(SchemaNodeRow, { node: variant, depth: depth + 1 }, i))
      ] })
    ] })
  ] });
}

// components/MarkdownBlock.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function parseInline(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[1];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(/* @__PURE__ */ jsx5("strong", { children: token.slice(2, -2) }, match.index));
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(/* @__PURE__ */ jsx5("em", { children: token.slice(1, -1) }, match.index));
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(/* @__PURE__ */ jsx5("code", { className: "bg-black/5 px-1 py-0.5 rounded text-xs font-mono text-purple-600", children: token.slice(1, -1) }, match.index));
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        parts.push(/* @__PURE__ */ jsx5("a", { href: linkMatch[2], className: "text-black underline underline-offset-2", children: linkMatch[1] }, match.index));
      }
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}
function MarkdownBlock({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        /* @__PURE__ */ jsx5("pre", { className: "bg-black/5 rounded-lg p-4 overflow-x-auto mb-3 text-xs", children: /* @__PURE__ */ jsx5("code", { className: `font-mono text-black/70${lang ? ` language-${lang}` : ""}`, children: codeLines.join("\n") }) }, key++)
      );
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        /* @__PURE__ */ jsx5("h3", { className: "text-sm font-semibold text-black/80 mt-4 mb-2", children: line.slice(4) }, key++)
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        /* @__PURE__ */ jsx5("h2", { className: "text-base font-semibold text-black/90 mt-5 mb-2", children: line.slice(3) }, key++)
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        /* @__PURE__ */ jsx5("h1", { className: "text-lg font-bold text-black mt-5 mb-2", children: line.slice(2) }, key++)
      );
      i++;
      continue;
    }
    if (line.match(/^[-*_]{3,}\s*$/)) {
      elements.push(/* @__PURE__ */ jsx5("hr", { className: "border-black/10 my-4" }, key++));
      i++;
      continue;
    }
    if (line.startsWith("|") && i + 1 < lines.length && lines[i + 1].startsWith("|")) {
      const headerLine = line;
      const rows = [];
      i++;
      if (lines[i].startsWith("|")) i++;
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i].split("|").filter(Boolean).map((c) => c.trim()));
        i++;
      }
      const headers = headerLine.split("|").filter(Boolean).map((c) => c.trim());
      elements.push(
        /* @__PURE__ */ jsx5("div", { className: "overflow-x-auto mb-3", children: /* @__PURE__ */ jsxs4("table", { className: "w-full text-xs border-collapse", children: [
          /* @__PURE__ */ jsx5("thead", { children: /* @__PURE__ */ jsx5("tr", { className: "border-b border-black/10", children: headers.map((h, hi) => /* @__PURE__ */ jsx5("th", { className: "text-left py-2 px-3 font-semibold text-black/60", children: h }, hi)) }) }),
          /* @__PURE__ */ jsx5("tbody", { children: rows.map((row, ri) => /* @__PURE__ */ jsx5("tr", { className: "border-b border-black/5", children: row.map((cell, ci) => /* @__PURE__ */ jsx5("td", { className: "py-2 px-3 text-black/50", children: cell }, ci)) }, ri)) })
        ] }) }, key++)
      );
      continue;
    }
    if (line.match(/^\s*[-*]\s/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        listItems.push(lines[i].replace(/^\s*[-*]\s/, ""));
        i++;
      }
      elements.push(
        /* @__PURE__ */ jsx5("ul", { className: "list-disc list-inside mb-3 text-xs text-black/50 space-y-1", children: listItems.map((item, li) => /* @__PURE__ */ jsx5("li", { children: parseInline(item) }, li)) }, key++)
      );
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("```") && !lines[i].startsWith("###") && !lines[i].startsWith("##") && !lines[i].startsWith("#") && !lines[i].startsWith("|") && !lines[i].match(/^\s*[-*]\s/) && !lines[i].match(/^[-*_]{3,}\s*$/)) {
      paraLines.push(lines[i]);
      i++;
    }
    elements.push(
      /* @__PURE__ */ jsx5("p", { className: "text-xs text-black/50 mb-3 leading-relaxed", children: parseInline(paraLines.join(" ")) }, key++)
    );
  }
  return /* @__PURE__ */ jsx5("div", { className: "markdown-block", children: elements });
}

// components/EndpointCard.tsx
import { Fragment, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var PARAM_LABELS2 = {
  path: "Path \u53C2\u6570",
  query: "Query \u53C2\u6570",
  header: "Header \u53C2\u6570"
};
function statusClass(status) {
  const code = parseInt(status, 10);
  if (code >= 200 && code < 300) return "status-ok";
  if (code >= 300 && code < 400) return "status-redirect";
  return "status-error";
}
function EndpointCard({ endpoint: ep }) {
  const [collapsed, setCollapsed] = useState3(true);
  const methodClass = `method-${ep.method.toLowerCase()}`;
  const nonBody = (ep.parameters || []).filter((p) => p.in !== "formData" && p.in !== "body");
  const grouped = groupParamsByIn(nonBody);
  const epId = `ep-${ep.method}-${ep.path.replace(/[/{}]/g, "-")}`;
  return /* @__PURE__ */ jsxs5("div", { "data-endpoint-id": epId, className: "bg-white border border-black/10 rounded-lg mb-4 overflow-hidden", children: [
    /* @__PURE__ */ jsxs5(
      "button",
      {
        className: "w-full flex items-center gap-3 px-4 py-3 bg-black/[0.02] border-b border-black/5 hover:bg-black/5 transition-colors text-left",
        onClick: () => setCollapsed(!collapsed),
        children: [
          /* @__PURE__ */ jsx6("span", { className: "text-xs text-black/40 transition-transform", style: { transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }, children: "\u25BC" }),
          /* @__PURE__ */ jsx6("span", { className: `text-xs font-bold uppercase px-2 py-0.5 rounded ${methodClass}`, children: ep.method.toUpperCase() }),
          /* @__PURE__ */ jsx6("code", { className: "font-mono text-sm text-black/70 flex-1", children: ep.path }),
          /* @__PURE__ */ jsx6("span", { className: "text-sm text-black/50 truncate max-w-[200px]", children: ep.summary })
        ]
      }
    ),
    !collapsed && /* @__PURE__ */ jsxs5("div", { className: "px-4 py-3", children: [
      ep.description && ep.description !== ep.summary && /* @__PURE__ */ jsx6("div", { className: "mb-3", children: /* @__PURE__ */ jsx6(MarkdownBlock, { text: ep.description }) }),
      Object.keys(grouped).length > 0 && /* @__PURE__ */ jsxs5("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx6("h4", { className: "text-sm font-semibold text-black/70 mb-2", children: "\u8BF7\u6C42\u53C2\u6570" }),
        Object.entries(grouped).map(([loc, params]) => /* @__PURE__ */ jsxs5("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6("div", { className: "text-xs font-semibold text-black/40 uppercase tracking-wider mb-1", children: PARAM_LABELS2[loc] || loc }),
          /* @__PURE__ */ jsx6(ParametersTable, { parameters: params })
        ] }, loc))
      ] }),
      ep.requestBody && /* @__PURE__ */ jsxs5("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx6("h4", { className: "text-sm font-semibold text-black/70 mb-2", children: "\u8BF7\u6C42\u4F53" }),
        /* @__PURE__ */ jsxs5("p", { className: "text-xs text-black/50 mb-2", children: [
          "Content-Type: ",
          /* @__PURE__ */ jsx6("code", { className: "bg-black/5 px-1.5 py-0.5 rounded text-purple-600", children: ep.requestBody.contentType })
        ] }),
        ep.requestBody.schemaTree && ep.requestBody.schemaTree.length > 0 && /* @__PURE__ */ jsx6(SchemaTree, { tree: ep.requestBody.schemaTree })
      ] }),
      ep.responses && ep.responses.length > 0 && /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsx6("h4", { className: "text-sm font-semibold text-black/70 mb-2", children: "\u54CD\u5E94" }),
        ep.responses.map((resp, i) => /* @__PURE__ */ jsxs5("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx6("span", { className: `text-xs font-bold px-2 py-0.5 rounded ${statusClass(resp.status)}`, children: resp.status }),
            resp.description && /* @__PURE__ */ jsx6("div", { className: "text-sm text-black/50", children: /* @__PURE__ */ jsx6(MarkdownBlock, { text: resp.description }) })
          ] }),
          !resp.isEmpty && resp.schema && /* @__PURE__ */ jsx6("div", { className: "mb-2", children: resp.schemaTree && resp.schemaTree.length > 0 && /* @__PURE__ */ jsxs5(Fragment, { children: [
            /* @__PURE__ */ jsx6(SchemaTree, { tree: resp.schemaTree }),
            /* @__PURE__ */ jsx6(JsonExample, { tree: resp.schemaTree })
          ] }) })
        ] }, i))
      ] })
    ] })
  ] });
}

// components/DocPreview.tsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function DocPreview({ doc, onScroll, onEndpointClick }) {
  const ref = useRef2(null);
  useEffect2(() => {
    const el = ref.current;
    if (!el || !onScroll) return;
    const handler = () => onScroll(el.scrollTop);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [onScroll]);
  const handleClick = (e) => {
    if (!onEndpointClick) return;
    const target = e.target.closest("[data-endpoint-id]");
    if (target) {
      const idx = parseInt(target.dataset.endpointId || "", 10);
      if (!isNaN(idx)) onEndpointClick(idx);
    }
  };
  return /* @__PURE__ */ jsxs6("div", { ref, className: "flex-1 min-h-0 min-w-0 overflow-y-auto pl-6 py-4 scroll-area", onClick: handleClick, children: [
    /* @__PURE__ */ jsxs6("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs6("h2", { className: "text-2xl font-bold text-black flex items-center gap-2", children: [
        doc.title,
        /* @__PURE__ */ jsxs6("span", { className: "text-xs font-medium text-black/50 bg-black/5 px-2 py-0.5 rounded-full", children: [
          "v",
          doc.version
        ] })
      ] }),
      /* @__PURE__ */ jsx7("p", { className: "text-sm text-black/50 mt-1", children: /* @__PURE__ */ jsx7("code", { className: "bg-black/5 px-2 py-0.5 rounded text-purple-600 font-mono text-xs", children: doc.baseUrl }) })
    ] }),
    doc.endpoints.map((ep, i) => /* @__PURE__ */ jsx7(EndpointCard, { endpoint: ep }, i))
  ] });
}

// components/SidebarNav.tsx
import { useState as useState4, useEffect as useEffect3, useCallback } from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function SidebarNav({ endpoints, scrollTop = 0, onEndpointClick, onActiveChange }) {
  const [activeIdx, setActiveIdx] = useState4(0);
  const scrollTo = useCallback((idx) => {
    const cards = document.querySelectorAll("[data-endpoint-id]");
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  useEffect3(() => {
    const cards = document.querySelectorAll("[data-endpoint-id]");
    let current = 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (rect.top < 200) current = i;
    }
    setActiveIdx(current);
  }, [scrollTop]);
  useEffect3(() => {
    onActiveChange == null ? void 0 : onActiveChange(activeIdx);
  }, [activeIdx, onActiveChange]);
  return /* @__PURE__ */ jsxs7("div", { className: "h-full w-64 flex-shrink-0 overflow-y-auto bg-white scroll-area", children: [
    /* @__PURE__ */ jsx8("div", { className: "px-3 py-2 text-xs font-semibold text-black/40 uppercase tracking-wider border-b border-black/10", children: "\u7AEF\u70B9" }),
    /* @__PURE__ */ jsx8("div", { className: "py-1", children: endpoints.map((ep, i) => /* @__PURE__ */ jsxs7(
      "button",
      {
        onClick: () => {
          scrollTo(i);
          onEndpointClick == null ? void 0 : onEndpointClick(i);
        },
        className: `w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-black/5 transition-colors ${i === activeIdx ? "bg-black/5 text-black" : "text-black/60"}`,
        children: [
          /* @__PURE__ */ jsx8("span", { className: `w-2 h-2 rounded-full flex-shrink-0 method-${ep.method.toLowerCase()}` }),
          /* @__PURE__ */ jsx8("span", { className: "truncate", children: ep.summary || `${ep.method.toUpperCase()} ${ep.path}` })
        ]
      },
      i
    )) })
  ] });
}

// components/AppLayout.tsx
import { Fragment as Fragment2, jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var MIN_YAML_WIDTH = 400;
function AppLayout({ initialDoc, yaml, fileNames, activeFile, onSwitchFile }) {
  const [previewScrollTop, setPreviewScrollTop] = useState5(0);
  const [leftWidth, setLeftWidth] = useState5(400);
  const [leftMode, setLeftMode] = useState5("source");
  const [yamlHighlightLine, setYamlHighlightLine] = useState5(null);
  const resizing = useRef3(false);
  const startX = useRef3(0);
  const [copyOpen, setCopyOpen] = useState5(false);
  const [copyFeedback, setCopyFeedback] = useState5("");
  const hasFiles = fileNames && fileNames.length > 1;
  const label = (name) => name.replace(/\.ya?ml$/, "");
  useEffect4(() => {
    if (!copyFeedback) return;
    const t = setTimeout(() => setCopyFeedback(""), 2e3);
    return () => clearTimeout(t);
  }, [copyFeedback]);
  useEffect4(() => {
    function handleClickOutside() {
      if (copyOpen) setCopyOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [copyOpen]);
  const copyPage = useCallback2(async () => {
    if (!initialDoc) return;
    const text = generatePageText(initialDoc);
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback("\u5DF2\u590D\u5236\u9875\u9762\u5185\u5BB9");
    } catch (e) {
      setCopyFeedback("\u590D\u5236\u5931\u8D25");
    }
    setCopyOpen(false);
  }, [initialDoc]);
  const copyMarkdown = useCallback2(async () => {
    if (!initialDoc) return;
    const md = generateMarkdownFromDoc(initialDoc);
    try {
      await navigator.clipboard.writeText(md);
      setCopyFeedback("\u5DF2\u590D\u5236 Markdown");
    } catch (e) {
      setCopyFeedback("\u590D\u5236\u5931\u8D25");
    }
    setCopyOpen(false);
  }, [initialDoc]);
  const endpointLines = useMemo(() => {
    if (!initialDoc) return /* @__PURE__ */ new Map();
    return findEndpointLines(yaml, initialDoc.endpoints);
  }, [yaml, initialDoc]);
  const handleEndpointClick = useCallback2((idx) => {
    const line = endpointLines.get(idx);
    if (line !== void 0) setYamlHighlightLine(line);
  }, [endpointLines]);
  const onResizeStart = (e) => {
    e.preventDefault();
    resizing.current = true;
    startX.current = e.clientX - leftWidth;
    document.body.classList.add("select-none");
    const onMove = (ev) => {
      if (!resizing.current) return;
      ev.preventDefault();
      setLeftWidth(Math.max(MIN_YAML_WIDTH, Math.min(800, ev.clientX - startX.current)));
    };
    const onUp = () => {
      resizing.current = false;
      document.body.classList.remove("select-none");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };
  const handleFileSelect = (name) => {
    onSwitchFile == null ? void 0 : onSwitchFile(name);
    setLeftMode("source");
  };
  return /* @__PURE__ */ jsxs8("div", { className: "flex flex-1 overflow-hidden min-h-0", children: [
    /* @__PURE__ */ jsxs8("header", { className: "h-9 bg-white border-b border-black/10 flex items-center px-3 flex-shrink-0", children: [
      /* @__PURE__ */ jsx9("span", { className: "text-xs text-black/40 font-mono", children: activeFile }),
      /* @__PURE__ */ jsx9("div", { className: "flex-1" }),
      copyFeedback && /* @__PURE__ */ jsx9("span", { className: "text-xs text-black/50 mr-3", children: copyFeedback }),
      /* @__PURE__ */ jsxs8("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs8(
          "button",
          {
            className: "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-black/60 bg-black/[0.02] border border-black/10 rounded hover:bg-black/5 transition-colors",
            onClick: (e) => {
              e.stopPropagation();
              setCopyOpen(!copyOpen);
            },
            children: [
              /* @__PURE__ */ jsxs8("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx9("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                /* @__PURE__ */ jsx9("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
              ] }),
              "Copy",
              /* @__PURE__ */ jsx9("svg", { className: `w-3 h-3 transition-transform ${copyOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx9("path", { d: "M6 9l6 6 6-6" }) })
            ]
          }
        ),
        copyOpen && /* @__PURE__ */ jsxs8("div", { className: "absolute right-0 top-full mt-1 w-44 bg-white border border-black/10 rounded shadow-lg z-30 py-1", children: [
          /* @__PURE__ */ jsxs8(
            "button",
            {
              className: "w-full text-left px-3 py-2 text-sm text-black/70 hover:bg-black/5 flex items-center gap-2",
              onClick: (e) => {
                e.stopPropagation();
                copyPage();
              },
              children: [
                /* @__PURE__ */ jsx9("svg", { className: "w-4 h-4 text-black/40", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx9("path", { d: "M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0 3-3m-3 3 3 3" }) }),
                "Copy page"
              ]
            }
          ),
          /* @__PURE__ */ jsxs8(
            "button",
            {
              className: "w-full text-left px-3 py-2 text-sm text-black/70 hover:bg-black/5 flex items-center gap-2",
              onClick: (e) => {
                e.stopPropagation();
                copyMarkdown();
              },
              children: [
                /* @__PURE__ */ jsx9("svg", { className: "w-4 h-4 text-black/40", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx9("path", { d: "M4 6h16M4 12h16M4 18h7" }) }),
                "Copy as markdown"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "flex flex-1 overflow-hidden min-h-0", children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex-shrink-0 border-r border-black/10 bg-white flex flex-col overflow-hidden", style: { width: leftWidth }, children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-0.5 px-1.5 py-1 border-b border-black/5 flex-shrink-0", children: [
          /* @__PURE__ */ jsxs8(
            "button",
            {
              onClick: () => setLeftMode("source"),
              className: `flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${leftMode === "source" ? "bg-black/5 text-black font-medium" : "text-black/40 hover:text-black/60 hover:bg-black/5"}`,
              children: [
                /* @__PURE__ */ jsxs8("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx9("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                  /* @__PURE__ */ jsx9("polyline", { points: "14 2 14 8 20 8" }),
                  /* @__PURE__ */ jsx9("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
                  /* @__PURE__ */ jsx9("line", { x1: "16", y1: "17", x2: "8", y2: "17" })
                ] }),
                "\u6E90\u7801"
              ]
            }
          ),
          hasFiles && /* @__PURE__ */ jsxs8(
            "button",
            {
              onClick: () => setLeftMode("files"),
              className: `flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${leftMode === "files" ? "bg-black/5 text-black font-medium" : "text-black/40 hover:text-black/60 hover:bg-black/5"}`,
              children: [
                /* @__PURE__ */ jsxs8("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx9("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }),
                  /* @__PURE__ */ jsx9("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" })
                ] }),
                "\u6587\u4EF6"
              ]
            }
          )
        ] }),
        leftMode === "source" ? /* @__PURE__ */ jsx9(YamlViewer, { value: yaml, highlightLine: yamlHighlightLine }) : /* @__PURE__ */ jsx9("div", { className: "flex-1 overflow-auto scroll-area", children: fileNames == null ? void 0 : fileNames.map((name) => /* @__PURE__ */ jsx9(
          "button",
          {
            onClick: () => handleFileSelect(name),
            className: `w-full text-left px-3 py-2 text-sm border-b border-black/5 transition-colors ${name === activeFile ? "bg-black/[0.03] text-black font-medium" : "text-black/60 hover:bg-black/5"}`,
            children: label(name)
          },
          name
        )) })
      ] }),
      /* @__PURE__ */ jsx9(
        "div",
        {
          className: "w-1.5 bg-transparent hover:bg-black/10 cursor-col-resize flex-shrink-0 transition-colors select-none",
          onMouseDown: onResizeStart
        }
      ),
      /* @__PURE__ */ jsx9("div", { className: "flex-1 min-w-0 overflow-hidden flex", children: initialDoc ? /* @__PURE__ */ jsxs8(Fragment2, { children: [
        /* @__PURE__ */ jsx9(DocPreview, { doc: initialDoc, onScroll: setPreviewScrollTop, onEndpointClick: handleEndpointClick }),
        /* @__PURE__ */ jsx9(
          SidebarNav,
          {
            endpoints: initialDoc.endpoints,
            scrollTop: previewScrollTop,
            onEndpointClick: handleEndpointClick,
            onActiveChange: handleEndpointClick
          }
        )
      ] }) : /* @__PURE__ */ jsx9("div", { className: "flex items-center justify-center h-full w-full text-black/40 text-sm", children: "\u52A0\u8F7D swagger.yaml ..." }) })
    ] })
  ] });
}
export {
  AppLayout as Anthrodocs,
  DocPreview,
  EndpointCard,
  JsonExample,
  ParametersTable,
  SchemaTree,
  SidebarNav,
  YamlViewer,
  findEndpointLines,
  groupParamsByIn,
  parseSpecFromString
};
