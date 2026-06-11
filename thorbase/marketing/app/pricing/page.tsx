// marketing/app/pricing/page.tsx
//
// Drop-in replacement for the existing pricing page. Tokens come from
// globals.css (--color-primary, --color-secondary, --color-background,
// --font-rubik-mono, --font-mono) so colors stay consistent with the rest
// of the site.

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/app-url";

export const metadata: Metadata = {
  title: "Pricing · TokenGO",
  description:
    "Transparent pay-as-you-go pricing across every model on TokenGO, with volume tiers that unlock automatically as workloads grow.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing · TokenGO",
    description:
      "Transparent pay-as-you-go pricing across every model on TokenGO, with volume tiers that unlock automatically as workloads grow.",
  },
};

const appUrl = getAppUrl("/sign-in");

// ─── Plan data ─────────────────────────────────────────────────────────
type Plan = {
  step: 1 | 2 | 3 | 4;
  label: string;        // e.g. "$5K" — sits on top of the bar
  name: string;
  idx: string;
  price: string;        // display heading e.g. "List price" / "5–8% off"
  priceSmall?: string;  // optional trailing small text
  term: string;         // mono caption, e.g. "Pay-as-you-go · no commitment"
  features: { text: string; everything?: boolean }[];
  dark?: boolean;
};

const PLANS: Plan[] = [
  {
    step: 1,
    label: "$5K",
    name: "Standard",
    idx: "01",
    price: "List price",
    term: "Pay-as-you-go · no commitment",
    features: [
      { text: "Unified API across the full model catalog" },
      { text: "Cost & usage monitoring" },
      { text: "Set limits per key" },
      { text: "Unlimited seats" },
    ],
  },
  {
    step: 2,
    label: "$50K",
    name: "Growth",
    idx: "02",
    price: "5–8%",
    priceSmall: "off",
    term: "Quarterly · $5K–$50K / mo",
    features: [
      { text: "Everything in Standard", everything: true },
      { text: "5–8% volume discount on list pricing" },
      { text: "Quarterly billing" },
      { text: "Priority support" },
    ],
  },
  {
    step: 3,
    label: "$100K",
    name: "Scale",
    idx: "03",
    price: "10–15%",
    priceSmall: "off",
    term: "Annual · $50K–$100K / mo",
    features: [
      { text: "Everything in Growth", everything: true },
      { text: "10–15% volume discount on list pricing" },
      { text: "Annual billing" },
      { text: "Team management & access controls" },
      { text: "Dedicated support" },
    ],
  },
  {
    step: 4,
    label: "$100K+",
    name: "Enterprise",
    idx: "04",
    price: "Negotiated",
    term: "Custom · $100K+ / mo",
    features: [
      { text: "Everything in Scale", everything: true },
      { text: "Negotiated pricing" },
      { text: "SLA & professional services" },
      { text: "Custom billing & invoicing" },
      { text: "DPA & compliance review" },
    ],
    dark: true,
  },
];

// Bar height per step (px). The bar slot is uniform 240px tall;
// the inner fill sits at the bottom and grows upward.
const BAR_HEIGHT = { 1: 60, 2: 110, 3: 170, 4: 240 } as const;

// ─── Scoped styles for staircase bits Tailwind can't express cleanly ──
const PRICING_STYLES = `
.pricing-page .bar-fill {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(0,32,92,0.06) 0 4px,
      rgba(0,32,92,0.0) 4px 8px
    ),
    rgba(0,32,92,0.04);
  border-top: 1px solid rgba(0,32,92,0.25);
  border-left: 1px solid rgba(0,32,92,0.14);
  border-right: 1px solid rgba(0,32,92,0.14);
}
.pricing-page .bar-fill--accent {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(179,0,27,0.10) 0 4px,
      rgba(179,0,27,0.0) 4px 8px
    ),
    rgba(179,0,27,0.04);
  border-top-color: var(--primary);
  border-left-color: rgba(179,0,27,0.4);
  border-right-color: rgba(179,0,27,0.4);
}
.pricing-page .dashed-list > li {
  border-bottom: 1px dashed rgba(0,32,92,0.14);
}
.pricing-page .dashed-list {
  border-top: 1px dashed rgba(0,32,92,0.14);
}
.pricing-page .step-dark .dashed-list,
.pricing-page .step-dark .dashed-list > li {
  border-color: rgba(255,254,245,0.18);
}
.pricing-page .ladder-rule {
  position: absolute;
  left: 0;
  right: 12px;
  border-bottom: 1px dashed rgba(0,32,92,0.14);
  padding-bottom: 4px;
}
`;

// ─── Page ──────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <main className="pricing-page mx-auto w-[min(1240px,96vw)] pt-6 pb-12 text-secondary">
      <style dangerouslySetInnerHTML={{ __html: PRICING_STYLES }} />

      {/* ───────────── PLANS ───────────── */}
      <section aria-label="Plans" className="mt-6">
        {/* Eyebrow */}
        <div className="mb-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-secondary/55">
          <span>─── 01 · PLANS / RATE CARD</span>
          <span className="text-primary">$0 → $100K+ / month</span>
        </div>

        {/* Section head */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-secondary/25 pb-8">
          <h2 className="font-rubik-mono max-w-[14ch] text-[clamp(2rem,4.4vw,3rem)] leading-[0.95] tracking-[-0.035em] text-secondary">
            Tiers scale <span className="text-primary">as you do.</span>
          </h2>
          <p className="max-w-[44ch] text-[14.5px] leading-[1.7] text-secondary/70">
            Start on <strong className="font-semibold text-secondary">Standard</strong> with zero
            commitment. Scale to discounted tiers as you grow.
          </p>
        </div>

        {/* Staircase */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[84px_repeat(4,1fr)] lg:gap-0">
          {/* Ladder (left rail) */}
          <div className="relative hidden h-[240px] border-r border-secondary/15 pr-3 lg:block">
            <span className="absolute right-3 top-1 font-mono text-[10px] uppercase tracking-[0.18em] text-secondary/55">
              $100K+
            </span>
            <span
              className="ladder-rule font-mono text-[10px] uppercase tracking-[0.18em] text-right text-secondary/55"
              style={{ bottom: "170px" }}
            >
              $100K
            </span>
            <span
              className="ladder-rule font-mono text-[10px] uppercase tracking-[0.18em] text-right text-secondary/55"
              style={{ bottom: "110px" }}
            >
              $50K
            </span>
            <span
              className="ladder-rule font-mono text-[10px] uppercase tracking-[0.18em] text-right text-secondary/55"
              style={{ bottom: "60px" }}
            >
              $5K
            </span>
            <span className="absolute right-3 bottom-1 font-mono text-[10px] uppercase tracking-[0.18em] text-secondary/55">
              $0 / mo
            </span>
          </div>

          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`step relative flex flex-col border-t border-secondary/15 lg:border-t-0 lg:border-l lg:border-secondary/15 ${
                plan.dark ? "step-dark" : ""
              }`}
            >
              {/* Bar slot — uniform 240px on desktop, hidden on mobile */}
              <div
                className="hidden h-[240px] w-full items-end px-[22px] lg:flex"
                aria-hidden="true"
              >
                <div
                  className={`bar-fill relative w-full ${
                    plan.step === 4 ? "bar-fill--accent" : ""
                  }`}
                  style={{ height: `${BAR_HEIGHT[plan.step]}px` }}
                >
                  <span
                    className={`absolute -top-[2px] right-[22px] bg-background px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary`}
                  >
                    {plan.label}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div
                className={`flex flex-1 flex-col gap-3 border-t border-secondary/25 p-[22px] ${
                  plan.dark
                    ? "bg-secondary text-background"
                    : "bg-background text-secondary"
                }`}
              >
                {/* Tier head */}
                <div className="mb-1 flex items-baseline justify-between">
                  <div
                    className={`font-rubik-mono text-[24px] tracking-[-0.02em] ${
                      plan.dark ? "text-background" : "text-secondary"
                    }`}
                  >
                    {plan.name}
                  </div>
                  <div
                    className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
                      plan.dark ? "text-background/55" : "text-secondary/55"
                    }`}
                  >
                    {plan.idx}
                  </div>
                </div>

                {/* Features */}
                <ul className="dashed-list m-0 list-none p-0">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className={`relative py-2 pl-5 text-[13px] leading-[1.5] ${
                        plan.dark
                          ? f.everything
                            ? "text-background"
                            : "text-background/80"
                          : f.everything
                          ? "font-medium text-secondary"
                          : "text-secondary/80"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-[7px] font-mono text-[13px] ${
                          f.everything
                            ? plan.dark
                              ? "text-background"
                              : "text-secondary"
                            : plan.dark
                            ? "text-[#ff7a7a]"
                            : "text-primary"
                        }`}
                        aria-hidden="true"
                      >
                        {f.everything ? "↳" : "+"}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                {/* Bottom: price + term */}
                <div
                  className={`mt-auto flex flex-col gap-2.5 border-t pt-4 ${
                    plan.dark ? "border-background/20" : "border-secondary/15"
                  }`}
                >
                  <div>
                    <div
                      className={`font-rubik-mono text-[22px] leading-none tracking-[-0.015em] ${
                        plan.dark ? "text-background" : "text-secondary"
                      }`}
                    >
                      {plan.price}
                      {plan.priceSmall ? (
                        <span
                          className={`ml-2 font-mono text-[12px] font-normal tracking-[0.05em] ${
                            plan.dark ? "text-background/55" : "text-secondary/55"
                          }`}
                        >
                          {plan.priceSmall}
                        </span>
                      ) : null}
                    </div>
                    <div
                      className={`mt-1 min-h-[30px] font-mono text-[10.5px] uppercase leading-[1.45] tracking-[0.18em] ${
                        plan.dark ? "text-background/55" : "text-secondary/55"
                      }`}
                    >
                      {plan.term}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Spend axis caption */}
        <div
          className="mt-2 hidden grid-cols-[84px_repeat(4,1fr)] font-mono text-[10px] uppercase tracking-[0.18em] text-secondary/55 lg:grid"
          aria-hidden="true"
        >
          <span />
          <span className="border-l-0 px-[22px] py-3">
            <span className="font-rubik-mono text-[14px] normal-case tracking-[-0.01em] text-secondary">
              &lt; $5K
            </span>{" "}
            / month
          </span>
          <span className="border-l border-secondary/15 px-[22px] py-3">
            <span className="font-rubik-mono text-[14px] normal-case tracking-[-0.01em] text-secondary">
              $5K – $50K
            </span>{" "}
            / month
          </span>
          <span className="border-l border-secondary/15 px-[22px] py-3">
            <span className="font-rubik-mono text-[14px] normal-case tracking-[-0.01em] text-secondary">
              $50K – $100K
            </span>{" "}
            / month
          </span>
          <span className="border-l border-secondary/15 px-[22px] py-3">
            <span className="font-rubik-mono text-[14px] normal-case tracking-[-0.01em] text-secondary">
              $100K +
            </span>{" "}
            / month
          </span>
        </div>

        {/* CTA row — shares the same 84px + 4×1fr grid as the axis */}
        <div className="mt-3.5 grid grid-cols-1 gap-4 lg:grid-cols-[84px_repeat(4,1fr)] lg:gap-0">
          <span className="hidden lg:block" />
          <div className="lg:col-start-2 lg:px-[22px]">
            <Button asChild className="w-full px-[18px] py-3.5 text-[14px]">
              <a href={appUrl}>Get your API key</a>
            </Button>
          </div>
          <div className="lg:col-start-3 lg:col-span-3 lg:px-[22px]">
            <Button
              asChild
              className="w-full gap-2.5 px-[18px] py-3.5 text-[14px]"
            >
              <a href={appUrl}>
                Talk to sales{" "}
                <span className="font-mono text-[14px]" aria-hidden="true">
                  →
                </span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ───────────── PER-MODEL ───────────── */}
      {/* <section
        aria-label="Per-model pricing"
        className="mt-24 grid grid-cols-1 items-start gap-12 border-t border-secondary/25 pt-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
      >
        <div className="pt-1">
          <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-secondary/55">
            ─── 02 · PER-MODEL / CATALOG
          </div>
          <h3 className="font-rubik-mono text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.02] tracking-[-0.03em] text-secondary">
            Every model&apos;s{" "}
            <span className="text-primary">input/output price</span>
            {" "}and context window lives on the catalog.
          </h3>
          <p className="mt-3.5 mb-5 max-w-[50ch] text-[14px] leading-[1.65] text-secondary/70">
            Per-token rates, context windows, and provider availability are maintained on a single
            sortable page so you can compare without spreadsheets. Prices below are illustrative —
            see the catalog for live numbers.
          </p>
          <Link
            href="/models"
            className="inline-flex items-center gap-2 border-b border-primary pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary no-underline hover:opacity-80"
          >
            See the full model catalog → /models
          </Link>
        </div> */}

        {/* /models · sample preview */}
        {/* <div className="overflow-hidden rounded-md border border-secondary/25 bg-white">
          <div className="flex items-center justify-between border-b border-secondary/15 px-3.5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary/55">
            <span className="inline-flex gap-1.5">
              <i className="block h-2 w-2 rounded-full bg-[#ef4444]" />
              <i className="block h-2 w-2 rounded-full bg-[#eab308]" />
              <i className="block h-2 w-2 rounded-full bg-[#22c55e]" />
            </span>
            <span>/models · sample</span>
          </div>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border-b border-secondary/15 px-3.5 py-3 text-left font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-secondary/55">
                  Model
                </th>
                <th className="border-b border-secondary/15 px-3.5 py-3 text-left font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-secondary/55">
                  Context
                </th>
                <th className="border-b border-secondary/15 px-3.5 py-3 text-left font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-secondary/55">
                  Input
                </th>
                <th className="border-b border-secondary/15 px-3.5 py-3 text-left font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-secondary/55">
                  Output
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["GPT 5.5", "256K", "$2.40", "$9.60"],
                  ["Opus 4.7", "200K", "$12.00", "$60.00"],
                  ["DeepSeek V4 Flash", "128K", "$0.18", "$0.72"],
                  ["Kimi K2.6", "2M", "$0.55", "$2.20"],
                  ["GLM 5.1", "128K", "$0.30", "$1.20"],
                ] as const
              ).map(([model, ctx, inp, out]) => (
                <tr key={model} className="last:[&_td]:border-b-0">
                  <td className="border-b border-secondary/15 px-3.5 py-3 font-semibold text-secondary">
                    {model}
                  </td>
                  <td className="border-b border-secondary/15 px-3.5 py-3 font-mono text-[11px] text-secondary/55">
                    {ctx}
                  </td>
                  <td className="border-b border-secondary/15 px-3.5 py-3 font-mono text-[12.5px] tabular-nums text-secondary">
                    {inp} <span className="text-[10.5px] text-secondary/55">/ M tok</span>
                  </td>
                  <td className="border-b border-secondary/15 px-3.5 py-3 font-mono text-[12.5px] tabular-nums text-secondary">
                    {out} <span className="text-[10.5px] text-secondary/55">/ M tok</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-secondary/15 bg-secondary/[0.02] px-3.5 py-3 text-right font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            <Link href="/models" className="no-underline">
              + 47 more models →
            </Link>
          </div>
        </div>
      </section> */}
    </main>
  );
}
