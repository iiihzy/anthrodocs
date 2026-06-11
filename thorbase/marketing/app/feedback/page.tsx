"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

const RESPONSE_OPTIONS = [
  { value: "24h", label: "Within 24 hours" },
  { value: "3d", label: "Within 3 business days" },
  { value: "1w", label: "Within 1 week" },
  { value: "norush", label: "No rush" },
];

export default function FeedbackPage() {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const inIframe = window.self !== window.top;
    const embedParam = new URLSearchParams(window.location.search).get("embed") === "true";
    const embedded = inIframe || embedParam;
    setIsEmbedded(embedded);
    if (embedded) {
      document.body.classList.add("iframe-embed");
    }
    return () => {
      document.body.classList.remove("iframe-embed");
    };
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      organization: (form.elements.namedItem("organization") as HTMLInputElement).value.trim(),
      contact: (form.elements.namedItem("contact") as HTMLInputElement).value.trim(),
      username: (form.elements.namedItem("username") as HTMLInputElement).value.trim(),
      body: (form.elements.namedItem("body") as HTMLTextAreaElement).value.trim(),
      expectedResponse: (form.elements.namedItem("expectedResponse") as HTMLSelectElement).value,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit feedback");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }, []);

  if (submitted) {
    return (
      <main className="mx-auto w-[min(720px,94vw)] py-12">
        <div className="rounded-lg border border-black/10 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-black">Thank you for your feedback!</h2>
          <p className="mt-2 text-black/60">We&apos;ll get back to you as soon as possible.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`mx-auto w-[min(720px,94vw)] py-12 ${isEmbedded ? "py-6" : ""}`}>
      <h1 className="text-2xl font-semibold tracking-tight text-black">Feedback</h1>
      <p className="mt-2 text-black/60">Share your thoughts, issues, or suggestions with us.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-black">
              Name <span className="text-primary">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50 focus:ring-1 focus:ring-black/20"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="organization" className="text-sm font-medium text-black">
              Organization
            </label>
            <input
              id="organization"
              name="organization"
              className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50 focus:ring-1 focus:ring-black/20"
              placeholder="Your company or organization"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact" className="text-sm font-medium text-black">
              Email or Phone <span className="text-primary">*</span>
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              required
              className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50 focus:ring-1 focus:ring-black/20"
              placeholder="your@email.com or phone number"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-black">
              TokenGO Username
            </label>
            <input
              id="username"
              name="username"
              className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50 focus:ring-1 focus:ring-black/20"
              placeholder="Your TokenGO account username"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="body" className="text-sm font-medium text-black">
            Message <span className="text-primary">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={6}
            className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50 focus:ring-1 focus:ring-black/20 resize-y"
            placeholder="Describe your feedback, issue, or suggestion..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="expectedResponse" className="text-sm font-medium text-black">
            Expected Response Time
          </label>
          <select
            id="expectedResponse"
            name="expectedResponse"
            defaultValue="3d"
            className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50 focus:ring-1 focus:ring-black/20"
          >
            {RESPONSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-primary">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-2 self-start">
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </main>
  );
}
