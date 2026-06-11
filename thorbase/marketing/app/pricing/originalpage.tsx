import type { Metadata } from "next";
import { getAppUrl } from "@/lib/app-url";

export const metadata: Metadata = {
  title: "Pricing · TokenGO",
  description: "Transparent pay-as-you-go pricing across every model on TokenGO, with enterprise options for volume workloads.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing · TokenGO",
    description: "Transparent pay-as-you-go pricing across every model on TokenGO, with enterprise options for volume workloads."
  }
};
import { Button } from "@/components/ui/button";

const planRows = [
  {
    name: "Standard",
    price: "Pay-as-you-go",
    cta: "Get your API key",
    points: [
      "Unified API across models",
      "One-line migration, OpenAI API compatible",
      "Cost and performance monitoring tools",
      "Unlimited seats"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom price",
    cta: "Talk to sales",
    points: [
      "Bulk discounts",
      "Team management and access controls",
      "Dedicated support, SLA, and professional services",
      "Custom billing and invoicing structures"
    ]
  }
];

const faqs = [
  ["Do you add markup on provider pricing?", "No provider markup. We list the 2% platform fee on applicable models."],
  ["Do you offer volume discounts?", "Yes. Large or predictable workloads can move to custom enterprise pricing."],
  ["Can we start self-serve and upgrade later?", "Yes. You can migrate to advanced plans without changing your integration."]
];

const appUrl = getAppUrl("/sign-in");

export default function PricingPage() {
  return (
    <main className="mx-auto w-[min(960px,92vw)] pt-6 pb-12 text-black">
      <section aria-label="Pricing overview">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/60">Pricing</p>
        <h1 className="mt-2 text-[clamp(1.9rem,4.6vw,3rem)] font-semibold tracking-tight text-black">
          Stop paying for idle compute
        </h1>
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-black/75">
          Start with transparent pay-as-you-go pricing, then scale to enterprise support and optimization when your
          workloads grow.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Pricing plans">
        {planRows.map((plan) => (
          <article key={plan.name} className="rounded-none border border-black/15 bg-white/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/60">{plan.name}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{plan.price}</p>
            <Button asChild className="mt-4 w-fit">
              <a href={appUrl}>{plan.cta}</a>
            </Button>
            <ul className="mt-4 space-y-2 text-sm text-black/75">
              {plan.points.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-5 flex flex-wrap gap-2" aria-label="Pricing guarantees">
        {["No subscription", "No hidden costs", "No API call limit"].map((item) => (
          <p key={item} className="border border-black/20 px-2.5 py-1 text-xs font-medium text-black/75">
            {item}
          </p>
        ))}
      </section>

      <section className="mt-10" aria-label="Platform trust metrics">
        <div className="grid gap-3 md:grid-cols-3">
          {([
            ["250 ms", "Median latency"],
            ["2%", "Platform fees"],
            ["99.9%", "Uptime"]
          ] as const).map(([value, label]) => (
            <article key={label} className="rounded-none border border-black/15 bg-white/70 px-4 py-5">
              <p className="text-2xl font-semibold tracking-tight text-black">{value}</p>
              <p className="mt-1 text-sm text-black/70">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-label="Pricing FAQ">
        <h3 className="text-xl font-semibold tracking-tight text-black">FAQ</h3>
        <div className="mt-4 divide-y divide-black/15 border-y border-black/15">
          {faqs.map(([question, answer]) => (
            <article key={question} className="py-4">
              <h4 className="text-sm font-semibold text-black">{question}</h4>
              <p className="mt-1 text-sm leading-relaxed text-black/75">{answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
