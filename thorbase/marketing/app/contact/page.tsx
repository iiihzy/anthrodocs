"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      organization: (form.elements.namedItem("organization") as HTMLInputElement).value.trim(),
      contact: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      username: "",
      body: (form.elements.namedItem("body") as HTMLTextAreaElement).value.trim(),
      expectedResponse: "3d",
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
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
          <h2 className="text-xl font-semibold text-black">Thanks for reaching out!</h2>
          <p className="mt-2 text-black/60">We&apos;ll reply to your email as soon as we can.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(720px,94vw)] py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-black">Contact us</h1>
      <p className="mt-2 text-black/60">Send us a message and we&apos;ll get back to you by email.</p>

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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-black">
            Email <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50 focus:ring-1 focus:ring-black/20"
            placeholder="your@email.com"
          />
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
            placeholder="How can we help?"
          />
        </div>

        {error && <p className="text-sm text-primary">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-2 self-start">
          {submitting ? "Sending..." : "Send message"}
        </Button>
      </form>
    </main>
  );
}
