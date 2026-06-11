// marketing/components/faq-section.tsx
//
// Drop-in usage:
//   import { FaqSection } from "@/components/faq-section";
//   ...
//   <FaqSection />
//
// No globals.css changes required — styles are scoped to `.faq-section`.
// Uses native <details>/<summary> for accessibility and SSR-correct open state.

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FaqItem = { q: string; a: ReactNode };

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "So is this just a proxy?",
    a: (
      <p>
        No. The gateway, routing layer, and a portion of the inference stack are ours.
        We have direct relationships with datacenter partners and in some cases deploy the models 
        directly.
      </p>
    ),
  },
  {
    q: "Who runs TokenGo, and is it a real company?",
    a: (
      <p>
        TokenGo is a product of <strong>Thorbase Inc.</strong>, a Delaware
        C-Corporation. US contracting, US invoicing, US law governs, DPA
        available on request. This is not a faceless reseller.
      </p>
    ),
  },
  {
    q: "What happens to my prompts and outputs?",
    a: (
      <p>
        We don&rsquo;t use prompts or outputs for training, and retention is
        limited to what&rsquo;s operationally necessary under US law. We sign
        zero retention agreements with our datacenter partners, however, sometimes 
        supply signed directly with frontier labs are used for training.
      </p>
    ),
  },
  {
    q: "Who is TokenGo built for?",
    a: (
      <p>
        Teams running meaningful token volume who want lower costs without
        rewriting their integration. AI-native businesses where token spend is a
        real line item on the budget. Developers who want one API key for leading 
        models.
      </p>
    ),
  },
  {
    q: "Is there custom pricing for higher volume?",
    a: (
      <p>
        Yes. We have a tiered discounting system based on monthly spend, you can
        find this on our pricing page.
      </p>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────
// All styles scoped under `.faq-section`. Aliases the existing tokens from
// globals.css (--background, --secondary, --primary, --font-sans, --font-mono)
// to local short names so the CSS stays readable.
// ─────────────────────────────────────────────────────────────────────────
const FAQ_STYLES = `
.faq-section {
  --faq-bg: var(--background);
  --faq-navy: var(--secondary);
  --faq-red: var(--primary);
  --faq-rule: rgba(0, 32, 92, 0.14);
  --faq-rule-strong: rgba(0, 32, 92, 0.25);
  --faq-dim: rgba(0, 32, 92, 0.55);
  --faq-row-hover: rgba(0, 32, 92, 0.025);
  color: var(--faq-navy);
  font-family: var(--font-sans, 'Inter', ui-sans-serif, system-ui, sans-serif);
}

.faq-section .faq-eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--faq-dim);
  margin-bottom: 14px;
}
.faq-section .faq-eyebrow .live { color: var(--faq-red); }
.faq-section .faq-eyebrow .live::before {
  content: "";
  display: inline-block;
  height: 6px; width: 6px; border-radius: 50%;
  background: var(--faq-red);
  margin-right: 8px;
  vertical-align: middle;
  box-shadow: 0 0 8px var(--faq-red);
}

.faq-section .faq-head {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 32px;
  align-items: end;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--faq-rule-strong);
}
.faq-section .faq-head h2 {
  margin: 0;
  font-family: var(--font-rubik-mono, 'Archivo Black', sans-serif);
  font-size: clamp(2.4rem, 6vw, 4.25rem);
  line-height: 0.95;
  letter-spacing: -0.035em;
  color: var(--faq-navy);
}
.faq-section .faq-head h2 .accent { color: var(--faq-red); }
.faq-section .faq-head p {
  margin: 0;
  color: var(--faq-dim);
  font-size: 14px;
  line-height: 1.6;
  max-width: 42ch;
}
@media (max-width: 780px) {
  .faq-section .faq-head { grid-template-columns: 1fr; gap: 16px; }
}

.faq-section .faq-list { list-style: none; margin: 0; padding: 0; }
.faq-section .faq-item { border-bottom: 1px solid var(--faq-rule); }
.faq-section .faq-item:last-child { border-bottom: 1px solid var(--faq-rule-strong); }

.faq-section details { margin: 0; }
.faq-section summary {
  display: grid;
  grid-template-columns: 72px 1fr 28px;
  gap: 24px;
  align-items: center;
  padding: 22px 16px 22px 0;
  cursor: pointer;
  list-style: none;
  transition: background-color .15s ease;
}
.faq-section summary::-webkit-details-marker { display: none; }
.faq-section summary::marker { content: ""; }
.faq-section summary:hover { background: var(--faq-row-hover); }
.faq-section summary:focus-visible { outline: none; background: var(--faq-row-hover); }

.faq-section .q-idx {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faq-dim);
  padding-left: 16px;
}
.faq-section details[open] .q-idx { color: var(--faq-red); }

.faq-section .q-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: var(--faq-navy);
  line-height: 1.35;
}

.faq-section .q-toggle {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 20px;
  font-weight: 500;
  color: var(--faq-dim);
  text-align: center;
  line-height: 1;
  padding-right: 16px;
  user-select: none;
  transition: color .15s ease;
}
.faq-section .q-toggle::before { content: "+"; }
.faq-section details[open] .q-toggle::before { content: "\u2212"; color: var(--faq-red); }

.faq-section .a-wrap {
  display: grid;
  grid-template-columns: 72px 1fr 28px;
  gap: 24px;
}
.faq-section .a-body {
  padding: 0 0 26px 0;
  max-width: 62ch;
  color: rgba(0, 32, 92, 0.78);
  font-size: 14.5px;
  line-height: 1.7;
  text-wrap: pretty;
}
.faq-section .a-body p { margin: 0; }
.faq-section .a-body p + p { margin-top: 0.85em; }
.faq-section .a-body strong { color: var(--faq-navy); font-weight: 600; }

.faq-section .faq-foot {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faq-dim);
}
@media (max-width: 640px) {
  .faq-section summary,
  .faq-section .a-wrap {
    grid-template-columns: 56px 1fr 24px;
    gap: 14px;
  }
  .faq-section .q-idx { padding-left: 8px; font-size: 10px; }
  .faq-section .q-text { font-size: 16px; }
  .faq-section .a-body { font-size: 14px; }
}
`;

export function FaqSection() {
  return (
    <section
      className="faq-section mt-14"
      aria-label="Frequently asked questions"
    >
      <style dangerouslySetInnerHTML={{ __html: FAQ_STYLES }} />

      <div className="faq-eyebrow">
        <span>─── FAQ · TRANSPARENT BY DESIGN</span>
      </div>

      <header className="faq-head">
        <h2>
          Questions
          <br />
          <span className="accent">+ answers</span>
        </h2>
      </header>

      <ol className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <li key={i} className="faq-item">
            <details open={i === 0}>
              <summary>
                <span className="q-idx">
                  Q.{String(i + 1).padStart(2, "0")}
                </span>
                <span className="q-text">{item.q}</span>
                <span className="q-toggle" aria-hidden="true" />
              </summary>
              <div className="a-wrap">
                <span />
                <div className="a-body">{item.a}</div>
                <span />
              </div>
            </details>
          </li>
        ))}
      </ol>

      <div className="faq-foot">
        <span>STILL HAVE A QUESTION?</span>
        <Button asChild className="shrink-0 normal-case tracking-normal">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
