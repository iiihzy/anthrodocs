"use client";

import type { FC, SVGProps } from "react";
import {
  Qwen,
  DeepSeek,
  Claude,
  Minimax,
  ZAI,
  Moonshot,
  ChatGLM,
  Gemini,
  OpenAI,
} from "@lobehub/icons";

type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number | string }>;

/** Map from API `icon` field value → rendered icon component.
 *  Format: "BrandName.Variant" (e.g. "Qwen.Color") or just "BrandName" (defaults to Mono). */
const iconRegistry: Record<string, IconComponent> = {
  // Qwen
  "Qwen.Color": Qwen.Color as unknown as IconComponent,
  Qwen: Qwen as unknown as IconComponent,
  // DeepSeek
  "DeepSeek.Color": DeepSeek.Color as unknown as IconComponent,
  DeepSeek: DeepSeek as unknown as IconComponent,
  // Claude / Anthropic
  "Claude.Color": Claude.Color as unknown as IconComponent,
  Claude: Claude as unknown as IconComponent,
  Anthropic: Claude as unknown as IconComponent,
  // Minimax
  "Minimax.Color": Minimax.Color as unknown as IconComponent,
  Minimax: Minimax as unknown as IconComponent,
  // ZAI (Z.ai)
  ZAI: ZAI as unknown as IconComponent,
  // Moonshot / Kimi
  Moonshot: Moonshot as unknown as IconComponent,
  Kimi: Moonshot as unknown as IconComponent,
  // Zhipu / GLM
  "ChatGLM.Color": ChatGLM.Color as unknown as IconComponent,
  ChatGLM: ChatGLM as unknown as IconComponent,
  Zhipu: ChatGLM as unknown as IconComponent,
  // Google
  "Gemini.Color": Gemini.Color as unknown as IconComponent,
  Gemini: Gemini as unknown as IconComponent,
  Google: Gemini as unknown as IconComponent,
  // OpenAI
  OpenAI: OpenAI as unknown as IconComponent,
};

export function getModelIcon(iconField: string): IconComponent | null {
  return iconRegistry[iconField] ?? null;
}

export function ModelIcon({
  icon,
  size = 20,
  className,
}: {
  icon: string;
  size?: number;
  className?: string;
}) {
  const Comp = getModelIcon(icon);
  if (!Comp) {
    return <span className={className} style={{ width: size, height: size, display: "inline-block" }} aria-hidden />;
  }
  return <Comp size={size} className={className} />;
}
