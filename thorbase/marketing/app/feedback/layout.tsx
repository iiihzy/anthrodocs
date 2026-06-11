import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback — TokenGO",
  description: "Share your thoughts, issues, or suggestions with us.",
  alternates: { canonical: "/feedback" },
  openGraph: {
    title: "Feedback — TokenGO",
    description: "Share your thoughts, issues, or suggestions with us.",
    type: "website",
    url: "/feedback"
  },
  twitter: {
    card: "summary",
    title: "Feedback — TokenGO",
    description: "Share your thoughts, issues, or suggestions with us."
  }
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
