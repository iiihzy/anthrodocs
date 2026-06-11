import { Sparkles } from "lucide-react";
import { getAppUrl } from "@/lib/app-url";

export function AnnouncementBanner() {
  const signInUrl = getAppUrl("/sign-in");
  return (
    <div className="w-full bg-black text-white">
      <div className="font-mono mx-auto flex w-[min(1200px,94vw)] items-center justify-center gap-2 px-3 py-1.5 text-[11px] tracking-[0.06em] sm:text-xs">
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-primary" aria-hidden />
        <span className="text-white/80">
          <span className="font-semibold text-white">NEW</span>
          <span className="mx-2 text-white/40">·</span>
          GLM 5.1 just onboarded — $0.88/M in · $3/M out, FP16, cheapest endpoint online.
        </span>
        <a
          href={signInUrl}
          className="ml-2 inline-flex items-center gap-1 font-semibold text-primary no-underline hover:underline"
        >
          Try it →
        </a>
      </div>
    </div>
  );
}
