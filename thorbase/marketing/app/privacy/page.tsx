import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · TokenGO",
  description: "How TokenGO collects, uses, and safeguards your information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy · TokenGO",
    description: "How TokenGO collects, uses, and safeguards your information.",
    type: "article",
    url: "/privacy"
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy · TokenGO",
    description: "How TokenGO collects, uses, and safeguards your information."
  }
};

const LAST_UPDATED = "May 13, 2026";

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. Introduction",
    body: (
      <p>
        TokenGO (&quot;TokenGO,&quot; &quot;we,&quot; &quot;us&quot;) provides an LLM API aggregation
        and distribution platform. This Privacy Policy explains what information we collect when you
        use our website, dashboard, and APIs (collectively, the &quot;Services&quot;), how we use it,
        and the choices you have. By using the Services you agree to the practices described here.
      </p>
    )
  },
  {
    heading: "2. Information we collect",
    body: (
      <>
        <p>We collect the following categories of information:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold">Account data.</span> Name, email, organization, and
            authentication identifiers you provide when signing up.
          </li>
          <li>
            <span className="font-semibold">Billing data.</span> Payment method details, billing
            address, and transaction history, processed through our payment providers.
          </li>
          <li>
            <span className="font-semibold">API request metadata.</span> API keys, timestamps,
            model identifiers, token counts, latency, and routing decisions associated with your
            requests.
          </li>
          <li>
            <span className="font-semibold">Prompt and response content.</span> Inputs you send to
            models and the outputs returned. We process this content only to deliver responses and,
            where you have opted in, to provide debugging assistance.
          </li>
          <li>
            <span className="font-semibold">Usage and device data.</span> IP address, user agent,
            referrer, and product analytics events about how you interact with our website and
            dashboard.
          </li>
          <li>
            <span className="font-semibold">Communications.</span> Messages you send to support,
            sales, or via embedded forms.
          </li>
        </ul>
      </>
    )
  },
  {
    heading: "3. How we use information",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>To operate, secure, and improve the Services.</li>
        <li>To route requests to the appropriate model provider and enforce rate limits and quotas.</li>
        <li>To bill customers and prevent abuse, fraud, and misuse of the platform.</li>
        <li>To provide customer support and respond to inquiries.</li>
        <li>To send transactional notices and, with consent where required, product updates.</li>
        <li>To comply with legal obligations and enforce our Terms of Service.</li>
      </ul>
    )
  },
  {
    heading: "4. Prompt and response data",
    body: (
      <p>
        We do not train our own models on customer prompts or responses. To deliver an inference,
        request content is transmitted to the third-party model provider you have selected via
        routing rules; their handling is governed by their own policies. By default we retain
        prompt and response content only for the period needed to deliver and bill the request,
        plus a short window for abuse review. Enterprise customers can configure zero-retention
        routing on supported models.
      </p>
    )
  },
  {
    heading: "5. Sharing of information",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-semibold">Model providers.</span> We forward request content and
          minimal routing metadata to the upstream provider serving your selected model.
        </li>
        <li>
          <span className="font-semibold">Service providers.</span> Hosting, analytics, payment,
          email, and customer support vendors acting on our behalf under written agreements.
        </li>
        <li>
          <span className="font-semibold">Legal and safety.</span> When required by law, to protect
          users, or to investigate suspected abuse of the Services.
        </li>
        <li>
          <span className="font-semibold">Business transfers.</span> In connection with a merger,
          acquisition, financing, or sale of assets, subject to confidentiality.
        </li>
      </ul>
    )
  },
  {
    heading: "6. Payment processing",
    body: (
      <p>
        We use Stripe for payment, analytics, and other business services. Stripe collects
        identifying information about the devices that connect to its services. Stripe uses this
        information to operate and improve the services it provides to us, including for fraud
        detection. You can learn more about Stripe and read its privacy policy at{" "}
        <a className="underline" href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
          https://stripe.com/privacy
        </a>
        .
      </p>
    )
  },
  {
    heading: "7. Data retention",
    body: (
      <p>
        We retain account and billing data for as long as your account is active and for a
        reasonable period afterward to satisfy tax, accounting, and legal obligations. Request
        metadata is retained for analytics and abuse review. You can request deletion of your
        account data at any time, subject to legal retention requirements.
      </p>
    )
  },
  {
    heading: "8. Security",
    body: (
      <p>
        We use industry-standard administrative, technical, and physical safeguards to protect
        your information, including encryption in transit, least-privilege access controls, audit
        logging, and regular review of our security posture. No system is completely secure; please
        protect your API keys and notify us promptly if you suspect unauthorized access.
      </p>
    )
  },
  {
    heading: "9. Your rights and choices",
    body: (
      <p>
        Depending on your jurisdiction you may have the right to access, correct, export, or delete
        your personal information, and to object to or restrict certain processing. You can exercise
        these rights through your dashboard settings or by contacting us at the address below. We
        will not discriminate against you for exercising any of these rights.
      </p>
    )
  },
  {
    heading: "10. International transfers",
    body: (
      <p>
        We operate globally. Your information may be processed in countries other than the one in
        which you reside. Where required, we rely on appropriate safeguards such as standard
        contractual clauses for cross-border transfers.
      </p>
    )
  },
  {
    heading: "11. Children",
    body: (
      <p>
        The Services are not directed to children under 13 (or the equivalent minimum age in your
        jurisdiction). We do not knowingly collect personal information from children.
      </p>
    )
  },
  {
    heading: "12. Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we make material changes we will
        update the &quot;Last updated&quot; date above and, where appropriate, provide additional
        notice through the Services.
      </p>
    )
  },
  {
    heading: "13. Contact us",
    body: (
      <p>
        Questions about this policy or our data practices? Email{" "}
        <a className="underline" href="mailto:ed@hextgroup.com">
          us.
        </a>
        .
      </p>
    )
  }
];

export default function PrivacyPage() {
  return (
    <main className="pt-6 pb-12 text-black">
      <div className="mx-auto w-[min(820px,92vw)]">
        <section aria-label="Privacy policy header" className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/60">Legal</p>
          <h1 className="mt-2 text-[clamp(1.9rem,4.6vw,3rem)] font-semibold tracking-tight text-black">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-black/60">Last updated: {LAST_UPDATED}</p>
        </section>

        <article className="space-y-8 text-sm leading-relaxed text-black/80">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base font-semibold text-black">{section.heading}</h2>
              <div className="mt-2">{section.body}</div>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
