import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModelsCatalog } from "@/lib/content-repository";

type PageProps = { params: Promise<{ modelSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { modelSlug } = await params;
  const models = await getModelsCatalog();
  const model = models.find((item) => item.id === modelSlug);
  if (!model) {
    return { title: "Model not found · TokenGO" };
  }
  const description = `${model.name} by ${model.company} on TokenGO — input ${model.inputPrice}, output ${model.outputPrice}, ${model.context} context.`;
  return {
    title: `${model.name} · TokenGO`,
    description,
    alternates: { canonical: `/models/${model.id}` },
    openGraph: { title: `${model.name} · TokenGO`, description, type: "article" },
    twitter: { card: "summary", title: `${model.name} · TokenGO`, description }
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { modelSlug } = await params;
  const models = await getModelsCatalog();
  const model = models.find((item) => item.id === modelSlug);

  if (!model) notFound();

  return (
    <main className="mx-auto w-[min(840px,92vw)] pt-3 pb-12 text-model-foreground">
      <Link className="text-sm no-underline text-black hover:underline" href="/models">
        Back to models
      </Link>
      <section className="mt-4 overflow-hidden rounded-none border border-border bg-model-card p-6 text-model-foreground shadow-sm">
        <div>
          <div className="inline-flex items-center px-0 py-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-model-foreground/70">
            Model profile
          </div>
          <div className="mt-3 border border-border/40 bg-background/5 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-model-foreground/65">{model.company}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-model-foreground">{model.name}</h1>
          </div>

          <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            <p className="flex items-center justify-between gap-4 border border-border/40 bg-background/5 px-3 py-2.5">
              <span className="font-semibold text-model-foreground/80">Input price</span>
              <span className="text-right font-semibold">{model.inputPrice}</span>
            </p>
            <p className="flex items-center justify-between gap-4 border border-border/40 bg-background/5 px-3 py-2.5">
              <span className="font-semibold text-model-foreground/80">Output price</span>
              <span className="text-right font-semibold">{model.outputPrice}</span>
            </p>
            <p className="flex items-center justify-between gap-4 border border-border/40 bg-background/5 px-3 py-2.5">
              <span className="font-semibold text-model-foreground/80">Cache price</span>
              <span className="text-right font-semibold">{model.cachePrice}</span>
            </p>
            <p className="flex items-center justify-between gap-4 border border-border/40 bg-background/5 px-3 py-2.5">
              <span className="font-semibold text-model-foreground/80">Context</span>
              <span className="text-right font-semibold">{model.context}</span>
            </p>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-start justify-between gap-4 border border-border/40 bg-background/5 px-3 py-2.5">
              <span className="font-semibold text-model-foreground/80">Input modalities</span>
              <span className="max-w-[65%] text-right">{model.inputModalities.join(", ")}</span>
            </p>
            <p className="flex items-start justify-between gap-4 border border-border/40 bg-background/5 px-3 py-2.5">
              <span className="font-semibold text-model-foreground/80">Output modalities</span>
              <span className="max-w-[65%] text-right">{model.outputModalities.join(", ")}</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
