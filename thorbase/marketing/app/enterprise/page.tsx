import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise · TokenGO",
  description:
    "Reliability guarantees enterprises require, one integration surface for your whole team.",
  alternates: { canonical: "/enterprise" },
  openGraph: {
    title: "Enterprise · TokenGO",
    description:
      "Reliability guarantees enterprises require, one integration surface for your whole team."
  }
};

/* ── palette (literal hex; used inline below) ────────
   navy  #00205c   red  #B3001B   cream #FFFEF5
   ──────────────────────────────────────────────────── */

const eyebrow =
  "flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-[#00205c]/55 mb-3.5";

const displayH =
  "m-0 font-rubik-mono text-[clamp(2rem,4.6vw,3.25rem)] leading-[0.98] tracking-[-0.03em] text-[#00205c]";

const bodyP =
  "text-[#00205c]/78 text-[14.5px] leading-[1.7] max-w-[62ch] text-pretty [&_strong]:text-[#00205c] [&_strong]:font-semibold";

const btn =
  "inline-flex items-center gap-2.5 px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] uppercase font-semibold bg-[#00205c] text-[#FFFEF5] no-underline border border-[#00205c] transition-colors duration-150 hover:bg-[#B3001B] hover:border-[#B3001B]";

const btnGhost =
  "inline-flex items-center gap-2.5 px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] uppercase font-semibold bg-transparent text-[#00205c] no-underline border border-[#00205c] transition-colors duration-150 hover:bg-[#00205c] hover:text-[#FFFEF5]";

const sectionEyebrowR = "font-mono text-[10px] tracking-[0.22em] uppercase text-[#00205c]/55";

const kLabel = "font-mono text-[10px] tracking-[0.2em] uppercase text-[#00205c]/55";

const flowSteps = [
  {
    k: "Step 01",
    h: "Idle capacity.",
    p: "Models deployed on unused GPU inventory from our datacenter partners. Marginal cost on this supply is low."
  },
  {
    k: "Step 02",
    h: "Routed where capacity is live.",
    p: "Each request lands at whichever partner has the model and headroom available. No queueing, no off-peak shifting."
  },
  {
    k: "Step 03",
    h: "Cost flows through to price.",
    p: "The difference shows up in our published per-token rates, this is not promotional pricing, it is a structural supply advantage."
  }
];

type CompareRow = { label: string; selfServe: boolean; enterpriseOnly: boolean };
const compareRows: CompareRow[] = [
  { label: "Full model catalog at no markup to retail pricing", selfServe: true, enterpriseOnly: false },
  { label: "OpenAI-compatible API & failover", selfServe: true, enterpriseOnly: false },
  { label: "Spend controls & usage tracking", selfServe: true, enterpriseOnly: false },
  { label: "Team token assignment & audit visibility", selfServe: false, enterpriseOnly: true },
  { label: "99.9%+ SLA with downtime insurance", selfServe: false, enterpriseOnly: true },
  { label: "Reserved compute available", selfServe: false, enterpriseOnly: true },
  { label: "US contracting", selfServe: false, enterpriseOnly: true },
  { label: "Engineer-led migration support", selfServe: false, enterpriseOnly: true }
];

export default function EnterprisePage() {
  return (
    <main
      className="mx-auto px-6 pt-12 pb-24 w-[min(1200px,94vw)] max-w-[1200px] bg-[#FFFEF5] text-[#00205c] font-sans antialiased"
    >
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="mt-8 pb-12 border-b border-[#00205c]/25" aria-label="Enterprise overview">
        <div className={eyebrow}>
          <span>─── ENTERPRISE · THORBASE INC.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-12 items-end">
          <h1 className="m-0 font-rubik-mono text-[clamp(2.8rem,7vw,5rem)] leading-[0.94] tracking-[-0.035em] text-[#00205c]">
            TokenGo
            <br />
            <span className="text-[#B3001B]">Enterprise.</span>
          </h1>

          <div className="flex flex-col gap-[18px]">
            <p className="m-0 text-[#00205c] text-[17px] leading-[1.45] font-medium max-w-[42ch] tracking-[-0.01em]">
              Reliability guarantees enterprises require, one integration surface for
              your whole team.
            </p>
            <ul className="list-none m-0 p-0 flex flex-wrap font-mono text-[11px] tracking-[0.12em] uppercase text-[#00205c]">
              <li className="py-1.5 pr-3 mr-3 border-r border-[#00205c]/25">OpenAI-compatible API</li>
              <li className="py-1.5 pr-3 mr-3 border-r border-[#00205c]/25">99.9%+ SLAs</li>
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap gap-3.5 items-center">
          <a className={btn} href="https://cal.com/thorbase" target="_blank" rel="noopener noreferrer">
            Talk to sales <span className="-translate-y-px">→</span>
          </a>
          <a className={btnGhost} href="https://dashboard.tokengo.com/sign-in">
            Get API key
          </a>
        </div>

        <div className="mt-9 grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#00205c]/25">
          {[
            ["Vendor", "Thorbase Inc."],
            ["Entity", "Delaware C-Corp"],
            ["Governing law", "United States"],
            ["Invoicing", "USD · Wire / ACH"]
          ].map(([k, v], i, arr) => (
            <div
              key={k}
              className={`px-5 py-4.5 ${
                i < arr.length - 1 ? "md:border-r md:border-[#00205c]/14" : ""
              } ${i % 2 === 0 ? "border-r border-[#00205c]/14 md:border-r" : ""} ${
                i < 2 ? "border-b border-[#00205c]/14 md:border-b-0" : ""
              }`}
            >
              <div className={kLabel}>{k}</div>
              <div className="mt-1.5 text-[#00205c] text-[14px] font-semibold tracking-[-0.005em]">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PILLARS ──────────────────────────────────── */}
      <section className="mt-20" aria-label="What Enterprise covers">
        <div className={eyebrow}>
          <span>─── 02 · WHAT ENTERPRISE COVERS</span>
          <span className={sectionEyebrowR}>RELIABILITY · GOVERNANCE · CONTRACTING</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-8 items-end pb-6 border-b border-[#00205c]/25">
          <h2 className={displayH}>
            Three things <span className="text-[#B3001B]">procurement asks about.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* RELIABILITY */}
          <article className="p-8 px-7 flex flex-col border-b border-[#00205c]/25 md:border-r md:border-[#00205c]/14">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#B3001B]">→ 01 · RELIABILITY</div>
            <h3 className="mt-2.5 mb-4 font-rubik-mono text-[1.35rem] tracking-[-0.02em] text-[#00205c] leading-[1.1]">
              Uptime you can pass through to your customers.
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#00205c]">
                <strong className="text-[#00205c] font-semibold">99.9%+ SLAs.</strong> We hold SLAs with our
                datacenter partners and insure downtime in your contract.
              </li>
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#00205c]">
                <strong className="text-[#00205c] font-semibold">Automatic failover</strong> across providers, with
                configurable fallback routing you control.
              </li>
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#00205c]">
                <strong className="text-[#00205c] font-semibold">Reserved compute</strong> available on custom
                Enterprise plans for guaranteed capacity.
              </li>
            </ul>
            <div className="mt-5 pt-3.5 border-t border-dashed border-[#00205c]/14 font-mono text-[10px] tracking-[0.16em] uppercase text-[#00205c]/55 leading-[1.6]">
              Uptime &amp; reserved compute apply to most but not all of our models.
            </div>
          </article>

          {/* GOVERNANCE */}
          <article className="p-8 px-7 flex flex-col border-b border-[#00205c]/25 md:border-r md:border-[#00205c]/14">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#B3001B]">→ 02 · GOVERNANCE</div>
            <h3 className="mt-2.5 mb-4 font-rubik-mono text-[1.35rem] tracking-[-0.02em] text-[#00205c] leading-[1.1]">
              Spend, access, and audit.
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#00205c]">
                <strong className="text-[#00205c] font-semibold">Per-team token assignment</strong> using hard
                spend controls.
              </li>
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#00205c]">
                <strong className="text-[#00205c] font-semibold">Usage tracking and audit visibility</strong> across
                your entire organization.
              </li>
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#00205c]">
                <strong className="text-[#00205c] font-semibold">OpenAI and Anthopic-compatible API</strong> giving a single integration
                surface, single-line migration.
              </li>
            </ul>
            <div className="mt-5 pt-3.5 border-t border-dashed border-[#00205c]/14 font-mono text-[10px] tracking-[0.16em] uppercase text-[#00205c]/55 leading-[1.6]">
              Same dashboard for all traffic.
            </div>
          </article>

          {/* CONTRACTING & DATA */}
          <article className="p-8 px-7 flex flex-col border-b border-[#00205c]/25">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#B3001B]">
              → 03 · CONTRACTING &amp; DATA
            </div>
            <h3 className="mt-2.5 mb-4 font-rubik-mono text-[1.35rem] tracking-[-0.02em] text-[#00205c] leading-[1.1]">
              One US entity.
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#B3001B]">
                A product of <strong className="text-[#00205c] font-semibold">Thorbase Inc.</strong>, a Delaware
                C-Corporation. US governance, contracting, invoicing. {" "}
                <strong className="text-[#00205c] font-semibold">DPA available.</strong>
              </li>
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#B3001B]">
                TokenGo&apos;s own architecture{" "}
                <strong className="text-[#00205c] font-semibold">retains nothing</strong> beyond serving the request. 
                Frontier labs may retain data.
              </li>
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#B3001B]">
                Our private datacenter partners operate under{" "}
                <strong className="text-[#00205c] font-semibold">zero-retention, no-training</strong> agreements.
              </li>
              <li className="relative pl-[22px] text-[14px] leading-[1.55] text-[#00205c]/78 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-2 before:h-2 before:bg-[#B3001B]">
                Closed-weight <strong className="text-[#00205c] font-semibold">frontier-lab models</strong> are
                governed by their providers&apos; own terms, we{" "}
                <strong className="text-[#00205c] font-semibold">identify exactly which models</strong> that applies
                to so you can scope workloads accordingly.
              </li>
            </ul>
            <div className="mt-5 pt-3.5 border-t border-dashed border-[#00205c]/14 font-mono text-[10px] tracking-[0.16em] uppercase text-[#00205c]/55 leading-[1.6]">
              DPA &amp; subprocessor list on request before signature.
            </div>
          </article>
        </div>
      </section>

      {/* ─── WHY PRICING WORKS ────────────────────────── */}
      <section className="mt-20" aria-label="Why the pricing works">
        <div className={eyebrow}>
          <span>─── 03 · WHY THE PRICING WORKS</span>
          <span className={sectionEyebrowR}>STRUCTURAL, NOT PROMOTIONAL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-12 items-start">
          <div className="flex flex-col gap-3.5">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#B3001B]">
              Supply &gt; discount.
            </span>
            <h2 className={displayH}>
              A <span className="text-[#B3001B]">structural</span> supply advantage.
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className={bodyP}>
              TokenGo aggregates idle compute from partner datacenters. The lower marginal cost on that supply flows 
              through to published prices.
            </p>
            <p className={bodyP}>
              The result:{" "}
              <strong>competitive, transparent pricing on the same models you already trust,</strong> this is a structural
              supply advantage, not a discount, and not a quality tradeoff.
            </p>
          </div>
        </div>

        <div
          className="mt-9 border border-[#00205c]/25 bg-[#00205c]/[0.025] p-7 grid grid-cols-1 md:grid-cols-3 relative"
          aria-label="How the supply advantage flows through"
        >
          {flowSteps.map((step, i) => (
            <div
              key={step.k}
              className={`relative px-0 md:px-4.5 pb-4 md:pb-0 ${
                i === 0 ? "md:pl-0" : ""
              } ${i === flowSteps.length - 1 ? "md:pr-0 md:border-r-0" : "md:border-r md:border-dashed md:border-[#00205c]/25"} ${
                i < flowSteps.length - 1 ? "border-b border-dashed border-[#00205c]/25 md:border-b-0" : ""
              }`}
            >
              <div className={kLabel}>{step.k}</div>
              <h4 className="my-2 font-rubik-mono text-[1.1rem] tracking-[-0.015em] text-[#00205c]">{step.h}</h4>
              <p className="m-0 text-[#00205c]/78 text-[13px] leading-[1.55]">{step.p}</p>
              {i < flowSteps.length - 1 ? (
                <span className="hidden md:inline absolute -right-2.5 top-3.5 font-mono text-[14px] text-[#B3001B] bg-[#00205c]/[0.025] px-1">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* ─── SELF-SERVE vs ENTERPRISE ─────────────────── */}
      <section className="mt-20" aria-label="Self-serve vs Enterprise">
        <div className={eyebrow}>
          <span>─── 04 · SELF-SERVE vs ENTERPRISE</span>
          <span className={sectionEyebrowR}>THE DELTA, ITEMIZED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-8 items-end pb-6 border-b border-[#00205c]/25">
          <h2 className={displayH}>
            What you get on <span className="text-[#B3001B]">paper.</span>
          </h2>
          <p className="m-0 text-[#00205c]/78 text-[14.5px] leading-[1.6] max-w-[42ch]">
            Same API, same models. Enterprise adds the contracting surface.
          </p>
        </div>

        <table className="mt-8 w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-3 md:px-5 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[#00205c]/55 font-semibold border-b border-[#00205c]/25">
                Capability
              </th>
              <th className="text-center px-3 md:px-5 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[#00205c]/55 font-semibold border-b border-[#00205c]/25 md:w-[160px]">
                Self-serve
              </th>
              <th className="text-center px-3 md:px-5 py-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[#B3001B] font-semibold border-b border-[#00205c]/25 md:w-[160px]">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.label} className="hover:bg-[#00205c]/[0.025]">
                <td className="text-left px-3 md:px-5 py-4 md:py-4.5 border-b border-[#00205c]/14 align-middle text-[#00205c] font-medium text-[14.5px] leading-[1.5]">
                  {row.label}
                </td>
                <td
                  className={`text-center px-3 md:px-5 py-4 md:py-4.5 border-b border-[#00205c]/14 align-middle font-mono text-[18px] ${
                    row.selfServe ? "text-[#00205c]" : "text-[#00205c]/55"
                  }`}
                  aria-label={row.selfServe ? "Included" : "Not included"}
                >
                  {row.selfServe ? "●" : "—"}
                </td>
                <td
                  className={`text-center px-3 md:px-5 py-4 md:py-4.5 border-b border-[#00205c]/14 align-middle font-mono text-[18px] ${
                    row.enterpriseOnly ? "text-[#B3001B] font-semibold" : "text-[#00205c]"
                  }`}
                  aria-label="Included"
                >
                  ●
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex flex-wrap gap-3.5 justify-stretch md:justify-end items-center">
          <a className={`${btnGhost} flex-1 md:flex-none justify-center`} href="https://dashboard.tokengo.com/sign-in">
            Start self-serve
          </a>
          <a
            className={`${btn} flex-1 md:flex-none justify-center`}
            href="https://cal.com/thorbase"
            target="_blank"
            rel="noopener noreferrer"
          >
            Talk to the team <span className="-translate-y-px">→</span>
          </a>
        </div>
      </section>

      {/* ─── FOUNDER CTA STRIP ────────────────────────── */}
      <section className="mt-16" aria-label="Talk to the founder">
        <div className="border border-[#00205c] bg-[#00205c] text-[#FFFEF5] p-7 md:px-10 md:py-9 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#FFFEF5]/70">
              Learn more
            </div>
            <h3 className="mt-2.5 mb-0 font-rubik-mono text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.05] tracking-[-0.025em] text-[#FFFEF5]">
              Migration help from <span className="text-[#FF6F7A]">the team that built it.</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-stretch md:justify-end">
            {/* <a
              className="inline-flex flex-1 md:flex-none justify-center items-center gap-2.5 px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] uppercase font-semibold bg-transparent text-[#FFFEF5] no-underline border border-[#FFFEF5]/40 transition-colors duration-150 hover:bg-[#FFFEF5] hover:text-[#00205c] hover:border-[#FFFEF5]"
              href="mailto:enterprise@thorbase.com"
            >
              enterprise@thorbase.com
            </a> */}
            <a
              className="inline-flex flex-1 md:flex-none justify-center items-center gap-2.5 px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] uppercase font-semibold bg-[#FFFEF5] text-[#00205c] no-underline border border-[#FFFEF5] transition-colors duration-150 hover:bg-[#B3001B] hover:text-[#FFFEF5] hover:border-[#B3001B]"
              href="https://cal.com/thorbase"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call <span className="-translate-y-px">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
