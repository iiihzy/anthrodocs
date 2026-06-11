import Link from "next/link";

const footerColumns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Models", href: "/models" },
      { label: "Pricing", href: "/pricing" }
    ]
  },
  {
    title: "Marketing",
    links: [
      { label: "Enterprise", href: "/enterprise" }
      // { label: "Promotions", href: "#" },
      // { label: "Referral program", href: "#" }
    ]
  },
  { title: "Developers", links: [{ label: "Docs", href: "/docs" }, { label: "Updates", href: "#" }] },
  {
    title: "Company",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Feedback", href: "/feedback" },
      { label: "Privacy", href: "/privacy" }
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-black/15 text-black">
      <div className="mx-auto grid w-[min(1200px,94vw)] grid-cols-1 gap-6 py-8 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="max-w-[360px]">
          <Link className="font-semibold no-underline" href="/">TokenGO</Link>
          <p className="mt-2.5 leading-relaxed">
            An AI API interface for model routing, usage, and chat operations.
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-4 lg:text-right" aria-label="Footer sections">
          {footerColumns.map((column) => (
            <nav key={column.title} className="flex flex-col gap-2 lg:items-end">
              <h2 className="m-0 text-[0.95rem] font-semibold">{column.title}</h2>
              <ul className="m-0 list-none space-y-1.5 p-0">
                {column.links.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("http") ? (
                      <a
                        className="text-sm text-black no-underline hover:underline"
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link className="text-sm text-black no-underline hover:underline" href={item.href}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="mx-auto flex w-[min(1200px,94vw)] items-center justify-between border-t border-black/10 py-4 text-xs text-black/50">
        <span>&copy; {new Date().getFullYear()} TokenGO</span>
        <div className="flex items-center gap-3">
          <a
            className="inline-flex items-center text-black/60 no-underline hover:opacity-80"
            href="https://discord.gg/gbQVnMze"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join our Discord"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3a14.65 14.65 0 0 0-.67 1.377 18.27 18.27 0 0 0-5.487 0A12.683 12.683 0 0 0 9.731 3a19.736 19.736 0 0 0-3.76 1.369C2.566 9.281 1.66 14.06 2.113 18.769a19.9 19.9 0 0 0 6.073 3.066 14.66 14.66 0 0 0 1.297-2.106 12.83 12.83 0 0 1-2.043-.98c.171-.126.339-.258.5-.392a14.155 14.155 0 0 0 12.12 0c.163.135.331.266.5.392a12.86 12.86 0 0 1-2.046.981 14.62 14.62 0 0 0 1.297 2.105 19.876 19.876 0 0 0 6.073-3.066c.5-5.475-.838-10.213-3.567-14.4ZM9.546 15.94c-1.182 0-2.156-1.082-2.156-2.412 0-1.33.955-2.413 2.156-2.413 1.205 0 2.176 1.092 2.156 2.413 0 1.33-.955 2.412-2.156 2.412Zm4.908 0c-1.182 0-2.156-1.082-2.156-2.412 0-1.33.955-2.413 2.156-2.413 1.205 0 2.176 1.092 2.156 2.413 0 1.33-.951 2.412-2.156 2.412Z" />
            </svg>
          </a>
          <a
            className="inline-flex items-center gap-1.5 no-underline hover:opacity-80"
            href="https://status.tokengo.com/status/thorbase"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://status.tokengo.com/api/badge/1/status?style=flat-square&upLabel=Operational&downLabel=Down"
              alt="System Status"
              height={20}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
