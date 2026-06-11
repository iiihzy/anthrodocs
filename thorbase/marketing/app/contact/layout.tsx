import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us — TokenGO",
  description: "Get in touch with the TokenGO team by email.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact us — TokenGO",
    description: "Get in touch with the TokenGO team by email.",
    type: "website",
    url: "/contact"
  },
  twitter: {
    card: "summary",
    title: "Contact us — TokenGO",
    description: "Get in touch with the TokenGO team by email."
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
