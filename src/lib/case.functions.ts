import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const chamberInput = z.object({
  chamber: z.number().int().min(1).max(6),
  answer: z.string().min(1).max(64),
});

const finalInput = z.object({
  proof: z.string().min(1).max(128),
});

function clientKey(): string {
  try {
    const request = getRequest();
    const headers = request.headers;
    return (
      headers.get("cf-connecting-ip") ||
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip") ||
      "anonymous"
    );
  } catch {
    return "anonymous";
  }
}

export const verifyChamber = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => chamberInput.parse(data))
  .handler(async ({ data }) => {
    const { matches, takeToken } = await import("./case-verify.server");
    const gate = takeToken(clientKey());
    if (!gate.allowed) {
      return { status: "throttled" as const, message: "Too many submissions. Pause and re-read the evidence." };
    }
    const ok = await matches(`c${data.chamber}`, data.answer);
    return ok
      ? { status: "correct" as const, message: "Conclusion accepted and sealed into the case record." }
      : { status: "rejected" as const, message: "The record does not support that conclusion. Re-examine the evidence." };
  });

export const verifyProof = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => finalInput.parse(data))
  .handler(async ({ data }) => {
    const { matches, takeToken, getFlag } = await import("./case-verify.server");
    const gate = takeToken(clientKey());
    if (!gate.allowed) {
      return { status: "throttled" as const, message: "Too many submissions. Pause and re-read the evidence." };
    }
    const ok = await matches("final", data.proof);
    if (!ok) {
      return {
        status: "rejected" as const,
        message: "Proof incoherent. At least one component contradicts the archive.",
      };
    }
    return {
      status: "correct" as const,
      message: "Proof coherent. Case 07 unsealed.",
      flag: getFlag(),
    };
  });