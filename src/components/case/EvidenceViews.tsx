import {
  CUSTODY,
  CUSTODY_NOTE,
  FRAMES,
  GRID_NOTE,
  IMAGING_STANDARD,
  LEDGER,
  LEDGER_NOTE,
  MOUNTS,
  MOVEMENT_LOG,
  SHEETS,
  SHEET_NOTE,
  STATEMENTS,
  type ChamberId,
} from "@/lib/case-data";

function Stagger({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div style={{ animation: `hp-rise 0.5s ${Math.min(index, 12) * 0.045}s both` }}>{children}</div>
  );
}

function ArtifactNote({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="glass-raised paper-grain relative overflow-hidden rounded-lg p-4 sm:p-5">
      <span className="absolute top-0 left-0 h-full w-[3px] bg-warn/70" aria-hidden />
      <p className="label-micro mb-2 text-warn">{id}</p>
      <p className="text-sm leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}

function SectionTitle({ children, count }: { children: React.ReactNode; count?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-b border-border/60 pb-2">
      <h3 className="truncate text-sm font-bold tracking-[0.08em] text-foreground uppercase">{children}</h3>
      {count ? <span className="label-micro shrink-0">{count}</span> : null}
    </div>
  );
}

/* ── CH-01 ─────────────────────────────────────────────────────────── */

function VisualAnomaly() {
  return (
    <div className="space-y-6">
      <ArtifactNote id="Standard · STD-IMG-4.2">{IMAGING_STANDARD}</ArtifactNote>
      <SectionTitle count={`${FRAMES.length} frames`}>Reel R-07 · inspection frames</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {FRAMES.map((f, i) => (
          <Stagger key={f.id} index={i}>
            <figure className="glass-panel group relative overflow-hidden rounded-lg transition-transform duration-200 hover:-translate-y-0.5">
              <div
                className="relative h-24 w-full"
                style={{
                  background: `linear-gradient(135deg, rgb(${f.r} ${f.g} ${f.b} / 0.55), oklch(0.18 0.01 240))`,
                }}
              >
                <div className="scanlines absolute inset-0" />
                <div className="absolute inset-2 border border-signal/25" />
                <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-signal/70" />
                <span className="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-signal/70" />
                <span className="absolute right-2 bottom-2 translate-y-[-140%] font-mono text-[0.6rem] tracking-[0.18em] text-foreground/70">
                  {f.id}
                </span>
              </div>
              <figcaption className="space-y-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <span className="truncate font-mono text-xs tracking-[0.18em] text-signal">{f.id}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.16em] uppercase ${
                      f.flag === "clean"
                        ? "bg-signal/12 text-signal"
                        : f.flag === "noise"
                          ? "bg-warn/12 text-warn"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {f.flag}
                  </span>
                </div>
                <dl className="grid grid-cols-4 gap-1 font-mono text-[0.68rem]">
                  {[
                    ["R", f.r],
                    ["G", f.g],
                    ["B", f.b],
                    ["CHK", f.chk],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="rounded bg-muted/50 px-1.5 py-1 text-center">
                      <dt className="text-[0.55rem] tracking-[0.16em] text-muted-foreground">{k}</dt>
                      <dd className="text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-[0.72rem] leading-relaxed text-muted-foreground">{f.note}</p>
              </figcaption>
            </figure>
          </Stagger>
        ))}
      </div>
    </div>
  );
}

/* ── CH-02 ─────────────────────────────────────────────────────────── */

function Timeline() {
  return (
    <div className="space-y-6">
      <ArtifactNote id="Ingest ledger · note">{LEDGER_NOTE}</ArtifactNote>
      <SectionTitle count={`${LEDGER.length} rows`}>Ingest ledger · station local</SectionTitle>
      <div className="space-y-2">
        {LEDGER.map((row, i) => (
          <Stagger key={row.frame} index={i}>
            <div className="glass-panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg p-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:p-4">
              <span className="shrink-0 font-mono text-xs tracking-[0.16em] text-signal">{row.frame}</span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{row.station}</p>
                <p className="truncate text-[0.72rem] text-muted-foreground">{row.note}</p>
              </div>
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:justify-end">
                <span className="rounded bg-muted/60 px-2 py-1 font-mono text-xs text-foreground">
                  {row.localTime}
                </span>
                <span className="rounded bg-warn/10 px-2 py-1 font-mono text-xs text-warn">UTC{row.offset}</span>
              </div>
            </div>
          </Stagger>
        ))}
      </div>
      <div className="hairline relative overflow-hidden rounded-lg p-4">
        <p className="label-micro mb-3">Ingest density strip · 24h</p>
        <div className="relative h-10 rounded bg-muted/40">
          {LEDGER.map((r) => {
            const [h, m] = r.localTime.split(":").map(Number);
            const pct = (((h ?? 0) * 60 + (m ?? 0)) / 1440) * 100;
            return (
              <span
                key={r.frame}
                title={r.frame}
                className="absolute top-1 bottom-1 w-[2px] bg-signal/70"
                style={{ left: `${pct}%` }}
              />
            );
          })}
        </div>
        <p className="mt-2 font-mono text-[0.6rem] tracking-[0.16em] text-muted-foreground">
          MARKS PLOTTED IN LOCAL TIME — NOT NORMALISED
        </p>
      </div>
    </div>
  );
}

/* ── CH-03 ─────────────────────────────────────────────────────────── */

function Semantic() {
  return (
    <div className="space-y-6">
      <ArtifactNote id="Analyst note · interview set">
        A statement is consistent only when every claim inside it survives the facts already sealed in CH-01 and
        CH-02. Stated confidence has no evidentiary weight.
      </ArtifactNote>
      <SectionTitle count={`${STATEMENTS.length} statements`}>Interview transcripts</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        {STATEMENTS.map((s, i) => (
          <Stagger key={s.codeword} index={i}>
            <article className="glass-panel paper-grain relative h-full overflow-hidden rounded-lg p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs tracking-[0.24em] text-signal">{s.codeword}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-foreground">{s.witness}</p>
                  <p className="truncate text-[0.72rem] text-muted-foreground">{s.role}</p>
                </div>
                <span className="shrink-0 rounded-full bg-warn/10 px-2 py-1 font-mono text-[0.58rem] tracking-[0.16em] text-warn">
                  CONF {s.confidence}
                </span>
              </div>
              <ol className="mt-4 space-y-2">
                {s.claims.map((c, ci) => (
                  <li key={ci} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <span className="mt-1 font-mono text-[0.6rem] text-muted-foreground">
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">{c}</span>
                  </li>
                ))}
              </ol>
            </article>
          </Stagger>
        ))}
      </div>
    </div>
  );
}

/* ── CH-04 ─────────────────────────────────────────────────────────── */

const COLS = ["A", "B", "C", "D", "E", "F"];

function Spatial() {
  return (
    <div className="space-y-6">
      <ArtifactNote id="Scene note · sector grid">{GRID_NOTE}</ArtifactNote>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="glass-panel rounded-lg p-4 sm:p-6">
          <SectionTitle>Floor plan · level 2</SectionTitle>
          <div className="mt-4 grid grid-cols-6 gap-1.5">
            {Array.from({ length: 36 }, (_, i) => {
              const col = COLS[i % 6];
              const row = Math.floor(i / 6) + 1;
              const sector = `${col}${row}`;
              const mount = MOUNTS.find((m) => m.sector === sector);
              return (
                <div
                  key={sector}
                  className={`relative grid aspect-square place-items-center rounded font-mono text-[0.55rem] tracking-[0.1em] transition-colors sm:text-[0.68rem] ${
                    mount
                      ? "bg-signal/10 text-signal ring-1 ring-signal/30"
                      : "bg-muted/30 text-muted-foreground/60"
                  }`}
                >
                  {sector}
                  {mount ? (
                    <span className="absolute right-1 bottom-1 h-1.5 w-1.5 rounded-full bg-signal" />
                  ) : null}
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[0.6rem] tracking-[0.16em] text-muted-foreground">
            HIGHLIGHTED SECTORS CARRY CAMERA MOUNTS
          </p>
        </div>

        <div className="space-y-4">
          <div className="glass-panel rounded-lg p-4">
            <p className="label-micro mb-3">Mount register</p>
            <ul className="space-y-1.5">
              {MOUNTS.map((m) => (
                <li key={m.frame} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                  <span className="font-mono text-[0.68rem] text-signal">{m.frame}</span>
                  <span className="truncate text-[0.68rem] text-muted-foreground">{m.fixture}</span>
                  <span className="font-mono text-[0.68rem] text-foreground">{m.sector}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel rounded-lg p-4">
            <p className="label-micro mb-3">Movement log</p>
            <ul className="space-y-2">
              {MOVEMENT_LOG.map((m, i) => (
                <Stagger key={m.seq} index={i}>
                  <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                    <span className="font-mono text-[0.62rem] text-muted-foreground">{m.seq}</span>
                    <span
                      className={`truncate font-mono text-xs ${
                        m.status === "void" ? "text-muted-foreground/60 line-through" : "text-foreground"
                      }`}
                    >
                      {m.instruction}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.14em] ${
                        m.status === "void" ? "bg-warn/10 text-warn" : "bg-signal/12 text-signal"
                      }`}
                    >
                      {m.status === "void" ? "VOID" : "WALK"}
                    </span>
                  </li>
                </Stagger>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CH-05 ─────────────────────────────────────────────────────────── */

function Metadata() {
  return (
    <div className="space-y-6">
      <ArtifactNote id="Provenance standard · STD-MET-2.1">{SHEET_NOTE}</ArtifactNote>
      <SectionTitle count={`${SHEETS.length} sheets`}>Acquisition sheets</SectionTitle>
      <div className="grid gap-4 xl:grid-cols-2">
        {SHEETS.map((s, i) => (
          <Stagger key={s.serial} index={i}>
            <article className="glass-panel paper-grain relative overflow-hidden rounded-lg">
              <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 p-4">
                <div className="min-w-0">
                  <p className="font-mono text-sm tracking-[0.16em] text-signal">{s.serial}</p>
                  <p className="truncate text-[0.72rem] text-muted-foreground">{s.model}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.16em] ${
                    s.signatureState === "verified" ? "bg-signal/12 text-signal" : "bg-warn/12 text-warn"
                  }`}
                >
                  SIG {s.signatureState.toUpperCase()}
                </span>
              </header>
              <dl className="grid grid-cols-2 gap-px bg-border/40">
                {[
                  ["capture_utc", s.captureUtc],
                  ["sector", s.sector],
                  ["write_protect", s.writeProtect ? "ENGAGED" : "DISENGAGED"],
                  ["signature", s.signature],
                  ["custody_seal", s.custodySeal],
                  ["schema", "AXIOM/METADATA v3"],
                ].map(([k, v]) => (
                  <div key={String(k)} className="bg-card/70 p-3">
                    <dt className="label-micro">{k}</dt>
                    <dd
                      className={`mt-1 font-mono text-xs break-all ${
                        v === "DISENGAGED" ? "text-warn" : "text-foreground"
                      }`}
                    >
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </Stagger>
        ))}
      </div>
    </div>
  );
}

/* ── CH-06 ─────────────────────────────────────────────────────────── */

function Custody() {
  return (
    <div className="space-y-6">
      <ArtifactNote id="Custodial standard · STD-COC-1.0">{CUSTODY_NOTE}</ArtifactNote>
      <SectionTitle count={`${CUSTODY.length} steps`}>Custody transfer log</SectionTitle>
      <div className="space-y-3">
        {CUSTODY.map((c, i) => (
          <Stagger key={c.step} index={i}>
            <div className="glass-panel relative rounded-lg p-4">
              <span className="absolute top-4 bottom-4 left-0 w-[2px] bg-signal/40" aria-hidden />
              <div className="grid gap-3 pl-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="font-mono text-xs tracking-[0.18em] text-signal">BADGE {c.badge}</p>
                  <p className="truncate text-sm font-semibold text-foreground">{c.custodian}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ["device", c.device],
                    ["received", c.received],
                    ["released", c.released],
                    ["seal in → out", `${c.sealIn.replace("SEAL-", "")}→${c.sealOut.replace("SEAL-", "")}`],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="rounded bg-muted/40 px-2 py-1.5">
                      <p className="label-micro text-[0.52rem]">{k}</p>
                      <p className="mt-0.5 font-mono text-[0.7rem] text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
                <span className="label-micro justify-self-start sm:justify-self-end">STEP {c.step}</span>
              </div>
            </div>
          </Stagger>
        ))}
      </div>
    </div>
  );
}

export function EvidenceCanvas({ chamber }: { chamber: ChamberId }) {
  switch (chamber) {
    case 1:
      return <VisualAnomaly />;
    case 2:
      return <Timeline />;
    case 3:
      return <Semantic />;
    case 4:
      return <Spatial />;
    case 5:
      return <Metadata />;
    case 6:
      return <Custody />;
  }
}