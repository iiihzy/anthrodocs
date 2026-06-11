"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModelIcon } from "@/components/model-icon";

type LeaderboardRow = {
  model: string;
  company: string;
  icon: string;
  benchmark: number;
  outputPrice: number;
};

/** Standard palette for benchmark bars; keyed by company name. */
const companyBarColors: Record<string, string> = {
  Google: "#3B82F6",
  Anthropic: "#F97316",
  Zhipu: "#A855F7",
  OpenAI: "#31C951",
  DeepSeek: "#EF4444",
  Alibaba: "#EAB308",
  Moonshot: "#EC4899",
  Meta: "#3B82F6",
  Mistral: "#A855F7",
  MiniMax: "#F97316",
  xAI: "#EF4444",
  Microsoft: "#31C951"
};

function barColorForCompany(company: string): string {
  return companyBarColors[company] ?? "#31C951";
}

/** Benchmark data only – prices come from the API via props.
 *  `modelId` maps to the API's `model_name` field. */
const benchmarkData = [
  { modelId: "google/gemini-3.1-pro-preview", model: "Gemini 3.1 Pro Preview", company: "Google", icon: "Gemini.Color", benchmark: 57 },
  { modelId: "anthropic/claude-opus-4.6", model: "Claude Opus 4.6", company: "Anthropic", icon: "Claude.Color", benchmark: 53 },
  { modelId: "zhipu/glm-5", model: "GLM-5", company: "Zhipu", icon: "ChatGLM.Color", benchmark: 50 },
  { modelId: "openai/gpt-5.4", model: "GPT-5.4", company: "OpenAI", icon: "OpenAI", benchmark: 57 },
  { modelId: "deepseek/deepseek-v3.2", model: "DeepSeek V3.2", company: "DeepSeek", icon: "DeepSeek.Color", benchmark: 42 },
  { modelId: "qwen/qwen3.6-plus", model: "Qwen 3.6 Plus", company: "Alibaba", icon: "Qwen.Color", benchmark: 50 },
  { modelId: "moonshot/kimi-k2.5", model: "Kimi K2.5", company: "Moonshot", icon: "Moonshot", benchmark: 47 },
  { modelId: "minimax/mimo-v2-pro", model: "MiMo-V2-Pro", company: "MiniMax", icon: "Minimax.Color", benchmark: 49 },
  { modelId: "minimax/minimax-m2.7", model: "MiniMax M2.7", company: "MiniMax", icon: "Minimax.Color", benchmark: 50 },
  { modelId: "qwen/qwen3.5-397b-a17b", model: "Qwen 3.5 397B A17B", company: "Alibaba", icon: "Qwen.Color", benchmark: 45 },
];

const benchmarkLabel = "Selected benchmark";
const maxBenchmarkScore = 60;

export function ModelRankingLeaderboard({ outputPrices = {} }: { outputPrices?: Record<string, number> }) {
  const [sortBy, setSortBy] = useState<"benchmark" | "value">("benchmark");

  const sortedRows = useMemo(() => {
    const rows: (LeaderboardRow & { sourceIndex: number; valueIndex: number })[] = benchmarkData.map((row, sourceIndex) => {
      const outputPrice = outputPrices[row.modelId] ?? 0;
      return {
        ...row,
        outputPrice,
        sourceIndex,
        valueIndex: outputPrice > 0 ? row.benchmark / outputPrice : 0,
      };
    });
    rows.sort((a, b) =>
      sortBy === "benchmark"
        ? b.benchmark - a.benchmark || a.sourceIndex - b.sourceIndex
        : b.valueIndex - a.valueIndex || a.sourceIndex - b.sourceIndex
    );
    return rows;
  }, [sortBy, outputPrices]);

  return (
    <section
      className="mt-8 rounded-xl border border-border bg-model-card p-5 text-model-foreground shadow-sm"
      aria-label="Model leaderboard"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-model-foreground">Model ranking leaderboard</h3>
          <p className="mt-1 text-sm text-model-foreground/80">
            Benchmark scores from artificialanalysis.ai
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          aria-pressed={sortBy === "value"}
          aria-label={
            sortBy === "benchmark"
              ? "Switch ranking to value index"
              : "Switch ranking to benchmark score"
          }
          className="shrink-0 rounded-lg border border-border/40 bg-card-header px-3 py-2 text-xs text-model-foreground hover:bg-model-foreground/10"
          onClick={() => setSortBy((s) => (s === "benchmark" ? "value" : "benchmark"))}
        >
          {sortBy === "benchmark" ? "Rank by value index" : "Rank by benchmark"}
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border/40 bg-background/5">
        <table className="w-full min-w-[820px] text-left text-sm">
          <colgroup>
            <col className="w-[7%]" />
            <col className="w-[26%]" />
            <col className="w-[39%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="bg-card-header text-[12px] uppercase tracking-[0.08em] text-model-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold">{benchmarkLabel}</th>
              <th className="px-4 py-3 font-semibold">AVG OUTPUT PRICE / 1M</th>
              <th className="px-4 py-3 font-semibold">Value index</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => {
              return (
                <tr
                  key={`${row.company}-${row.model}-${index}`}
                  className="border-t border-border/40 odd:bg-transparent even:bg-background/5"
                >
                  <td className="px-4 py-3 text-model-foreground">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-model-foreground/20 bg-model-foreground/10 px-1.5 text-xs font-semibold tabular-nums text-model-foreground">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-model-foreground">
                    <div className="flex min-w-0 items-center gap-2">
                      <ModelIcon icon={row.icon} size={20} className="shrink-0 opacity-90" />
                      <span className="min-w-0">{row.model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-model-foreground">
                    <div className="flex items-center gap-3">
                      <span className="w-16 shrink-0 tabular-nums text-model-foreground/80">
                        {row.benchmark}/{maxBenchmarkScore}
                      </span>
                      <div className="h-2.5 w-full rounded-full bg-model-foreground/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((row.benchmark / maxBenchmarkScore) * 100, 100)}%`,
                            backgroundColor: barColorForCompany(row.company)
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-model-foreground">${row.outputPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 tabular-nums text-model-foreground">{row.valueIndex.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-model-foreground/75">
        Value index = benchmark score ÷ average output price per 1M tokens (higher means more score per dollar). Bars
        still reflect raw benchmark only; use the index to compare cost-adjusted appeal.
      </p>
    </section>
  );
}
