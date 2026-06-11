"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

const LOG_LINES = [
  "[INFO] Routing request to: GLM 5.1 - DC 1",
  "[STATS] Input: 1,500 tokens | Output: 3,500 tokens",
  "[BILLING] Savings vs. Market avg: 16%",
  "[WARN] Latency spike (999ms)",
  "[ACTION] Re-routing...",
  "[SUCCESS] Route optimized to GLM 5.1 - DC 7"
] as const;
const IDLE_HINT = "Powering your workloads with TokenGO...";
const TYPE_DURATION_MS = 1400;
const HOLD_DURATION_MS = 2600;
const LINE_DURATION_MS = TYPE_DURATION_MS + HOLD_DURATION_MS;

export function TerminalCommandBar() {
  const [lineIndex, setLineIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const activeLine = LOG_LINES[lineIndex];
  const typingStyle = useMemo(
    () =>
      ({
        "--tb-char-count": activeLine.length,
        width: "0ch",
        animation: `tb-type ${TYPE_DURATION_MS}ms steps(var(--tb-char-count)) forwards`
      }) as CSSProperties,
    [activeLine]
  );

  const startTyping = useCallback(() => {
    setIsStreaming(true);
  }, []);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = window.setInterval(() => {
      setLineIndex((prev) => (prev + 1) % LOG_LINES.length);
    }, LINE_DURATION_MS);
    return () => window.clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    if (isStreaming) return;
    const onScroll = () => startTyping();
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isStreaming, startTyping]);

  return (
    <div
      className="overflow-x-hidden mx-auto w-full max-w-[960px] cursor-text rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100"
      onMouseEnter={startTyping}
      onFocus={startTyping}
      role="button"
      tabIndex={0}
      aria-label="Terminal preview"
    >
      <div className="flex items-start gap-2">
        <span className="select-none text-emerald-400">{">"}</span>
        <span className="min-h-[1.5rem] min-w-0 text-left">
          <span className="inline-flex max-w-full items-end">
            {isStreaming ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={lineIndex}
                  className="inline-block max-w-[calc(100%-0.75rem)]"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <span
                    className="inline-block max-w-full overflow-hidden whitespace-nowrap align-bottom"
                    style={typingStyle}
                  >
                    {activeLine}
                  </span>
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="max-w-[calc(100%-0.75rem)] overflow-hidden text-ellipsis whitespace-nowrap text-zinc-500">
                {IDLE_HINT}
              </span>
            )}
            <motion.span
              className="ml-0.5 inline-block h-[1.1rem] w-[0.56rem] shrink-0 self-baseline bg-zinc-400/85"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
              aria-hidden
            />
          </span>
        </span>
      </div>
      <style jsx>{`
        @keyframes tb-type {
          from {
            width: 0ch;
          }
          to {
            width: calc(var(--tb-char-count) * 1ch);
          }
        }
      `}</style>
    </div>
  );
}
