import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TerminalCommandBar } from "./terminal-command-bar";

// ──────────────────────────────────────────────────────────────
// HeroVoltage — drop-in replacement for the homepage hero <section>.
//
// Nothing to install. Uses:
//   • React (already in next)
//   • requestAnimationFrame for the live waveform
//   • Inline SVG for the scope + glow filter
//   • Tailwind v4 utilities + the existing CSS tokens (--primary,
//     --secondary, --background) defined in app/globals.css
//   • font-rubik-mono (Archivo Black) + font-mono (JetBrains Mono),
//     both wired up in app/layout.tsx
// ──────────────────────────────────────────────────────────────

const SAMPLES = 240;
const T_MS = 0;

// Path is deterministic given T_MS, so compute once at module load.
const { tracePath: TRACE_PATH, leadX: LEAD_X, leadY: LEAD_Y } = (() => {
  const pts: string[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const x = (i / (SAMPLES - 1)) * 1200;
    const phase = (i / SAMPLES) * Math.PI * 6 + T_MS / 600;
    const noise =
      Math.sin(phase) * 0.5 +
      Math.sin(phase * 2.7 + 0.4) * 0.25 +
      Math.sin(phase * 5.1 + 1.1) * 0.12;
    const spikeCenter = ((T_MS / 30) % (SAMPLES + 80)) - 40;
    const spike = Math.exp(-Math.pow(i - spikeCenter, 2) / 18) * 1.4;
    const y = 360 + (noise + spike) * 130;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const spikeCenter = ((T_MS / 30) % (SAMPLES + 80)) - 40;
  const idx = Math.max(0, Math.min(SAMPLES - 1, Math.round(spikeCenter)));
  const [px, py] = pts[idx].split(",").map(parseFloat);
  return { tracePath: "M " + pts.join(" L "), leadX: px, leadY: py };
})();

function Oscilloscope() {
  return (
    <svg
      viewBox="0 0 1200 720"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <filter id="hv-glow" x="-5%" y="-50%" width="110%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="hv-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="6%" stopColor="#000" stopOpacity="1" />
          <stop offset="94%" stopColor="#000" stopOpacity="1" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid */}
      <g stroke="rgba(0,32,92,0.08)" strokeWidth="1">
        {Array.from({ length: 13 }).map((_, k) => (
          <line key={`v-${k}`} x1={(k / 12) * 1200} y1="0" x2={(k / 12) * 1200} y2="720" />
        ))}
        {Array.from({ length: 9 }).map((_, k) => (
          <line key={`h-${k}`} x1="0" y1={(k / 8) * 720} x2="1200" y2={(k / 8) * 720} />
        ))}
      </g>
      <line x1="0" y1="360" x2="1200" y2="360" stroke="rgba(0,32,92,0.2)" strokeDasharray="3 4" />

      {/* trace */}
      <path d={TRACE_PATH} fill="none" stroke="#000" strokeWidth="6" opacity="0.1" />
      <path d={TRACE_PATH} fill="none" stroke="url(#hv-fade)" strokeWidth="2" filter="url(#hv-glow)" />

      {/* leading dot */}
      <circle cx={LEAD_X} cy={LEAD_Y} r="9" fill="#000" opacity="0.18" />
      <circle cx={LEAD_X} cy={LEAD_Y} r="4" fill="#000" filter="url(#hv-glow)" />
    </svg>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[9px] uppercase tracking-[0.18em] text-secondary/55">{label}</span>
      <span
        className={`font-rubik-mono text-xl ${accent ? "text-primary" : "text-secondary"}`}
      >
        {value}
      </span>
    </div>
  );
}

export function HeroVoltage({ dashboardUrl }: { dashboardUrl: string }) {
  return (
    <>
      <section className="relative h-[640px] w-full md:h-[720px]">
      {/* top meta */}
      <div className="absolute top-4 left-4 right-4 md:left-14 md:right-14 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-secondary/75">
        <span>Intelligence Grid</span>
        <span className="hidden md:inline">SESSION #03711 · 00:03:21 UTC</span>
      </div>

      {/* oscilloscope screen */}
      <div className="absolute inset-x-4 top-11 bottom-14 md:inset-x-14 overflow-hidden rounded-md border border-secondary/30 bg-background/60">
        <Oscilloscope />

        {/* CRT corner labels */}
        <div className="absolute top-3 left-4 hidden sm:block font-mono text-[11px] tracking-[0.12em] text-secondary">
          INFERENCE LOAD · LOW
        </div>
        <div className="absolute top-3 right-4 inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-primary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
          <span className="sm:hidden">LIVE · 89.5M T/min</span>
          <span className="hidden sm:inline">LIVE · 89.5M TOKENS/MIN</span>
        </div>

        {/* wordmark + CTAs, centered, on top of the trace */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center -translate-y-10">
            <div className="mb-1.5 font-mono text-[12px] tracking-[0.22em] text-secondary/70">
              ─── POWER YOUR AI WORKLOADS ───
            </div>
            <h1 className="font-rubik-mono text-[clamp(3rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.045em]">
              <span className="text-primary">TOKEN</span>
              <span className="text-secondary">GO</span>
            </h1>
            <div className="pointer-events-auto mt-7 flex flex-col gap-3 sm:flex-row sm:gap-5">
              <Button
                asChild
                className="rounded-full bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-[0.04em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.25),0_0_0_4px_rgba(0,0,0,0.08)] hover:bg-black/90 border-black"
              >
                <a href={dashboardUrl}>Get API key →</a>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="rounded-full border-secondary/30 bg-background/85 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.04em] text-secondary backdrop-blur-sm"
              >
                <Link href="/docs/getting-started/quickstart">Quickstart demo</Link>
              </Button>
            </div>
          </div>
          <p className="mt-4 px-4 text-center font-mono text-[11px] tracking-[0.08em] sm:text-[14px] sm:tracking-[0.12em] md:text-[18px] md:tracking-[0.14em] text-black uppercase">
            One API key, migrate in seconds, lowest prices anywhere
          </p>
        </div>

        {/* Terminal preview, sitting just above the bottom CRT labels */}
        <div
          className="pointer-events-auto absolute inset-x-4 bottom-10"
          role="region"
          aria-label="Terminal command preview"
        >
          <TerminalCommandBar />
        </div>
      </div>

      {/* bottom stats gutter */}
      <div className="absolute bottom-2 left-4 right-4 md:left-14 md:right-14 hidden items-center justify-between pt-[3px] font-mono text-secondary md:flex">
        <Stat label="SAVINGS" value="18.6%" accent />
        <Stat label="LATENCY" value="69ms" />
        <Stat label="MODELS ONLINE" value="20+" />
        <Stat label="UPTIME" value="99.99%" />
      </div>
      </section>
    </>
  );
}
