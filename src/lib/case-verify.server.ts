/**
 * SERVER-ONLY. Never imported by client code.
 *
 * Contains: the fixed flag, the answer digests and the rate limiter.
 * Answers are stored as salted SHA-256 digests so that neither the plaintext
 * answers nor the flag can be recovered from any client-reachable artifact.
 *
 * ORGANIZER: to change the flag, set the CTF_FLAG secret (Project Settings →
 * Secrets). The literal below is only the fallback for local runs.
 */

const FALLBACK_FLAG = "CTF{HUMAN_PROTOCOL_7C4F9A2D}";

export function getFlag(): string {
  return process.env["CTF_FLAG"] || FALLBACK_FLAG;
}

const SALT = "hp7-cognitive-forensics-v1";

const DIGESTS: Record<string, string> = {
  c1: "0f4466ae7a8b538a137c440c0b036346223185315724d644a3a4835a4eaccb46",
  c2: "20cd7c5dc079bf7cdeee72447109449b4d6b1af6e0fd0ffcb600d26365dd98a1",
  c3: "3b2b57e8c02565abb7bf0bf42244c98d6519dd5ce1e2bc3af6016804a9fbd877",
  c4: "cd718ef2fbe371784ae62742e376f6f42753099ad5dbc3020fd7ca3bbc73ee3e",
  c5: "5d6e800644f80fba980cd0d86546175362418ac8142eb0a78c254c3e1f0f4a53",
  c6: "9052133725064f01782907966425a646d7283b6da8433e1e7459f62fd460fcd7",
  final: "0b7cf7f3dabde4e9be6e73009799bf935b8f78d03a7a4f38cf2b9dcb2c3a4a4a",
};

function normalize(input: string): string {
  return input.toUpperCase().replace(/\s+/g, "");
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function matches(key: string, submission: string): Promise<boolean> {
  const expected = DIGESTS[key];
  if (!expected) return false;
  const actual = await sha256Hex(`${SALT}|${normalize(submission)}`);
  return constantTimeEqual(actual, expected);
}

/* ── Rate limiting (in-memory, per client bucket) ──────────────────── */

type Bucket = { tokens: number; updated: number };
const buckets = new Map<string, Bucket>();
const CAPACITY = 8;
const REFILL_MS = 4000; // one attempt back every 4s

export function takeToken(key: string): { allowed: boolean; retryInMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: CAPACITY, updated: now };
  const refilled = Math.min(CAPACITY, bucket.tokens + Math.floor((now - bucket.updated) / REFILL_MS));
  const next: Bucket = { tokens: refilled, updated: now };

  if (buckets.size > 5000) buckets.clear();

  if (next.tokens <= 0) {
    buckets.set(key, next);
    return { allowed: false, retryInMs: REFILL_MS };
  }
  next.tokens -= 1;
  buckets.set(key, next);
  return { allowed: true, retryInMs: 0 };
}