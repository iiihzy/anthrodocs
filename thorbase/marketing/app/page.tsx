import type { Metadata } from "next";
import Link from "next/link";
// import { Shield, Globe, Code } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { ModelCatalogGrid } from "@/components/model-catalog-grid";
import { AffordableNotSlow } from "@/components/affordable-not-slow";
import { FaqSection } from "@/components/faq-section";
// import { ModelRankingLeaderboard } from "@/components/model-ranking-leaderboard";
// import { HeroVisual } from "@/components/hero-visual";
import { HeroVoltage } from "@/components/hero-voltage";
import { getAppUrl } from "@/lib/app-url";
import { getPricingData } from "@/lib/pricing-api";

export const metadata: Metadata = {
  title: "TokenGO — LLM API aggregation and distribution",
  description:
    "One integration surface for every major LLM. Transparent pay-as-you-go pricing, automatic volume tiers, and enterprise-grade reliability.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "TokenGO — LLM API aggregation and distribution",
    description:
      "One integration surface for every major LLM. Transparent pay-as-you-go pricing, automatic volume tiers, and enterprise-grade reliability.",
    type: "website",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenGO — LLM API aggregation and distribution",
    description:
      "One integration surface for every major LLM. Transparent pay-as-you-go pricing, automatic volume tiers, and enterprise-grade reliability."
  }
};

export default async function HomePage() {
  const dashboardUrl = getAppUrl("/sign-in");
  const pricingResp = await getPricingData();
  const outputPrices: Record<string, number> = {};
  for (const model of pricingResp.data) {
    const inputPrice = model.model_ratio * 2;
    outputPrices[model.model_name] = inputPrice * model.completion_ratio;
  }
  return (
    <main className="mx-auto w-[min(1200px,94vw)] pb-12 text-foreground">
      <div className="flex  flex-col">
        <section className="relative">
          <HeroVoltage dashboardUrl={dashboardUrl} />
        </section>
        {/* <section className="relative flex flex-1 flex-col justify-start overflow-x-hidden overflow-y-hidden pt-5">
          <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
            左侧：标题 + 描述 + 按钮
            <div className="flex-1">
              <div className="mx-auto w-fit md:mx-0">
                <p className="font-mono text-center text-[clamp(0.7rem,1.3vw,0.95rem)] leading-none tracking-[-0.02em] text-black">
                  [Power your AI workloads]
                </p>
                <h1 className="-mt-1 text-center text-[clamp(3rem,8.5vw,5.75rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  <span className="font-rubik-mono text-primary">TOKEN</span>
                  <span className="font-rubik-mono text-secondary">GO</span>
                </h1>
                <p className="mt-2 w-full text-center text-[1.05rem] leading-relaxed text-black/70">
                  One API key for all our models, migrate in seconds.
                </p>
                <div className="font-mono mt-5 flex w-full flex-col gap-3 sm:flex-row">
                  <Button asChild className="sm:flex-1">
                    <a href={dashboardUrl}>Get API key</a>
                  </Button>
                  <Button asChild variant="secondary" className="sm:flex-1">
                    <a href="https://cal.com/thorbase" target="_blank" rel="noopener noreferrer">
                      Quickstart demo
                    </a>
                  </Button>
                </div>
              </div>
              <div className="font-mono relative z-10 mx-auto mt-5 w-[34rem] max-w-full md:mr-auto md:ml-0">
                <div className="flex flex-col gap-1.5 text-sm text-black/55">
                  <span className="inline-flex items-center gap-1.5">
                    <Shield className="h-4 w-4 flex-shrink-0 text-secondary" />
                    Enterprise-grade security
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="h-4 w-4 flex-shrink-0 text-secondary" />
                    Global model access
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Code className="h-4 w-4 flex-shrink-0 text-secondary" />
                    Simple, universal API
                  </span>
                </div>
              </div>
            </div>

            右侧：2.5D Isometric 视觉
            <div className="hidden md:block md:w-[360px] md:flex-shrink-0 lg:w-[400px]">
              <HeroVisual />
            </div>
          </div>
          <div
            className="relative z-10 mt-auto w-full pt-8 pb-3 sm:pt-10"
            role="region"
            aria-label="Terminal command preview"
          >
            <TerminalCommandBar />
          </div>
        </section> */}
      </div>

      <section className="mt-14" aria-label="Model catalog">
        <div className="flex items-center gap-3">
          <span className="font-mono uppercase tracking-[0.18em] text-secondary/55 text-[10px]">
            ─── MODELS
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8">
          <h2 className="md:col-span-7 font-rubik-mono leading-[0.95] tracking-[-0.035em] text-[clamp(2.4rem,6vw,4.25rem)]">
            <span className="text-secondary">One key,</span>
            <br />
            <span className="text-primary">multiple models</span>
          </h2>
          <p className="md:col-span-5 md:pt-2 text-[14px] leading-relaxed text-secondary/70 max-w-prose text-pretty">
            <span className="text-black font-medium">This is just a snippet.</span>
            <br />
            <Link className="text-primary font-medium hover:underline" href="/models">
              View all models →
            </Link>
          </p>
        </div>

        <div className="mt-10">
        <ModelCatalogGrid
          featured={[
            "GLM 5.1",
            "Kimi K2.6",
            "DeepSeek V4 Pro",
            "DeepSeek V4 Flash",
            "Qwen 3.6 Plus",
            "MiniMax M2.7"
          ]}
        />
        </div>
        {/* <ModelRankingLeaderboard outputPrices={outputPrices} /> */}
      </section>

      <section className="mt-14" aria-label="Affordable not slow">
        <AffordableNotSlow />
      </section>

      <section className="mt-14" aria-label="Affordable not slow">
        <FaqSection />
      </section>
    </main>
  );
}
