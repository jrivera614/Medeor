// SF 600 - shared types
//
// Patient and Entry are the two persisted entities. Provider is per-device only
// (no patient-link), and lives in localStorage rather than IndexedDB so the
// medic identity survives independently of patient data clears.
//
// Bundle is the JSON shape exchanged between devices for offline sync.
// ConflictReport is what the merge step produces so we can show "X merged,
// Y conflicts" to the user instead of silently last-write-wins-ing in the dark.

export interface Patient {
  id: string;            // uuid v4
  lastName: string;
  firstName: string;
  middleName?: string;
  idNumber?: string;     // SSN, EDIPI, or local ID
  sex?: "M" | "F" | "X" | "";
  dob?: string;          // YYYY-MM-DD
  rankGrade?: string;    // "SGT", "E-5", "CIV", etc.
  createdAt: number;     // epoch ms
  updatedAt: number;     // epoch ms - drives last-write-wins
  createdBy?: string;    // provider name at time of creation
}

export interface Entry {
  id: string;            // uuid v4
  patientId: string;
  date: string;          // local-zone ISO without offset, e.g. "2026-04-25T13:42"
  narrative: string;
  signedBy: string;      // provider name (typed signature)
  treatingOrganization?: string;

  // Vitals - all stored as strings so partial entry survives autosave
  hr?: string;
  sbp?: string;
  dbp?: string;
  rr?: string;
  spo2?: string;
  temp?: string;
  pain?: string;

  // Addenda: optional append-only chain of signed amendments to this entry.
  // Used for supervisor review (concur, dissent, late entries) and for the
  // original author's own late additions. Each addendum carries its own typed
  // signature and timestamp. The original entry remains editable by its
  // signer; addenda are immutable once signed. See EntryAddendum below.
  addenda?: EntryAddendum[];

  createdAt: number;
  updatedAt: number;
}

// EntryAddendum: a signed amendment to an Entry. Free-text + typed signature.
// Render order in UI and PDF is chronological by signedAt.
//
// This is the same level of attestation as the primary entry's signedBy
// field - typed name, no cryptographic identity. The clinical value is in
// the documented chain of review, not in proving who typed it. If real
// identity is needed later, a PIN or passkey can layer on without changing
// this shape.
//
// LWW on sync: addenda are merged by id (union) when both sides have the
// parent entry. Per-addendum conflicts (same id, different content) resolve
// by addendum.updatedAt. See sync.ts unionAddenda for details.
export interface EntryAddendum {
  id: string;            // uuid v4, generated at creation
  text: string;          // the addendum body, free text
  signedBy: string;      // typed name captured at sign time
  signedUnit?: string;   // optional unit / clinic
  signedAt: number;      // epoch ms when signed - drives display order
  createdAt: number;
  updatedAt: number;     // drives LWW for individual addendum
}

export interface Provider {
  name: string;          // typed signature, e.g. "RIVERA, J. SGT"
  unit?: string;         // default treating organization, e.g. "JTF Marianas"
}

// Bundle: the JSON file medics ship between devices via AirDrop / Nearby Share /
// USB. Versioned so a future field-level merge can detect old shapes.
export interface Bundle {
  schemaVersion: 1;
  exportedAt: number;
  exportedBy?: string;
  patients: Patient[];
  entries: Entry[];
}

// ConflictReport: produced by mergeBundle. A "conflict" here means the same id
// existed on both sides with different updatedAt values - last-write-wins
// resolved it but we surface the loser so a human can sanity-check.
export interface ConflictItem {
  kind: "patient" | "entry";
  id: string;
  label: string;        // human-readable, e.g. "RIVERA, J. - 2026-04-25 13:42"
  localUpdatedAt: number;
  incomingUpdatedAt: number;
  winner: "local" | "incoming";
}

export interface MergeReport {
  added: number;        // brand new ids from incoming
  updated: number;      // incoming was newer, replaced local
  unchanged: number;    // local was newer or identical, incoming dropped
  conflicts: ConflictItem[];
}
