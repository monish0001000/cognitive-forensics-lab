# Cognitive Forensics Lab

Create a brand-new production-quality web CTF challenge: THE HUMAN PROTOCOL — COGNITIVE FORENSICS.

Build the COMPLETE playable app, not a mockup. It is a hard, deterministic, self-contained Web/Forensics/Logic CTF intended for 45–120 minutes. The challenge should emphasize human interpretation, cross-referencing, ambiguity resolution, and sustained reasoning. Do not claim absolute AI impossibility; design it to resist simple automated extraction and generic one-shot solving.

FIXED FLAG: CTF{HUMAN_PROTOCOL_7C4F9A2D}. Keep it ONLY server-side. Never expose it in client HTML, React state, frontend JS, static assets, source maps, local/session storage, public API responses, metadata, or error messages. Validate the final proof server-side. No random generation, no time-based generation, no artificial waiting. Provide a secure organizer-only location for changing the fixed flag.

CHALLENGE FLOW: cinematic briefing → participant challenge overview → six sequential chambers → final proof → backend verification → flag reveal. Chambers: (1) Visual Anomaly, (2) Timeline Reconstruction, (3) Semantic Consistency, (4) Spatial Reasoning, (5) Metadata Integrity, (6) Chain of Custody. Each chamber has multiple deterministic evidence items, interconnected clues, and plausible decoys. Later stages should depend on conclusions from earlier stages. Wrong answers should provide generic feedback without leaking the exact incorrect component. Add rate limiting and reset-progress functionality. Avoid accidental SQLi/XSS/SSRF/path traversal/auth bypass/debug leaks/alternate flag paths.

VISUAL QUALITY IS CRITICAL. Make this feel like a premium cinematic cyber-forensics game, NOT a generic admin dashboard. Create a completely new visual system.

OPENING EXPERIENCE: full-screen near-black/graphite cinematic environment; subtle perspective forensic grid; restrained particles/dust; very subtle scanline/noise; an elegant animated forensic artifact/core suspended at center; cyan primary signal and warm amber warning signal; dramatic but readable HUMAN PROTOCOL title; COGNITIVE FORENSICS subtitle; small CASE 07 / CLASSIFIED / DETERMINISTIC indicators; polished animated ENTER CASE FILE / BEGIN INVESTIGATION CTA; smooth transition into the case workspace. Avoid cheesy hacker clichés and excessive RGB neon.

TYPOGRAPHY: premium modern sans-serif for headings/UI, restrained monospace only for IDs/timestamps/technical labels. Strong hierarchy, excellent readability, generous spacing.

WORKSPACE DESKTOP: professional forensic command center. Left chamber/evidence navigation rail, large central evidence canvas, right contextual analyst/submission panel, top case identity/progress/help/info/reset controls. Use varied forensic artifact layouts instead of repetitive generic cards.

MOBILE-FIRST RESPONSIVENESS: must work beautifully at 320px, 375px, 430px, tablet, laptop, desktop and large screens. No horizontal overflow. Comfortable touch targets. Mobile uses compact sticky status bar, collapsible chamber navigator, full-width evidence canvas, intelligently stacked panels and accessible sticky submit action. Treat mobile as a first-class composition, not a shrunken desktop.

ANIMATION: smooth opening sequence, chamber transitions, staggered evidence reveals, subtle hover depth, progress illumination, animated relationships/connection lines where useful, button microinteractions, elegant success/failure feedback, loading transitions. Respect prefers-reduced-motion. Keep animations performant and never block interaction.

EVIDENCE VISUAL LANGUAGE: realistic fictional forensic evidence including inspection frames, document fragments, timeline strips, metadata sheets, provenance stamps, chain-of-custody labels, relationship diagrams, analyst annotations, evidence IDs, confidence/warning markers. Use sophisticated glass/translucent surfaces and occasional document textures. Cyan = active/reliable signal; amber = warning/uncertainty. Avoid rainbow palettes.

PARTICIPANT-FACING CHALLENGE DESCRIPTION must be available before starting and through an Info/About action. Present polished copy covering:
TITLE: THE HUMAN PROTOCOL — COGNITIVE FORENSICS
CATEGORY: Web / Forensics / Logic
DIFFICULTY: HARD
EXPECTED SOLVE TIME: 45–120 MINUTES
SCENARIO: “You have been given access to Case 07, a sealed forensic archive containing a sequence of apparently conflicting records. Somewhere inside the archive is a coherent chain of evidence — but only if you distinguish reliable signals from deliberate decoys. Your task is to reconstruct that chain across six evidence chambers and produce the final proof.”
OBJECTIVE: investigate six deterministic evidence chambers and reconstruct the only coherent chain. The final submission is a synthesized proof, not a simple hidden string.
CHAMBERS: Visual Anomaly → Timeline Reconstruction → Semantic Consistency → Spatial Reasoning → Metadata Integrity → Chain of Custody.
RULES: self-contained fictional challenge; do not attack external systems; no destructive activity; no brute force; normal analysis tools/browser devtools/note-taking/reasoning aids allowed unless otherwise stated; deliberate decoys exist; cross-reference evidence; progression is sequential; automated extraction alone is insufficient, but do not claim absolute AI impossibility.
FLAG POLICY: fixed flag revealed only after complete final proof is correctly validated by backend.
HOW TO PLAY: inspect every evidence item, keep notes, submit each chamber answer, reuse verified conclusions in later chambers, reset clears progress without changing the case.
Add polished Begin Investigation / How to Play / View Case Brief controls.

ORGANIZER README: keep private and never link publicly. Document intended solution for all six chambers, final proof construction, fixed flag location, anti-cheese protections, validation model, and how to safely change the fixed flag. Never expose organizer answers to participants.

QUALITY BAR: world-class CTF event quality. Prioritize visual polish, UX, accessibility, deterministic puzzle integrity, backend security, responsive behavior and a coherent forensic narrative. Ensure the actual challenge is playable end-to-end.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/25684155-75da-41c2-815f-1205672c71d5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
