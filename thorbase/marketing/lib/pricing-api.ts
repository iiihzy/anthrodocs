// ── API response types ──────────────────────────────────────────
export type PricingModel = {
  model_name: string;
  description: string;
  icon: string;
  vendor_id: number;
  quota_type: number;
  model_ratio: number;
  model_price: number;
  completion_ratio: number;
  cache_ratio: number;
  tags: string;
  enable_groups: string[];
  supported_endpoint_types: string[];
};

export type PricingVendor = {
  id: number;
  name: string;
  icon: string;
};

export type PricingResponse = {
  auto_groups: string[];
  data: PricingModel[];
  vendors: PricingVendor[];
  group_ratio: Record<string, number>;
  pricing_version: string;
  success: boolean;
  supported_endpoint: string[];
  usable_group: string[];
};

// ── Internal model types (derived from API) ────────────────────
export type ModelCatalogItem = {
  id: string;
  name: string;
  company: string;
  icon: string;
  inputPrice: string;
  outputPrice: string;
  cachePrice: string;
  context: string;
  inputModalities: string[];
  outputModalities: string[];
  isPerCall: boolean;
};

export type ModelPricingRow = {
  id: string;
  company: string;
  icon: string;
  model: string;
  inputModalities: string[];
  outputModalities: string[];
  inputPrice: string;
  outputPrice: string;
  cachePrice: string;
  context: string;
};

// ── Tag parsing ────────────────────────────────────────────────
function parseTag(tags: string): { name: string; weight: number } {
  if (!tags) return { name: "", weight: 0 };
  const parts = tags.split(",");
  if (parts.length >= 2) {
    const weight = parseFloat(parts[parts.length - 1].trim());
    return {
      name: parts.slice(0, parts.length - 1).join(",").trim(),
      weight: isNaN(weight) ? 0 : weight,
    };
  }
  return { name: tags.trim(), weight: 0 };
}

// ── Price calculation ──────────────────────────────────────────
function calcPrices(model: PricingModel) {
  if (model.model_price !== 0) {
    return {
      inputPrice: model.model_price,
      outputPrice: model.model_price,
      cachePrice: model.model_price,
      isPerCall: true,
    };
  }
  const inputPrice = model.model_ratio * 2;
  const outputPrice = inputPrice * model.completion_ratio;
  const cachePrice = inputPrice * model.cache_ratio;
  return { inputPrice, outputPrice, cachePrice, isPerCall: false };
}

function formatPrice(value: number, isPerCall: boolean): string {
  if (isPerCall) return `$${value.toFixed(4)} / call`;
  if (value < 0.01) return `$${value.toFixed(4)} / 1M`;
  if (value < 1) return `$${value.toFixed(2)} / 1M`;
  return `$${value.toFixed(2)} / 1M`;
}

// ── Modality inference ─────────────────────────────────────────
function inferInputModalities(model: PricingModel): string[] {
  const mods: string[] = ["Text"];
  const name = model.model_name.toLowerCase();
  const desc = model.description?.toLowerCase() ?? "";
  if (
    name.includes("vision") ||
    name.includes("vl") ||
    desc.includes("vision") ||
    desc.includes("image input") ||
    desc.includes("multimodal")
  ) {
    mods.push("Vision");
  }
  return mods;
}

function inferOutputModalities(_model: PricingModel): string[] { // eslint-disable-line @typescript-eslint/no-unused-vars
  return ["Text"];
}

// ── Context size inference ─────────────────────────────────────
function inferContextSize(model: PricingModel): string {
  const name = model.model_name.toLowerCase();
  if (name.includes("glm")) return "128K";
  return "128K";
}

// ── Vendor lookup ──────────────────────────────────────────────
function buildVendorMap(vendors: PricingVendor[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const v of vendors) {
    map.set(v.id, v.name);
  }
  return map;
}

// ── Fetch + transform ──────────────────────────────────────────
const API_URL = "https://dashboard.tokengo.com/api/pricing";

let cachedData: Promise<PricingResponse> | null = null;

function fetchPricing(): Promise<PricingResponse> {
  cachedData ??= fetch(API_URL, { next: { revalidate: 300 } }).then(async (res) => {
    if (!res.ok) throw new Error(`Pricing API error: ${res.status}`);
    return res.json();
  });
  return cachedData;
}

export async function getPricingData(): Promise<PricingResponse> {
  return fetchPricing();
}

export async function getModelsCatalog(): Promise<ModelCatalogItem[]> {
  const resp = await fetchPricing();
  const vendorMap = buildVendorMap(resp.vendors);

  const items = resp.data.map((model) => {
    const { inputPrice, outputPrice, cachePrice, isPerCall } = calcPrices(model);
    const tagInfo = parseTag(model.tags);
    return {
      id: model.model_name,
      name: tagInfo.name || model.model_name,
      weight: tagInfo.weight,
      company: vendorMap.get(model.vendor_id) ?? "Unknown",
      icon: model.icon,
      inputPrice: formatPrice(inputPrice, isPerCall),
      outputPrice: formatPrice(outputPrice, isPerCall),
      cachePrice: formatPrice(cachePrice, isPerCall),
      context: inferContextSize(model),
      inputModalities: inferInputModalities(model),
      outputModalities: inferOutputModalities(model),
      isPerCall,
    };
  });

  items.sort((a, b) => b.weight - a.weight);

  return items.map((item) => {
    const { weight: _w, ...rest } = item;
    void _w;
    return rest;
  });
}

export async function getModelPricingRows(): Promise<ModelPricingRow[]> {
  const resp = await fetchPricing();
  const vendorMap = buildVendorMap(resp.vendors);

  const items = resp.data.map((model) => {
    const { inputPrice, outputPrice, cachePrice, isPerCall } = calcPrices(model);
    const tagInfo = parseTag(model.tags);
    return {
      id: model.model_name,
      company: vendorMap.get(model.vendor_id) ?? "Unknown",
      icon: model.icon,
      model: tagInfo.name || model.model_name,
      weight: tagInfo.weight,
      inputModalities: inferInputModalities(model),
      outputModalities: inferOutputModalities(model),
      inputPrice: formatPrice(inputPrice, isPerCall),
      outputPrice: formatPrice(outputPrice, isPerCall),
      cachePrice: formatPrice(cachePrice, isPerCall),
      context: inferContextSize(model),
    };
  });

  items.sort((a, b) => b.weight - a.weight);

  return items.map((item) => {
    const { weight: _w, ...rest } = item;
    void _w;
    return rest;
  });
}
