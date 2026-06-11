"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ModelIcon } from "@/components/model-icon";
import { getModelPricingRows } from "@/lib/content-repository";
import type { ModelPricingRow } from "@/lib/content-repository";

export function ModelsPricingTable() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<ModelPricingRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    getModelPricingRows().then((data) => {
      if (!cancelled) {
        setRows(data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      `${row.company} ${row.model}`.toLowerCase().includes(term)
    );
  }, [query, rows]);

  return (
    <section className="mt-8" aria-label="Model pricing catalog">
      <Card className="rounded-none border-border bg-model-card p-5 text-model-foreground shadow-none">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Model pricing catalog</h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by company or model"
            className="h-10 w-full rounded-md border border-border/40 bg-background/5 px-3 text-sm text-model-foreground outline-none placeholder:text-model-foreground/60 focus:border-border md:w-72"
          />
        </div>
        <div className="mt-4 overflow-x-auto rounded-none border border-border/40 bg-background/5">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-card-header text-model-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">Model</th>
                <th className="px-3 py-2 font-semibold">Modalities</th>
                <th className="px-3 py-2 font-semibold">Input</th>
                <th className="px-3 py-2 font-semibold">Output</th>
                <th className="px-3 py-2 font-semibold">Cache</th>
                <th className="px-3 py-2 font-semibold">Context</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                return (
                  <tr key={row.id} className="border-t border-border/40">
                    <td className="px-3 py-2 font-medium">
                      <div className="flex items-center gap-2">
                        <ModelIcon icon={row.icon} size={18} className="shrink-0 opacity-90" />
                        <span>{row.model}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap items-center gap-1">
                        {row.inputModalities.map((item) => (
                          <span key={`${row.id}-i-${item}`} className="border border-border/40 px-1.5 py-0.5 text-[11px]">
                            {item}
                          </span>
                        ))}
                        <span className="text-model-foreground/60">{"->"}</span>
                        {row.outputModalities.map((item) => (
                          <span key={`${row.id}-o-${item}`} className="border border-border/40 px-1.5 py-0.5 text-[11px]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">{row.inputPrice}</td>
                    <td className="px-3 py-2">{row.outputPrice}</td>
                    <td className="px-3 py-2">{row.cachePrice}</td>
                    <td className="px-3 py-2">{row.context}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
