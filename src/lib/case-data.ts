// PUBLIC evidence data for Case 07. Contains NO answers and NO flag material.
// Every value here is deliberately visible to participants.

export type ChamberId = 1 | 2 | 3 | 4 | 5 | 6;

export const CHAMBERS: {
  id: ChamberId;
  code: string;
  name: string;
  discipline: string;
  prompt: string;
  placeholder: string;
  hint: string;
}[] = [
  {
    id: 1,
    code: "CH-01",
    name: "Visual Anomaly",
    discipline: "Imaging Integrity",
    prompt:
      "One capture frame in the sealed reel fails its own integrity rule. Identify the frame.",
    placeholder: "FR-000",
    hint: "Read the imaging standard note before trusting any operator flag. Flags are opinions; checksums are arithmetic.",
  },
  {
    id: 2,
    code: "CH-02",
    name: "Timeline Reconstruction",
    discipline: "Temporal Forensics",
    prompt:
      "Normalise the ingest ledger and report the true UTC capture time of the anomalous frame from CH-01.",
    placeholder: "HH:MM",
    hint: "Local clocks lie. Offsets are signed. One station runs a non-integer offset.",
  },
  {
    id: 3,
    code: "CH-03",
    name: "Semantic Consistency",
    discipline: "Statement Analysis",
    prompt:
      "Exactly one witness statement is fully consistent with the facts established in CH-01 and CH-02. Give its codeword.",
    placeholder: "CODEWORD",
    hint: "A statement fails if any single claim inside it contradicts a verified fact — confidence is irrelevant.",
  },
  {
    id: 4,
    code: "CH-04",
    name: "Spatial Reasoning",
    discipline: "Scene Geometry",
    prompt:
      "Starting from the mount sector of the anomalous frame's camera, walk the movement log. Report the terminal sector.",
    placeholder: "A1",
    hint: "Columns A–F run west to east. Rows 1–6 run north to south. Voided lines are not walked.",
  },
  {
    id: 5,
    code: "CH-05",
    name: "Metadata Integrity",
    discipline: "Device Provenance",
    prompt:
      "One acquisition sheet is internally authentic and agrees with every verified fact. Report its device serial.",
    placeholder: "SN-0000",
    hint: "An authentic sheet agrees with the true UTC time, the true mount sector, and its own signature block.",
  },
  {
    id: 6,
    code: "CH-06",
    name: "Chain of Custody",
    discipline: "Custodial Audit",
    prompt:
      "The custody chain for the authentic device is broken by exactly one custodian. Report that custodian's badge.",
    placeholder: "X-00",
    hint: "A chain is intact when each receipt time is at or after the prior release time, and the seal number carries forward.",
  },
];

/* ── CH-01 ─────────────────────────────────────────────────────────── */

export const IMAGING_STANDARD =
  "STD-IMG-4.2 — Frame integrity checksum CHK is defined as (R + G + B) mod 97, computed over the frame's mean channel values. A frame whose recorded CHK differs from the computed value is considered tampered. Operator flags are advisory only and carry no evidentiary weight.";

export type Frame = {
  id: string;
  r: number;
  g: number;
  b: number;
  chk: number;
  flag: "clean" | "noise" | "review";
  note: string;
};

export const FRAMES: Frame[] = [
  { id: "FR-017", r: 88, g: 201, b: 45, chk: 43, flag: "clean", note: "Ambient corridor, stable exposure." },
  { id: "FR-023", r: 12, g: 240, b: 199, chk: 63, flag: "review", note: "Operator queried colour cast." },
  { id: "FR-031", r: 205, g: 17, b: 66, chk: 94, flag: "clean", note: "Door plane, no motion." },
  { id: "FR-038", r: 140, g: 140, b: 140, chk: 32, flag: "noise", note: "Heavy sensor noise reported by night operator." },
  { id: "FR-041", r: 76, g: 19, b: 233, chk: 44, flag: "clean", note: "Logged as routine by night operator." },
  { id: "FR-046", r: 3, g: 255, b: 128, chk: 95, flag: "review", note: "Blown highlight in upper third." },
  { id: "FR-052", r: 199, g: 88, b: 11, chk: 7, flag: "clean", note: "Warm cast from service lamp." },
  { id: "FR-058", r: 64, g: 64, b: 192, chk: 29, flag: "noise", note: "Compression artefacts near edge." },
  { id: "FR-063", r: 250, g: 5, b: 44, chk: 8, flag: "clean", note: "Final frame of reel." },
];

/* ── CH-02 ─────────────────────────────────────────────────────────── */

export type LedgerRow = {
  frame: string;
  station: string;
  localTime: string;
  offset: string;
  note: string;
};

export const LEDGER: LedgerRow[] = [
  { frame: "FR-017", station: "ST-A / HARBOUR", localTime: "01:10", offset: "+01:00", note: "Ingest nominal." },
  { frame: "FR-023", station: "ST-C / RIDGE", localTime: "02:55", offset: "-03:00", note: "Ingest nominal." },
  { frame: "FR-031", station: "ST-A / HARBOUR", localTime: "03:20", offset: "+01:00", note: "Ingest nominal." },
  { frame: "FR-038", station: "ST-D / VAULT", localTime: "05:14", offset: "+05:30", note: "Operator marked NOISE." },
  { frame: "FR-041", station: "ST-B / MERIDIAN", localTime: "06:32", offset: "+02:45", note: "Station B runs a non-integer civil offset." },
  { frame: "FR-046", station: "ST-D / VAULT", localTime: "09:02", offset: "+05:30", note: "Ingest nominal." },
  { frame: "FR-052", station: "ST-B / MERIDIAN", localTime: "07:15", offset: "+02:45", note: "Ingest nominal." },
  { frame: "FR-058", station: "ST-C / RIDGE", localTime: "23:40", offset: "-03:00", note: "Previous day reel tail." },
  { frame: "FR-063", station: "ST-A / HARBOUR", localTime: "04:59", offset: "+01:00", note: "Reel closed." },
];

export const LEDGER_NOTE =
  "Ledger times are STATION LOCAL. UTC = local − offset. Archive index times elsewhere in this case file are already UTC and must not be converted twice.";

/* ── CH-03 ─────────────────────────────────────────────────────────── */

export type Statement = {
  codeword: string;
  witness: string;
  role: string;
  confidence: string;
  claims: string[];
};

export const STATEMENTS: Statement[] = [
  {
    codeword: "HALCYON",
    witness: "R. Anselm",
    role: "Night operator, ST-B",
    confidence: "HIGH",
    claims: [
      "The suspect frame reached the archive at 06:32 UTC.",
      "I logged the frame as routine.",
      "No other station was ingesting at that moment.",
    ],
  },
  {
    codeword: "OBSIDIAN",
    witness: "T. Varga",
    role: "Archive clerk",
    confidence: "LOW",
    claims: [
      "The tampered frame entered before 04:00 UTC, while it was still dark.",
      "It was carrying a clean operator flag, not a noise flag.",
      "Only a single frame in the reel failed the checksum rule.",
    ],
  },
  {
    codeword: "VESPER",
    witness: "M. Dowd",
    role: "Shift supervisor",
    confidence: "HIGH",
    claims: [
      "The tampered frame is the one the night operator marked as noise.",
      "It came in before 04:00 UTC.",
      "The reel contains exactly one failure.",
    ],
  },
  {
    codeword: "CINDER",
    witness: "P. Okonjo",
    role: "QA reviewer",
    confidence: "MEDIUM",
    claims: [
      "Three frames in the reel fail the checksum rule.",
      "The earliest failure was ingested from ST-B.",
      "All flags in the reel are advisory.",
    ],
  },
  {
    codeword: "LATTICE",
    witness: "S. Fenn",
    role: "External auditor",
    confidence: "MEDIUM",
    claims: [
      "The tampered frame originated at ST-D / VAULT.",
      "The reel contains exactly one failure.",
      "The failure was ingested before 04:00 UTC.",
    ],
  },
];

/* ── CH-04 ─────────────────────────────────────────────────────────── */

export const MOUNTS: { frame: string; sector: string; fixture: string }[] = [
  { frame: "FR-017", sector: "A1", fixture: "Ceiling dome" },
  { frame: "FR-023", sector: "F6", fixture: "Wall bracket" },
  { frame: "FR-031", sector: "B5", fixture: "Door lintel" },
  { frame: "FR-038", sector: "E3", fixture: "Pole mount" },
  { frame: "FR-041", sector: "C2", fixture: "Recessed housing" },
  { frame: "FR-046", sector: "D6", fixture: "Ceiling dome" },
  { frame: "FR-052", sector: "A4", fixture: "Wall bracket" },
  { frame: "FR-058", sector: "F1", fixture: "Pole mount" },
  { frame: "FR-063", sector: "B3", fixture: "Door lintel" },
];

export type MoveRow = { seq: string; instruction: string; status: "walk" | "void" };

export const MOVEMENT_LOG: MoveRow[] = [
  { seq: "M-01", instruction: "NORTH 1", status: "void" },
  { seq: "M-02", instruction: "SOUTH 2", status: "walk" },
  { seq: "M-03", instruction: "WEST 3", status: "void" },
  { seq: "M-04", instruction: "EAST 1", status: "walk" },
  { seq: "M-05", instruction: "SOUTH 4", status: "void" },
];

export const GRID_NOTE =
  "Sector grid: columns A–F west→east, rows 1–6 north→south. VOID lines were struck from the log by the scene officer and are not walked. The walk begins at the mount sector of the anomalous frame's camera.";

/* ── CH-05 ─────────────────────────────────────────────────────────── */

export type Sheet = {
  serial: string;
  model: string;
  captureUtc: string;
  sector: string;
  writeProtect: boolean;
  signature: string;
  signatureState: "verified" | "broken";
  custodySeal: string;
};

export const SHEETS: Sheet[] = [
  {
    serial: "SN-4410",
    model: "AXIOM 3 / thermal",
    captureUtc: "06:32",
    sector: "C2",
    writeProtect: true,
    signature: "9f21…c0ab",
    signatureState: "verified",
    custodySeal: "SEAL-7710",
  },
  {
    serial: "SN-8842",
    model: "AXIOM 3 / visible",
    captureUtc: "03:47",
    sector: "C2",
    writeProtect: true,
    signature: "41d8…7b62",
    signatureState: "verified",
    custodySeal: "SEAL-7731",
  },
  {
    serial: "SN-9127",
    model: "AXIOM 2 / visible",
    captureUtc: "03:47",
    sector: "E3",
    writeProtect: true,
    signature: "0cc4…19fe",
    signatureState: "verified",
    custodySeal: "SEAL-7744",
  },
  {
    serial: "SN-2036",
    model: "AXIOM 3 / visible",
    captureUtc: "03:47",
    sector: "C2",
    writeProtect: false,
    signature: "b7a0…4d11",
    signatureState: "broken",
    custodySeal: "SEAL-7758",
  },
];

export const SHEET_NOTE =
  "An acquisition sheet is authentic only when its signature block verifies, write-protect was engaged at acquisition, and its capture time and sector both agree with independently verified facts.";

/* ── CH-06 ─────────────────────────────────────────────────────────── */

export type CustodyRow = {
  step: string;
  badge: string;
  custodian: string;
  device: string;
  received: string;
  released: string;
  sealIn: string;
  sealOut: string;
};

export const CUSTODY: CustodyRow[] = [
  { step: "1", badge: "A-04", custodian: "N. Reyes", device: "SN-8842", received: "03:52", released: "04:25", sealIn: "SEAL-7731", sealOut: "SEAL-7731" },
  { step: "2", badge: "K-19", custodian: "J. Halbrook", device: "SN-8842", received: "04:10", released: "05:02", sealIn: "SEAL-7731", sealOut: "SEAL-7902" },
  { step: "3", badge: "T-07", custodian: "L. Mbeki", device: "SN-8842", received: "05:02", released: "06:40", sealIn: "SEAL-7902", sealOut: "SEAL-7902" },
  { step: "4", badge: "R-33", custodian: "D. Sørensen", device: "SN-8842", received: "06:40", released: "08:15", sealIn: "SEAL-7902", sealOut: "SEAL-7902" },
  { step: "5", badge: "B-12", custodian: "C. Iwu", device: "SN-2036", received: "04:00", released: "04:55", sealIn: "SEAL-7758", sealOut: "SEAL-7801" },
  { step: "6", badge: "G-58", custodian: "H. Lind", device: "SN-4410", received: "05:20", released: "07:00", sealIn: "SEAL-7710", sealOut: "SEAL-7710" },
];

export const CUSTODY_NOTE =
  "Audit only the chain belonging to the authentic device. A step breaks the chain if it takes receipt before the previous custodian released the item, or if the seal it hands on does not match the seal it received.";

/* ── FINAL PROOF ───────────────────────────────────────────────────── */

export const PROOF_TEMPLATE = "<CH1>-<CH2 digits>-<CH3>-<CH4>-<CH5 digits>-<CH6 without separator>";
export const PROOF_EXAMPLE = "FR-000-0000-WORD-A1-0000-X00";