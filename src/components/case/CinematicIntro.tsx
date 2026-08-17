import { useEffect, useState } from "react";

const DUST = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  delay: `${(i % 9) * 1.4}s`,
  duration: `${11 + (i % 5) * 3}s`,
  size: i % 3 === 0 ? 3 : 2,
}));

export function CinematicIntro({
  onEnter,
  onBrief,
  onHowToPlay,
}: {
  onEnter: () => void;
  onBrief: () => void;
  onHowToPlay: () => void;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="scanlines relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background">
      {/* environment */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[62%] opacity-70">
          <div className="perspective-grid h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_0%,var(--background)_78%)]" />
        {DUST.map((d, i) => (
          <span
            key={i}
            className="absolute bottom-[12%] rounded-full bg-signal/50"
            style={{
              left: d.left,
              width: d.size,
              height: d.size,
              animation: `hp-drift ${d.duration} linear ${d.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* top bar */}
      <header className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-signal shadow-[0_0_12px_var(--signal)]" />
          <span className="label-micro truncate">Case 07 · Sealed Archive</span>
        </div>
        <span className="label-micro shrink-0 text-warn/80">Classified</span>
      </header>

      {/* core */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center sm:px-8">
        <div
          className={`relative mb-10 h-40 w-40 sm:h-52 sm:w-52 ${ready ? "hp-rise" : "opacity-0"}`}
          aria-hidden
        >
          <div className="hp-core absolute inset-0 rounded-full" style={{ background: "var(--gradient-core)" }} />
          <div className="hp-spin-slow absolute inset-3 rounded-full border border-signal/30" />
          <div className="hp-spin-rev absolute inset-8 rounded-full border border-dashed border-warn/25" />
          <div className="hp-spin-slow absolute inset-[38%] rotate-45 border border-signal/60" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-3 w-3 rounded-full bg-signal shadow-[0_0_28px_6px_var(--signal)]" />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="hp-sweep h-6 w-full bg-gradient-to-b from-transparent via-signal/25 to-transparent" />
          </div>
        </div>

        <p
          className="label-micro mb-5"
          style={{ animation: ready ? "hp-rise 0.7s 0.1s both" : undefined, opacity: ready ? undefined : 0 }}
        >
          Deterministic · Self-contained · No external systems
        </p>

        <h1
          className="max-w-5xl text-[clamp(2.1rem,9vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-foreground"
          style={{ animation: ready ? "hp-rise 0.8s 0.15s both" : undefined, opacity: ready ? undefined : 0 }}
        >
          THE HUMAN
          <span className="block bg-gradient-to-r from-signal via-foreground to-warn bg-clip-text text-transparent">
            PROTOCOL
          </span>
        </h1>

        <p
          className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          style={{ animation: ready ? "hp-rise 0.8s 0.3s both" : undefined, opacity: ready ? undefined : 0 }}
        >
          <span className="font-mono text-xs tracking-[0.35em] text-signal uppercase">Cognitive Forensics</span>
          <span className="mt-4 block">
            Six evidence chambers. Conflicting records, deliberate decoys, one coherent chain. Reconstruct it and
            produce the final proof.
          </span>
        </p>

        <div
          className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          style={{ animation: ready ? "hp-rise 0.8s 0.45s both" : undefined, opacity: ready ? undefined : 0 }}
        >
          <button
            onClick={onEnter}
            className="group relative min-h-12 overflow-hidden rounded-md bg-signal px-8 text-sm font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.99]"
          >
            <span className="relative z-10">Enter Case File</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
          <button
            onClick={onBrief}
            className="hairline min-h-12 rounded-md px-6 text-sm font-medium tracking-[0.12em] text-foreground/85 uppercase transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            View Case Brief
          </button>
          <button
            onClick={onHowToPlay}
            className="min-h-12 rounded-md px-4 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            How to Play
          </button>
        </div>
      </main>

      <footer className="relative z-10 grid grid-cols-2 gap-3 px-5 pb-7 sm:flex sm:items-center sm:justify-between sm:px-10">
        <span className="label-micro">Web · Forensics · Logic</span>
        <span className="label-micro text-right sm:text-left">Difficulty: Hard</span>
        <span className="label-micro col-span-2 text-center sm:text-right">Expected solve · 45–120 min</span>
      </footer>
    </div>
  );
}