import { CHAMBERS } from "@/lib/case-data";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/60 pt-5">
      <h3 className="label-micro mb-2 text-signal">{title}</h3>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function CaseBriefBody() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          THE HUMAN PROTOCOL — COGNITIVE FORENSICS
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Category", "Web / Forensics / Logic"],
            ["Difficulty", "HARD"],
            ["Solve time", "45–120 min"],
            ["Chambers", "6 sequential"],
          ].map(([k, v]) => (
            <div key={k} className="glass-raised rounded-md p-3">
              <dt className="label-micro">{k}</dt>
              <dd className="mt-1 text-xs font-semibold text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Section title="Scenario">
        You have been given access to Case 07, a sealed forensic archive containing a sequence of apparently
        conflicting records. Somewhere inside the archive is a coherent chain of evidence — but only if you
        distinguish reliable signals from deliberate decoys. Your task is to reconstruct that chain across six
        evidence chambers and produce the final proof.
      </Section>

      <Section title="Objective">
        Investigate six deterministic evidence chambers and reconstruct the only coherent chain. The final submission
        is a synthesized proof, not a simple hidden string.
      </Section>

      <Section title="Chambers">
        <ol className="grid gap-2 sm:grid-cols-2">
          {CHAMBERS.map((c) => (
            <li key={c.id} className="hairline rounded-md px-3 py-2">
              <span className="font-mono text-[0.65rem] tracking-[0.2em] text-signal">{c.code}</span>
              <span className="ml-2 text-xs font-semibold text-foreground">{c.name}</span>
              <span className="mt-1 block text-[0.7rem]">{c.discipline}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Rules">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Self-contained fictional challenge. Do not attack external systems.</li>
          <li>No destructive activity and no brute force.</li>
          <li>
            Normal analysis tools, browser devtools, note-taking and reasoning aids are allowed unless otherwise
            stated.
          </li>
          <li>Deliberate decoys exist — cross-reference before you commit.</li>
          <li>Progression is sequential: later chambers reuse earlier verified conclusions.</li>
          <li>Automated extraction alone is insufficient; sustained human interpretation is the intended path.</li>
        </ul>
      </Section>

      <Section title="Flag policy">
        A single fixed flag is held server-side and revealed only after the complete final proof is validated by the
        backend. It appears nowhere in the client, the assets or any API response before that.
      </Section>

      <Section title="How to play">
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Inspect every evidence item in the chamber — including the standards and notes.</li>
          <li>Keep your own notes; conclusions are reused downstream.</li>
          <li>Submit each chamber answer in the analyst panel to unlock the next chamber.</li>
          <li>Assemble the six verified conclusions into the final proof.</li>
          <li>Reset clears your progress without changing the case data.</li>
        </ol>
      </Section>
    </div>
  );
}