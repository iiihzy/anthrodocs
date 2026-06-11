import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMarketingCards } from "@/lib/content-repository";

export const metadata: Metadata = {
  title: "Enterprise · TokenGO",
  description: "Custom infrastructure, SLAs, and operational guarantees for critical LLM workloads on TokenGO.",
  alternates: { canonical: "/enterprise" },
  openGraph: {
    title: "Enterprise · TokenGO",
    description: "Custom infrastructure, SLAs, and operational guarantees for critical LLM workloads on TokenGO."
  }
};

const pillars = [
  {
    title: "Reliability and uptime controls",
    description:
      "Reserved compute allocation plus fully customizable fallback logic that switches providers instantly to maintain uptime."
  },
  {
    title: "Team management and governance",
    description:
      "Assign tokens, track usage, and enforce limits by developer or by team. Keep an audit trail for key actions."
  },
  {
    title: "Compliance, support, and performance",
    description:
      "99.9% enterprise SLAs, a dedicated 24/7 customer service team, and smart routing for the best value on the market."
  }
];

export default async function EnterprisePage() {
  const marketingCards = await getMarketingCards();

  return (
    <main className="pt-6 pb-12 text-black">
      <div className="mx-auto w-[min(960px,92vw)]">
        <section aria-label="Enterprise overview" className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/60">Enterprise</p>
          <h1 className="mt-2 text-[clamp(1.9rem,4.6vw,3rem)] font-semibold tracking-tight text-black">
            TokenGO enterprise
          </h1>
          <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-black/75">
            Custom infrastructure, support, and operational guarantees for critical LLM workloads.
          </p>
        </section>

        <section className="mb-0 flex justify-center px-2" aria-label="Enterprise promotion">
          <p className="rounded-none border border-emerald-600/50 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold uppercase leading-snug tracking-[0.08em] text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,.12)]">
            We offer discounted price matching on enterprise contracts for select models.
          </p>
        </section>
      </div>

      <section className="mt-8" aria-label="Enterprise capabilities">
        <div className="mx-auto w-[min(960px,92vw)]">
          <div className="grid gap-4 md:grid-cols-[1.15fr_1fr]">
            <article className="rounded-none border border-black/15 bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/60">Enterprise stack</p>
              <h2 className="mt-2 text-[clamp(1.35rem,3.2vw,2rem)] font-semibold tracking-tight text-black">
                AI operations without platform complexity.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/75">
                Deploy with policy controls, workload isolation, and multi-provider routing while your team keeps a
                single integration surface.
              </p>
              <div className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                <Button asChild className="w-full sm:w-auto">
                  <a href="https://cal.com/thorbase" target="_blank" rel="noopener noreferrer">
                    Contact sales
                  </a>
                </Button>
                <Link className="py-2 text-center text-sm font-medium text-black/70 no-underline hover:text-black hover:underline sm:py-0" href="/models">
                  Browse model catalog
                </Link>
              </div>
            </article>
            <article className="rounded-none border border-black/15 bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/60">Why teams choose TokenGO</p>
              <ul className="mt-3 space-y-5 text-sm text-black/80">
                <li>- OpenAI compatible API, one line migration</li>
                <li>- Fast failover and provider fallback</li>
                <li>- Global serving with enterprise SLA support</li>
                <li>- Spend controls, quota guardrails, and audit visibility</li>
                <li>- Team management and access controls</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="mt-6" aria-label="Enterprise outcomes">
        <div className="mx-auto w-[min(960px,92vw)]">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["99.9%", "Enterprise SLA support"],
              ["24/7", "Dedicated customer support"],
              ["1.5x", "Typical runway improvement"]
            ].map(([value, label]) => (
              <article key={label} className="rounded-none border border-black/15 bg-white/70 px-4 py-4">
                <p className="text-2xl font-semibold tracking-tight text-black">{value}</p>
                <p className="mt-1 text-sm text-black/70">{label}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {pillars.map((item) => (
              <article key={item.title} className="rounded-none border border-black/15 bg-white/70 p-4">
                <h3 className="text-sm font-semibold text-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/75">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-none border border-black/15 bg-white/70 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-black/65">Cost and performance edge</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {marketingCards.slice(0, 2).map((item) => (
                <article key={item.title} className="border border-black/10 p-3">
                  <h4 className="text-sm font-semibold text-black">{item.title}</h4>
                  <p className="mt-1 text-sm text-black/75">{item.content}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
