import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CinematicIntro } from "@/components/case/CinematicIntro";
import { Workspace } from "@/components/case/Workspace";
import { CaseBriefBody } from "@/components/case/CaseBrief";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Human Protocol — Cognitive Forensics | CTF Case 07" },
      {
        name: "description",
        content:
          "A hard, deterministic Web/Forensics/Logic CTF. Reconstruct the coherent evidence chain across six forensic chambers and produce the final proof.",
      },
      { property: "og:title", content: "The Human Protocol — Cognitive Forensics" },
      {
        property: "og:description",
        content:
          "Six evidence chambers. Conflicting records, deliberate decoys, one coherent chain. Difficulty: HARD, 45–120 minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaseSeven,
});

function CaseSeven() {
  const [entered, setEntered] = useState(false);
  const [brief, setBrief] = useState(false);
  const [howTo, setHowTo] = useState(false);

  return (
    <>
      {entered ? (
        <div className="hp-rise">
          <Workspace onExit={() => setEntered(false)} />
        </div>
      ) : (
        <CinematicIntro
          onEnter={() => setEntered(true)}
          onBrief={() => setBrief(true)}
          onHowToPlay={() => setHowTo(true)}
        />
      )}

      <Dialog open={brief} onOpenChange={setBrief}>
        <DialogContent className="max-h-[85dvh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="label-micro text-signal">Case brief · participant copy</DialogTitle>
          </DialogHeader>
          <CaseBriefBody />
        </DialogContent>
      </Dialog>

      <Dialog open={howTo} onOpenChange={setHowTo}>
        <DialogContent className="max-h-[85dvh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-tight">How to play</DialogTitle>
          </DialogHeader>
          <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Enter the case file and open Chamber 1. Read the standards note before the evidence.</li>
            <li>Work each chamber by hand — checksums, offsets, claims, sectors, sheets, custody rows.</li>
            <li>Seal a conclusion to unlock the next chamber. Wrong answers give no component-level feedback.</li>
            <li>Keep notes: chambers 2–6 depend on conclusions verified earlier.</li>
            <li>Synthesize the six conclusions into the final proof; the backend validates it and reveals the flag.</li>
            <li>Reset clears your progress only — the case data never changes.</li>
          </ol>
          <p className="mt-4 rounded-md bg-warn/10 px-3 py-2 text-xs text-warn">
            Submissions are rate limited. Brute force is out of scope and will simply slow you down.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
