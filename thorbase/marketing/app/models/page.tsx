import type { Metadata } from "next";
import { ModelCatalogGrid } from "@/components/model-catalog-grid";
// import { ModelsPricingTable } from "@/components/models-pricing-table";

export const metadata: Metadata = {
  title: "Models · TokenGO",
  description: "Browse every LLM available on TokenGO — pricing, context windows, and modalities side by side.",
  alternates: { canonical: "/models" },
  openGraph: {
    title: "Models · TokenGO",
    description: "Browse every LLM available on TokenGO — pricing, context windows, and modalities side by side."
  }
};

export default function ModelsPage() {
  return (
    <main className="mx-auto w-[min(960px,92vw)] pt-6 pb-12">
      <section aria-label="Models overview" className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/60">Models</p>
        <h1 className="mt-2 text-[clamp(1.9rem,4.6vw,3rem)] font-semibold tracking-tight text-black">
          Explore model offerings
        </h1>
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-black/75">
          We are constantly adding new models to our platform.
        </p>
      </section>

      <section aria-label="Model catalog">
        <ModelCatalogGrid />
      </section>

      {/* <ModelsPricingTable /> */}
    </main>
  );
}
