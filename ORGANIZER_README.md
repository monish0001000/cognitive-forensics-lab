# ORGANIZER ONLY — THE HUMAN PROTOCOL / COGNITIVE FORENSICS (Case 07)

**Private. Never link this file from the app, never hand it to participants.**

Fixed flag: `CTF{HUMAN_PROTOCOL_7C4F9A2D}`

## Where the flag lives
`src/lib/case-verify.server.ts` — server-only module, imported lazily inside server-function handlers.
It is never imported by any client module, so it never enters the browser bundle.
Resolution order: `process.env.CTF_FLAG` → literal fallback.

### Changing the flag safely
1. Preferred: set the secret `CTF_FLAG` in Project Settings → Secrets, then publish. No code change, no rebuild of puzzle data.
2. Alternative: edit `FALLBACK_FLAG` in `src/lib/case-verify.server.ts`.
Do not change the answer digests when changing the flag — they are independent.

### Changing an answer
Recompute the digest: `sha256("hp7-cognitive-forensics-v1|" + answer.toUpperCase().replace(/\s+/g,""))`
and replace the entry in `DIGESTS`.

## Intended solution

**CH-01 Visual Anomaly → `FR-041`**
STD-IMG-4.2: `CHK = (R+G+B) mod 97`. All frames verify except FR-041 (76+19+233 = 328, 328 mod 97 = 37, recorded 44).
Decoys: FR-038 and FR-058 carry NOISE operator flags but verify; the standard states flags are advisory.

**CH-02 Timeline Reconstruction → `03:47`**
Ledger times are station local, `UTC = local − offset`. FR-041: 06:32 at ST-B / MERIDIAN, offset +02:45 → 03:47 UTC.
Decoys: the density strip plots local time; other stations use ±integer offsets so only ST-B punishes sloppy arithmetic.

**CH-03 Semantic Consistency → `OBSIDIAN`**
Verified facts: anomalous frame = FR-041, flag = CLEAN, ingest = 03:47 UTC, exactly one checksum failure.
- HALCYON — claims 06:32 *UTC* (local/UTC confusion). Fails.
- VESPER — claims the tampered frame is the noise-flagged one (FR-038). Fails.
- CINDER — claims three failures. Fails.
- LATTICE — claims ST-D origin (FR-041 is ST-B). Fails.
- OBSIDIAN — all three claims hold, despite LOW stated confidence. Correct.

**CH-04 Spatial Reasoning → `D4`**
FR-041 mount = C2. Walk only non-VOID lines: M-02 SOUTH 2 → C4; M-04 EAST 1 → D4.
Decoys: VOID lines M-01/M-03/M-05 would produce B2/C6-type answers if walked.

**CH-05 Metadata Integrity → `SN-8842`**
Authentic = signature verified + write-protect engaged + capture_utc 03:47 + sector C2.
- SN-4410: capture 06:32 (local time smuggled into a UTC field).
- SN-9127: sector E3 (FR-038 mount).
- SN-2036: signature broken, write-protect disengaged.
- SN-8842: passes all four tests. Custody seal SEAL-7731 carries into CH-06.

**CH-06 Chain of Custody → `K-19`**
Audit only the SN-8842 chain (steps 1–4). Step 1 (A-04) releases at 04:25; step 2 (K-19) records receipt at 04:10,
i.e. before release, and also hands on SEAL-7902 after receiving SEAL-7731. K-19 breaks the chain.
Decoys: steps 5–6 belong to SN-2036 and SN-4410 and contain their own irregularities that must be ignored.

## Final proof
Template shown to players: `<CH1>-<CH2 digits>-<CH3>-<CH4>-<CH5 digits>-<CH6 without separator>`

Correct proof: `FR-041-0347-OBSIDIAN-D4-8842-K19`

Validation normalises to uppercase and strips whitespace only; hyphens are significant.

## Validation model
- All six chamber answers and the final proof are validated in `createServerFn` handlers (`src/lib/case.functions.ts`).
- Comparison is salted SHA-256 with a constant-time hex compare. No plaintext answer is ever sent to the client.
- Only the final-proof handler returns the flag, and only on an exact match.
- Chamber gating (which chamber is reachable) is client-side UX; correctness and the flag are entirely server-side,
  so skipping the UI gate gains nothing — the final proof still has to be right.

## Anti-cheese protections
- No flag, no answers, no digest plaintexts in client bundles, assets, HTML, storage, metadata or error strings.
- Wrong answers return one generic message; no per-component feedback, no "3/6 correct" leakage, no timing branch.
- Token-bucket rate limit (8 attempts, refilling 1 per 4s per client IP) on both server functions; throttled replies
  are indistinguishable in content from a normal rejection apart from the neutral throttle notice.
- Input validated with zod (bounded length, integer chamber range) — no SQL, no filesystem, no outbound fetch,
  no user-controlled paths or URLs anywhere in the server code, so SQLi/SSRF/path traversal are structurally absent.
- No `dangerouslySetInnerHTML` anywhere; all evidence is static typed data rendered as text.
- Deterministic dataset: no randomness, no time dependence, no waiting.
- Reset clears only `localStorage["human-protocol-case07-progress"]` state; the case never mutates.

## Operational notes
- Keep `ORGANIZER_README.md` out of any published static directory (it is not in `public/`).
- If you fork the case for a second event, change both the salt and all digests.
