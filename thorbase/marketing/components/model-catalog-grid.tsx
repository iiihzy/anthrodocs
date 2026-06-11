import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelIcon } from "@/components/model-icon";
import { getModelsCatalog } from "@/lib/content-repository";

export async function ModelCatalogGrid({ featured }: { featured?: string[] } = {}) {
  const modelsCatalog = await getModelsCatalog();
  const displayed = featured
    ? featured
        .map((q) => {
          const needle = q.toLowerCase();
          return modelsCatalog.find((m) => m.name.toLowerCase().includes(needle));
        })
        .filter((m): m is (typeof modelsCatalog)[number] => Boolean(m))
    : modelsCatalog;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {displayed.map((model) => (
        <Card key={model.name} className="overflow-hidden rounded-xl">
          <CardHeader>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base">{model.name}</CardTitle>
                <CardDescription className="mt-1 text-xs uppercase tracking-wide text-model-foreground/80">
                  {model.company}
                </CardDescription>
              </div>
              <ModelIcon icon={model.icon} size={28} className="shrink-0 opacity-90" />
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2 rounded-md border border-border/40 bg-background/5 px-2 py-1.5">
                <div className="flex min-w-0 flex-wrap items-center gap-1">
                  <p className="text-[10px] uppercase tracking-wide text-model-foreground/65">In</p>
                  {model.inputModalities.map((modality) => (
                    <span key={`${model.name}-in-${modality}`} className="rounded-sm border border-border/40 px-1 py-0.5 text-[10px] text-model-foreground/85">
                      {modality}
                    </span>
                  ))}
                </div>
                <div className="flex min-w-0 flex-wrap items-center justify-end gap-1">
                  <p className="text-[10px] uppercase tracking-wide text-model-foreground/65">Out</p>
                  {model.outputModalities.map((modality) => (
                    <span key={`${model.name}-out-${modality}`} className="rounded-sm border border-border/40 px-1 py-0.5 text-[10px] text-model-foreground/85">
                      {modality}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 border-t border-border/30 pt-1 text-[11px]">
                <div className={`flex items-center justify-between gap-2${model.isPerCall ? " invisible" : ""}`}>
                  <span className="uppercase tracking-wide text-model-foreground/65">Input</span>
                  <span className="font-semibold text-model-foreground">{model.inputPrice}</span>
                </div>
                <div className={`flex items-center justify-between gap-2${model.isPerCall ? " invisible" : ""}`}>
                  <span className="uppercase tracking-wide text-model-foreground/65">Output</span>
                  <span className="font-semibold text-model-foreground">{model.outputPrice}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="uppercase tracking-wide text-model-foreground/65">Context</span>
                  <span className="font-semibold text-model-foreground">{model.context}</span>
                </div>
              </div>
            </CardContent>
          </Card>
      ))}
    </div>
  );
}
