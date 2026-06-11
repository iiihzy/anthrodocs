import type { ComponentType, ReactNode } from "react";

// ────────────────────────────────────────────────────────────
// AffordableNotSlow
// Drop-in section for app/page.tsx, sits between
// <section> Models </section> and <section> An intelligence grid. </section>
// ────────────────────────────────────────────────────────────

// SVG fills/strokes use currentColor so we can drive color from the
// parent via Tailwind text-{primary|secondary} (which read --primary
// and --secondary). This keeps the diagrams in lockstep with the theme.

function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono uppercase tracking-[0.18em] ${className}`}>
      {children}
    </span>
  );
}

// ─── Diagram 01 · Smart routing ─────────────────────────────
// Requests of different "shapes" land on supply of matching shape.
function DiagramRouting() {
  return (
    <svg viewBox="0 0 280 130" className="h-full w-full text-secondary" aria-hidden>
      {/* left: three request shapes */}
      <g fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" fillOpacity="0.6">
        <text x="8" y="14">REQ · SHORT</text>
        <text x="8" y="58">REQ · MEDIUM</text>
        <text x="8" y="102">REQ · LONG-CTX</text>
      </g>

      <g stroke="currentColor" strokeOpacity="0.55" fill="none">
        <rect x="8" y="18" width="14" height="10" rx="1.5" />
        <rect x="8" y="62" width="42" height="10" rx="1.5" />
        <rect x="8" y="106" width="78" height="10" rx="1.5" />
      </g>

      {/* router pivot */}
      <g transform="translate(140,65)">
        <circle r="14" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <circle r="3" className="accent-blink fill-primary" />
        <text
          textAnchor="middle"
          y="-20"
          fontFamily="JetBrains Mono"
          fontSize="7"
          fill="currentColor"
          fillOpacity="0.7"
        >
          ROUTER
        </text>
      </g>

      {/* connectors */}
      <g stroke="currentColor" strokeOpacity="0.5" fill="none" className="flow-anim">
        <path d="M22 23 C 70 23, 100 60, 128 62" />
        <path d="M50 67 C 90 67, 110 66, 128 66" />
        <path d="M86 111 C 100 111, 110 72, 128 70" />

        <path d="M153 60 C 180 50, 200 36, 232 32" />
        <path d="M154 65 C 190 65, 210 70, 232 72" />
        <path d="M153 70 C 180 80, 200 100, 232 110" />
      </g>

      {/* right: GPU pools matched to request shape */}
      <g stroke="currentColor" strokeOpacity="0.55" fill="none">
        {/* small pool */}
        <rect x="232" y="22" width="40" height="20" rx="2" />
        <line x1="244" y1="22" x2="244" y2="42" />
        <line x1="256" y1="22" x2="256" y2="42" />
        {/* mid pool */}
        <rect x="232" y="62" width="40" height="20" rx="2" />
        <line x1="240" y1="62" x2="240" y2="82" />
        <line x1="248" y1="62" x2="248" y2="82" />
        <line x1="256" y1="62" x2="256" y2="82" />
        <line x1="264" y1="62" x2="264" y2="82" />
        {/* big pool */}
        <rect x="232" y="100" width="40" height="20" rx="2" />
        <line x1="238" y1="100" x2="238" y2="120" />
        <line x1="244" y1="100" x2="244" y2="120" />
        <line x1="250" y1="100" x2="250" y2="120" />
        <line x1="256" y1="100" x2="256" y2="120" />
        <line x1="262" y1="100" x2="262" y2="120" />
        <line x1="268" y1="100" x2="268" y2="120" />
      </g>
    </svg>
  );
}

// ─── Diagram 02 · Hardware adaptation ───────────────────────
// Parallelism scales with the request's compute profile.
const HW_COLS = 16;
const HW_ROWS = 4;
const HW_CELL_W = 13;
const HW_CELL_H = 10;
const HW_GAP = 3;
const HW_START_X = 16;
const HW_START_Y = 38;
const HW_GROUPS: { x: number; w: number; label: string; accent: boolean }[] = [
  { x: 0, w: 2, label: "×2", accent: false },
  { x: 2, w: 6, label: "×6", accent: false },
  { x: 8, w: 3, label: "×3", accent: false },
  { x: 11, w: 5, label: "×5", accent: true }
];

function DiagramHardware() {
  const cells: ReactNode[] = [];
  for (let r = 0; r < HW_ROWS; r++) {
    for (let c = 0; c < HW_COLS; c++) {
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={HW_START_X + c * (HW_CELL_W + HW_GAP)}
          y={HW_START_Y + r * (HW_CELL_H + HW_GAP)}
          width={HW_CELL_W}
          height={HW_CELL_H}
          rx="1.5"
          fill="currentColor"
          fillOpacity={0.08 + (r / HW_ROWS) * 0.12}
          stroke="currentColor"
          strokeOpacity="0.35"
        />
      );
    }
  }

  return (
    <svg viewBox="0 0 280 130" className="h-full w-full text-secondary" aria-hidden>
      <text x="14" y="14" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" fillOpacity="0.65">
        CLUSTER · 64 GPU
      </text>
      <text
        x="266"
        y="14"
        textAnchor="end"
        fontFamily="JetBrains Mono"
        fontSize="7"
        fill="currentColor"
        fillOpacity="0.65"
      >
        UTIL 98%
      </text>

      {cells}

      {/* group brackets */}
      <g fill="none">
        {HW_GROUPS.map((g) => {
          const x1 = HW_START_X + g.x * (HW_CELL_W + HW_GAP) - 1;
          const x2 = x1 + g.w * (HW_CELL_W + HW_GAP) - HW_GAP + 2;
          const y = 30;
          const colorClass = g.accent ? "text-primary" : "text-secondary";
          const op = g.accent ? 0.9 : 0.55;
          return (
            <g key={g.label} className={colorClass} stroke="currentColor" strokeOpacity={op}>
              <path d={`M${x1} ${y + 4} L${x1} ${y} L${x2} ${y} L${x2} ${y + 4}`} />
              <text
                x={(x1 + x2) / 2}
                y={y - 3}
                textAnchor="middle"
                fontFamily="JetBrains Mono"
                fontSize="7"
                fill="currentColor"
                fillOpacity={op}
              >
                {g.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* legend */}
      <g fontFamily="JetBrains Mono" fontSize="7">
        <text x="14" y="124" fill="currentColor" fillOpacity="0.6">
          REQ A
        </text>
        <text x="58" y="124" fill="currentColor" fillOpacity="0.6">
          REQ B
        </text>
        <text x="148" y="124" fill="currentColor" fillOpacity="0.6">
          REQ C
        </text>
        <text x="200" y="124" className="fill-primary" fillOpacity="0.95">
          REQ D · LONG CTX
        </text>
      </g>
    </svg>
  );
}

// ─── Diagram 03 · Inference engine optimization ─────────────
// Warp-scheduling reorder: scattered → packed.
const KERNEL_CELL_W = 8;
const KERNEL_CELL_H = 8;
const KERNEL_GAP = 2;
const KERNEL_X0 = 14;
const KERNEL_X1 = 160;
const KERNEL_Y0 = 30;
const KERNEL_COLS = 10;

const KERNEL_BEFORE: number[][] = [
  [1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [0, 1, 0, 1, 0, 0, 1, 0, 1, 0]
];
const KERNEL_AFTER: number[][] = KERNEL_BEFORE.map((row) => {
  const ones = row.reduce((a, b) => a + b, 0);
  return Array.from({ length: KERNEL_COLS }, (_, c) => (c < ones ? 1 : 0));
});

function KernelGrid({ data, x, accent = false }: { data: number[][]; x: number; accent?: boolean }) {
  return (
    <>
      {data.flatMap((row, r) =>
        row.map((v, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + c * (KERNEL_CELL_W + KERNEL_GAP)}
            y={KERNEL_Y0 + r * (KERNEL_CELL_H + KERNEL_GAP)}
            width={KERNEL_CELL_W}
            height={KERNEL_CELL_H}
            rx="1"
            fill={v ? "currentColor" : "none"}
            className={v && accent ? "text-primary" : "text-secondary"}
            fillOpacity={v ? (accent ? 0.85 : 0.55) : 0}
            stroke="currentColor"
            strokeOpacity={v ? 0 : 0.22}
          />
        ))
      )}
    </>
  );
}

function DiagramKernels() {
  return (
    <svg viewBox="0 0 280 130" className="h-full w-full text-secondary" aria-hidden>
      <text x={KERNEL_X0} y="18" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" fillOpacity="0.65">
        STOCK SCHEDULE
      </text>
      <text x={KERNEL_X1} y="18" fontFamily="JetBrains Mono" fontSize="7" className="fill-primary" fillOpacity="0.9">
        OUR SCHEDULE
      </text>

      <KernelGrid data={KERNEL_BEFORE} x={KERNEL_X0} />
      <KernelGrid data={KERNEL_AFTER} x={KERNEL_X1} accent />

      {/* arrow */}
      <g stroke="currentColor" strokeOpacity="0.5" fill="none">
        <line x1="120" y1="60" x2="150" y2="60" />
        <path d="M150 60 L144 56 M150 60 L144 64" />
      </g>
      <text x="135" y="52" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" fillOpacity="0.65">
        REWRITE
      </text>

      <text x={KERNEL_X0} y="120" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" fillOpacity="0.55">
        WARP UTIL · 41%
      </text>
      <text x={KERNEL_X1} y="120" fontFamily="JetBrains Mono" fontSize="7" className="fill-primary" fillOpacity="0.9">
        WARP UTIL · 92%
      </text>
    </svg>
  );
}

// ─── Diagram 04 · Cache layer ───────────────────────────────
// Prefix + KV state reused across requests.
const CACHE_TOKEN_W = 9;
const CACHE_TOKEN_H = 10;
const CACHE_GAP = 2;
const CACHE_START_X = 50;
const CACHE_ROWS: { y: number; label: string; prefix: number; tail: number }[] = [
  { y: 30, label: "REQ 1", prefix: 10, tail: 6 },
  { y: 58, label: "REQ 2", prefix: 10, tail: 8 },
  { y: 86, label: "REQ 3", prefix: 10, tail: 4 }
];

function DiagramCache() {
  return (
    <svg viewBox="0 0 280 130" className="h-full w-full text-secondary" aria-hidden>
      <text x="14" y="18" fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" fillOpacity="0.65">
        TOKENS →
      </text>
      <text x="266" y="18" textAnchor="end" fontFamily="JetBrains Mono" fontSize="7" className="fill-primary" fillOpacity="0.9">
        ▰ REUSED FROM CACHE
      </text>

      {CACHE_ROWS.map((row) => (
        <g key={row.label}>
          <text x="14" y={row.y + 8} fontFamily="JetBrains Mono" fontSize="7" fill="currentColor" fillOpacity="0.65">
            {row.label}
          </text>
          {Array.from({ length: row.prefix }, (_, t) => (
            <rect
              key={`p-${t}`}
              x={CACHE_START_X + t * (CACHE_TOKEN_W + CACHE_GAP)}
              y={row.y}
              width={CACHE_TOKEN_W}
              height={CACHE_TOKEN_H}
              rx="1.5"
              className="fill-primary"
              fillOpacity={0.78}
            />
          ))}
          {Array.from({ length: row.tail }, (_, t) => (
            <rect
              key={`t-${t}`}
              x={CACHE_START_X + (row.prefix + t) * (CACHE_TOKEN_W + CACHE_GAP)}
              y={row.y}
              width={CACHE_TOKEN_W}
              height={CACHE_TOKEN_H}
              rx="1.5"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.5"
            />
          ))}
        </g>
      ))}

      {/* bracket grouping the prefix column */}
      <g className="text-primary" stroke="currentColor" strokeOpacity="0.65" fill="none">
        <path
          d={`M${CACHE_START_X - 2} 26 L${CACHE_START_X - 2} 102 L${
            CACHE_START_X + 10 * (CACHE_TOKEN_W + CACHE_GAP) - CACHE_GAP + 2
          } 102 L${CACHE_START_X + 10 * (CACHE_TOKEN_W + CACHE_GAP) - CACHE_GAP + 2} 26`}
          strokeDasharray="2 3"
        />
      </g>
      <text
        x={CACHE_START_X + (10 * (CACHE_TOKEN_W + CACHE_GAP)) / 2 - 4}
        y="115"
        textAnchor="middle"
        fontFamily="JetBrains Mono"
        fontSize="7"
        className="fill-primary"
        fillOpacity="0.9"
      >
        SHARED PREFIX · KV
      </text>
    </svg>
  );
}

// ─── Pillar card ───────────────────────────────────────────
type PillarProps = {
  index: number;
  title: string;
  body: string;
  Diagram: ComponentType;
};

function Pillar({ index, title, body, Diagram }: PillarProps) {
  return (
    <div className="relative flex flex-col">
      {/* diagram surface — taller on mobile so 7px labels stay legible */}
      <div className="pillar-card relative overflow-hidden rounded-md aspect-[14/9] sm:aspect-[28/13]">
        <div className="absolute inset-0 p-1.5">
          <Diagram />
        </div>
      </div>

      {/* index + separator row */}
      <div className="mt-4 flex items-baseline gap-3">
        <Mono className="text-primary text-[11px]">0{index}</Mono>
        <span className="h-px flex-1 bg-secondary/15" />
      </div>

      <h3 className="mt-2 text-[17px] font-semibold tracking-tight text-secondary">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-secondary/65 text-pretty">{body}</p>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────
const PILLARS: { title: string; body: string; Diagram: ComponentType }[] = [
  {
    title: "Smart routing",
    Diagram: DiagramRouting,
    body: "Targeting supply with the right shape and free capacity, so short prompts and long-context jobs don't compete for the same GPUs."
  },
  {
    title: "Hardware adaptation",
    Diagram: DiagramHardware,
    body: "Parallelism tuned per request, per chip, per datacenter. GPUs assigned scale with compute profile, holding utilization high across the cluster."
  },
  {
    title: "Inference engine optimization",
    Diagram: DiagramKernels,
    body: "We've optimized kernels other providers run unchanged to pull more throughput from the same silicon."
  },
  {
    title: "Cache layer",
    Diagram: DiagramCache,
    body: "Repeated prompt prefixes and KV state reused across requests, so customers don't pay to recompute the same tokens twice."
  }
];

export function AffordableNotSlow() {
  return (
    <section className="mt-14" aria-label="We're affordable, not slow">
      {/* Section eyebrow */}
      <div className="flex items-center gap-3">
        <Mono className="text-secondary/55 text-[10px]">─── PERFORMANCE</Mono>
      </div>

      {/* Headline + subhead grid */}
      <div className="mt-3 grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8">
        <h2 className="md:col-span-7 font-rubik-mono leading-[0.95] tracking-[-0.035em] text-[clamp(2.4rem,6vw,4.25rem)]">
          <span className="text-secondary">We&apos;re affordable,</span>
          <br />
          <span className="text-primary">not slow.</span>
        </h2>
        <p className="md:col-span-5 md:pt-2 text-[14px] leading-relaxed text-secondary/70 max-w-prose text-pretty">
          <span className="text-black font-medium"> Some of our optimizations have been adopted by frontier labs and are running right now on official endpoints. </span>
          <br />
          <span className="text-primary font-medium">*Not all of our models have these optimizations</span>
        </p>
      </div>

      {/* Pillar grid */}
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Pillar key={p.title} index={i + 1} title={p.title} body={p.body} Diagram={p.Diagram} />
        ))}
      </div>
    </section>
  );
}
