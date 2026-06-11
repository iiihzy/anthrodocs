import {
  getModelsCatalog as getApiModelsCatalog,
  getModelPricingRows as getApiModelPricingRows,
  getPricingData,
} from "@/lib/pricing-api";
import type { ModelCatalogItem, ModelPricingRow } from "@/lib/pricing-api";

// Re-export types so consumers don't need to import from pricing-api directly
export type { ModelCatalogItem, ModelPricingRow };

// ── Hero marquee logos (still static, no API source) ───────────
type HeroLogo = { name: string; src: string };
const HERO_LOGOS: HeroLogo[] = [
  { name: "Anthropic", src: "/images/anthropic.webp" },
  { name: "DeepSeek", src: "/images/deepseek.svg" },
  { name: "Google", src: "/images/google.svg" },
  { name: "Kimi", src: "/images/kimi.svg" },
  { name: "Minimax", src: "/images/minimax.svg" },
  { name: "OpenAI", src: "/images/openai.svg" },
  { name: "Qwen", src: "/images/qwen.svg" },
  { name: "Xiaomi", src: "/images/xiaomi.svg" },
  { name: "Zhipu", src: "/images/zhipu.svg" },
];

// ── Marketing cards (still static) ────────────────────────────
type MarketingCard = { title: string; content: string };
const MARKETING_CARDS: MarketingCard[] = [
  { title: "Cost conscious scheduling", content: "We automatically shift your workloads to data centers experiencing off-peak hours. By capitalizing on cheaper grid power and cooler thermal conditions across different time zones, we pass the ultimate batch-job discount directly to you." },
  { title: "Data controls", content: "We tag our providers based on existing zero data rentention and model training agreements, we give the control over data access to you, allowing you to keep your data private and secure and satisfy your compliance requirements." },
  { title: "Efficient, hardware-aware compute", content: "Our infrastructure uses dynamic voltage scaling to sip electricity during micro-lulls in traffic. This fundamentally drives down our overhead, allowing us to offer you the most competitive API pricing on the market." },
];

export async function getHeroMarqueeLogos() {
  return HERO_LOGOS;
}
export async function getMarketingCards() {
  return MARKETING_CARDS;
}
export async function getModelsCatalog(): Promise<ModelCatalogItem[]> {
  return getApiModelsCatalog();
}
export async function getModelPricingRows(): Promise<ModelPricingRow[]> {
  return getApiModelPricingRows();
}
export async function getVendors() {
  const resp = await getPricingData();
  return resp.vendors;
}
