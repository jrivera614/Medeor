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

  createdAt: number;
  updatedAt: number;
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
