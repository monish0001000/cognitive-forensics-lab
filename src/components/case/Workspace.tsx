import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CHAMBERS, PROOF_EXAMPLE, PROOF_TEMPLATE, type ChamberId } from "@/lib/case-data";
import { verifyChamber, verifyProof } from "@/lib/case.functions";
import { EvidenceCanvas } from "./EvidenceViews";
import { CaseBriefBody } from "./CaseBrief";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STORAGE_KEY = "human-protocol-case07-progress";

type Progress = { solved: number[]; answers: Record<string, string>; done: boolean };

const EMPTY: Progress = { solved: [], answers: {}, done: false };

type Feedback = { tone: "ok" | "bad" | "warn"; text: string } | null;

export function Workspace({ onExit }: { onExit: () => void }) {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState<ChamberId>(1);
  const [navOpen, setNavOpen] = useState(false);
  const [brief, setBrief] = useState(false);
  const [answer, setAnswer] = useState("");
  const [proof, setProof] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [flag, setFlag] = useState<string | null>(null);
  const shakeRef = useRef(0);

  const submitChamber = useServerFn(verifyChamber);
  const submitProof = useServerFn(verifyProof);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Progress;
        if (Array.isArray(parsed.solved)) {
          setProgress({ solved: parsed.solved, answers: parsed.answers ?? {}, done: !!parsed.done });
          const next = [1, 2, 3, 4, 5, 6].find((n) => !parsed.solved.includes(n)) ?? 6;
          setActive(next as ChamberId);
        }
      }
    } catch {
      /* ignore corrupt local state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable */
    }
  }, [progress, hydrated]);

  const answersRef = useRef<Record<string, string>>({});
  answersRef.current = progress.answers;
  useEffect(() => {
    setAnswer(answersRef.current[`c${active}`] ?? "");
    setFeedback(null);
  }, [active]);

  const solvedCount = progress.solved.length;
  const allSolved = solvedCount === 6;
  const chamber = CHAMBERS[active - 1]!;
  const unlocked = useMemo(
    () => (id: number) => id === 1 || progress.solved.includes(id - 1),
    [progress.solved],
  );
  const isSolved = progress.solved.includes(active);

  async function handleChamberSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !answer.trim()) return;
    setBusy(true);
    setFeedback(null);
    try {
      const res = await submitChamber({ data: { chamber: active, answer: answer.trim() } });
      if (res.status === "correct") {
        setProgress((p) => ({
          ...p,
          solved: p.solved.includes(active) ? p.solved : [...p.solved, active].sort(),
          answers: { ...p.answers, [`c${active}`]: answer.trim().toUpperCase() },
        }));
        setFeedback({ tone: "ok", text: res.message });
      } else {
        shakeRef.current += 1;
        setFeedback({ tone: res.status === "throttled" ? "warn" : "bad", text: res.message });
      }
    } catch {
      setFeedback({ tone: "warn", text: "Archive link interrupted. Try the submission again." });
    } finally {
      setBusy(false);
    }
  }

  async function handleProofSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !proof.trim()) return;
    setBusy(true);
    setFeedback(null);
    try {
      const res = await submitProof({ data: { proof: proof.trim() } });
      if (res.status === "correct" && "flag" in res) {
        setFlag(res.flag);
        setProgress((p) => ({ ...p, done: true }));
        setFeedback({ tone: "ok", text: res.message });
      } else {
        shakeRef.current += 1;
        setFeedback({ tone: res.status === "throttled" ? "warn" : "bad", text: res.message });
      }
    } catch {
      setFeedback({ tone: "warn", text: "Archive link interrupted. Try the submission again." });
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setProgress(EMPTY);
    setFlag(null);
    setProof("");
    setAnswer("");
    setFeedback(null);
    setActive(1);
  }

  const navigator = (
    <nav className="space-y-2" aria-label="Evidence chambers">
      {CHAMBERS.map((c) => {
        const open = unlocked(c.id);
        const done = progress.solved.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            disabled={!open}
            onClick={() => {
              setActive(c.id);
              setNavOpen(false);
            }}
            className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-3 text-left transition-all duration-200 ${
              active === c.id
                ? "glass-raised signal-glow"
                : open
                  ? "hover:bg-accent/30"
                  : "cursor-not-allowed opacity-40"
            }`}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded font-mono text-[0.62rem] ${
                done ? "bg-signal/15 text-signal" : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {done ? "✓" : c.id}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-foreground">{c.name}</span>
              <span className="block truncate font-mono text-[0.58rem] tracking-[0.16em] text-muted-foreground uppercase">
                {c.code} · {c.discipline}
              </span>
            </span>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                done ? "bg-signal" : open ? "bg-warn/70" : "bg-muted-foreground/40"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );

  const submissionPanel = (
    <div className="space-y-4">
      <div className="glass-panel rounded-lg p-4 sm:p-5">
        <p className="label-micro mb-2 text-signal">Analyst directive · {chamber.code}</p>
        <p className="text-sm leading-relaxed text-foreground/85">{chamber.prompt}</p>
        <details className="group mt-4">
          <summary className="label-micro cursor-pointer list-none text-warn hover:text-warn/80">
            ▸ Methodology note
          </summary>
          <p className="mt-2 text-[0.78rem] leading-relaxed text-muted-foreground">{chamber.hint}</p>
        </details>
      </div>

      <form onSubmit={handleChamberSubmit} className="glass-panel space-y-3 rounded-lg p-4 sm:p-5">
        <span className="label-micro block">Conclusion · chamber {active}</span>
        <input
          aria-label={`Conclusion for chamber ${active}`}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={chamber.placeholder}
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          className="h-12 w-full rounded-md border border-input bg-background/60 px-3 font-mono text-sm tracking-[0.12em] text-foreground uppercase placeholder:text-muted-foreground/50 focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="min-h-12 w-full rounded-md bg-signal text-sm font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-transform duration-150 hover:scale-[1.01] disabled:opacity-50 active:scale-[0.99]"
        >
          {busy ? "Validating…" : isSolved ? "Re-validate" : "Seal conclusion"}
        </button>
        {feedback ? (
          <p
            key={shakeRef.current}
            className={`rounded-md px-3 py-2 text-xs leading-relaxed ${
              feedback.tone === "ok"
                ? "bg-signal/10 text-signal"
                : feedback.tone === "warn"
                  ? "bg-warn/10 text-warn"
                  : "hp-shake bg-destructive/12 text-destructive"
            }`}
            role="status"
          >
            {feedback.text}
          </p>
        ) : null}
      </form>

      <div className="glass-panel rounded-lg p-4 sm:p-5">
        <p className="label-micro mb-3">Sealed conclusions</p>
        <ul className="space-y-1.5">
          {CHAMBERS.map((c) => (
            <li key={c.id} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
              <span className="font-mono text-[0.6rem] tracking-[0.16em] text-muted-foreground">{c.code}</span>
              <span className="truncate font-mono text-xs text-foreground">
                {progress.answers[`c${c.id}`] ?? "— pending —"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleProofSubmit}
        className={`glass-panel space-y-3 rounded-lg p-4 sm:p-5 ${allSolved ? "warn-glow" : "opacity-60"}`}
      >
        <p className="label-micro text-warn">Final proof · synthesis</p>
        <p className="font-mono text-[0.68rem] break-all text-muted-foreground">
          {PROOF_TEMPLATE}
          <span className="mt-1 block text-muted-foreground/60">e.g. {PROOF_EXAMPLE}</span>
        </p>
        <input
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          disabled={!allSolved}
          placeholder={allSolved ? PROOF_EXAMPLE : "Locked until six chambers are sealed"}
          aria-label="Final proof"
          autoComplete="off"
          spellCheck={false}
          maxLength={128}
          className="h-12 w-full rounded-md border border-input bg-background/60 px-3 font-mono text-sm tracking-[0.1em] text-foreground uppercase placeholder:text-muted-foreground/50 focus-visible:border-warn/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!allSolved || busy}
          className="min-h-12 w-full rounded-md border border-warn/50 bg-warn/12 text-sm font-semibold tracking-[0.14em] text-warn uppercase transition-transform duration-150 hover:scale-[1.01] disabled:opacity-50 active:scale-[0.99]"
        >
          Submit final proof
        </button>
        {flag ? (
          <div className="hp-rise rounded-md border border-signal/40 bg-signal/10 p-4 text-center">
            <p className="label-micro text-signal">Case 07 unsealed</p>
            <p className="mt-2 font-mono text-sm break-all text-foreground select-all">{flag}</p>
          </div>
        ) : null}
      </form>
    </div>
  );

  return (
    <div className="scanlines relative min-h-[100dvh] w-full overflow-x-hidden bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[45%] overflow-hidden opacity-40">
          <div className="perspective-grid h-full w-full" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,oklch(0.82_0.13_197/8%),transparent_60%)]" />
      </div>

      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[110rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onExit}
              aria-label="Back to title"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border/70 text-signal transition-colors hover:bg-accent/40"
            >
              ◄
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-[0.06em] text-foreground">
                CASE 07 · HUMAN PROTOCOL
              </p>
              <p className="label-micro truncate">Cognitive Forensics · Sealed Archive</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground sm:inline">
              {solvedCount}/6
            </span>
            <button
              onClick={() => setBrief(true)}
              className="min-h-9 rounded-md border border-border/70 px-3 text-[0.65rem] font-semibold tracking-[0.14em] text-foreground/85 uppercase transition-colors hover:bg-accent/40"
            >
              Info
            </button>
            <button
              onClick={reset}
              className="min-h-9 rounded-md border border-warn/40 px-3 text-[0.65rem] font-semibold tracking-[0.14em] text-warn uppercase transition-colors hover:bg-warn/10"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="h-[3px] w-full bg-muted/40">
          <div
            className="h-full bg-gradient-to-r from-signal to-warn transition-[width] duration-700"
            style={{ width: `${(solvedCount / 6) * 100}%` }}
          />
        </div>
      </header>

      {/* mobile chamber navigator */}
      <div className="relative z-20 border-b border-border/60 bg-background/70 px-4 py-2 lg:hidden">
        <button
          onClick={() => setNavOpen((v) => !v)}
          aria-expanded={navOpen}
          className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-2 text-left"
        >
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-foreground">
              {chamber.code} · {chamber.name}
            </span>
            <span className="label-micro truncate">{chamber.discipline}</span>
          </span>
          <span className="label-micro shrink-0 text-signal">{navOpen ? "Close" : "Chambers"}</span>
        </button>
        {navOpen ? <div className="hp-rise mt-2">{navigator}</div> : null}
      </div>

      <main className="relative z-10 mx-auto grid max-w-[110rem] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_23rem]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <p className="label-micro">Evidence chambers</p>
            {navigator}
            <div className="glass-panel rounded-lg p-4">
              <p className="label-micro mb-2">Case integrity</p>
              <p className="font-mono text-[0.68rem] leading-relaxed text-muted-foreground">
                DETERMINISTIC DATASET
                <br />
                NO RANDOMISATION
                <br />
                SERVER-SIDE VALIDATION
              </p>
            </div>
          </div>
        </aside>

        <section aria-label="Evidence canvas" className="min-w-0">
          <div className="glass-panel mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {chamber.name}
              </h2>
              <p className="label-micro truncate">
                {chamber.code} · {chamber.discipline}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 font-mono text-[0.58rem] tracking-[0.16em] ${
                isSolved ? "bg-signal/12 text-signal" : "bg-warn/12 text-warn"
              }`}
            >
              {isSolved ? "SEALED" : "OPEN"}
            </span>
          </div>
          <div key={active} className="hp-rise">
            <EvidenceCanvas chamber={active} />
          </div>
          <div className="mt-6 xl:hidden">{submissionPanel}</div>
        </section>

        <aside className="hidden min-w-0 xl:block">
          <div className="sticky top-28">{submissionPanel}</div>
        </aside>
      </main>

      <Dialog open={brief} onOpenChange={setBrief}>
        <DialogContent className="max-h-[85dvh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="label-micro text-signal">Case brief · participant copy</DialogTitle>
          </DialogHeader>
          <CaseBriefBody />
        </DialogContent>
      </Dialog>
    </div>
  );
}