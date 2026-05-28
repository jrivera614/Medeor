// SF 600 - device-to-device sync
//
// Two medics on a humanitarian mission, mixed iOS/Android tablets, no server.
// Sync happens by exporting a JSON bundle on one device, transferring it via
// AirDrop/Nearby Share/USB, importing on the other.
//
// Merge strategy: id-keyed last-write-wins by updatedAt.
// - If incoming.id is new: add it.
// - If incoming.id exists locally and incoming.updatedAt > local.updatedAt:
//   replace local with incoming, log it as a conflict (both sides edited the
//   same record - the loser is preserved in the report so the medic can
//   manually re-enter anything that got clobbered).
// - If incoming.id exists locally and local.updatedAt >= incoming.updatedAt:
//   drop incoming, log it as a conflict if the timestamps differ.
//
// We deliberately do NOT do field-level merge. Field merge for medical records
// without a UI to confirm each conflict is dangerous - you can end up with
// vitals from one entry attached to a narrative from another. LWW is the
// honest minimum: explicit, auditable, surfaces conflicts to the human.

import type { Bundle, Patient, Entry, EntryAddendum, ConflictItem, MergeReport } from "./types";
import { getDb } from "./db";

// unionAddenda: merge two addenda arrays from the same entry by id.
//
// Used by the entry-merge step when an entry exists on both local and incoming
// sides. Without this, the LWW entry-replace would silently drop addenda that
// only existed on the loser. With this, both sides' addenda survive the merge.
//
// Per-addendum LWW: when the same addendum id exists on both sides (rare,
// since each device generates fresh uuids - this can really only happen if a
// bundle is exported, the receiver edits the addendum, and the original
// signer also edited it before the next sync), the higher updatedAt wins.
//
// Returns a new array sorted by signedAt ascending (display order).
export function unionAddenda(
  local: EntryAddendum[] | undefined,
  incoming: EntryAddendum[] | undefined,
): EntryAddendum[] {
  const localArr = local ?? [];
  const incomingArr = incoming ?? [];
  if (localArr.length === 0 && incomingArr.length === 0) return [];

  const byId = new Map<string, EntryAddendum>();
  for (const a of localArr) byId.set(a.id, a);
  for (const a of incomingArr) {
    const existing = byId.get(a.id);
    if (!existing || a.updatedAt > existing.updatedAt) byId.set(a.id, a);
  }
  return Array.from(byId.values()).sort((a, b) => a.signedAt - b.signedAt);
}

// addendaEqual: shallow-by-id comparison used to decide whether the merged
// addenda list differs from a side's existing list. Compares length first,
// then per-id updatedAt. Sufficient for merge decisions because addenda are
// immutable post-sign: same id + same updatedAt means same content.
function addendaEqual(
  a: EntryAddendum[] | undefined,
  b: EntryAddendum[] | undefined,
): boolean {
  const aa = a ?? [];
  const bb = b ?? [];
  if (aa.length !== bb.length) return false;
  const aMap = new Map(aa.map((x) => [x.id, x.updatedAt]));
  for (const x of bb) {
    if (aMap.get(x.id) !== x.updatedAt) return false;
  }
  return true;
}

// applyMergedAddenda: returns a copy of `entry` with the merged addenda
// applied. Omits the addenda field entirely when empty so we don't persist
// meaningless `addenda: []` on entries that have none.
function applyMergedAddenda(entry: Entry, merged: EntryAddendum[]): Entry {
  if (merged.length === 0) {
    const { addenda: _drop, ...rest } = entry;
    void _drop;
    return rest;
  }
  return { ...entry, addenda: merged };
}

// Build a Bundle from current database state. Caller is responsible for the
// download mechanics - this just produces the JSON string and a suggested name.
export async function buildBundle(exportedBy?: string): Promise<{
  json: string;
  filename: string;
}> {
  const db = getDb();
  const [patients, entries] = await Promise.all([
    db.patients.toArray(),
    db.entries.toArray(),
  ]);
  const bundle: Bundle = {
    schemaVersion: 1,
    exportedAt: Date.now(),
    exportedBy,
    patients,
    entries,
  };
  const stamp = new Date().toISOString().slice(0, 10);
  const safeName = (exportedBy || "medeor").replace(/[^A-Za-z0-9_-]/g, "_");
  return {
    json: JSON.stringify(bundle, null, 2),
    filename: `sf600_bundle_${safeName}_${stamp}.json`,
  };
}

// Validate that an arbitrary parsed object is a Bundle. We accept any
// schemaVersion 1 bundle - future versions will add a migration step here.
function isValidBundle(obj: unknown): obj is Bundle {
  if (!obj || typeof obj !== "object") return false;
  const b = obj as Partial<Bundle>;
  if (b.schemaVersion !== 1) return false;
  if (!Array.isArray(b.patients) || !Array.isArray(b.entries)) return false;
  // Spot-check shape. Don't fully validate every field - corrupt fields will
  // surface as render-time issues, not as silent data loss.
  for (const p of b.patients) {
    if (!p || typeof p.id !== "string" || typeof p.updatedAt !== "number") return false;
  }
  for (const e of b.entries) {
    if (!e || typeof e.id !== "string" || typeof e.patientId !== "string"
        || typeof e.updatedAt !== "number") return false;
  }
  return true;
}

// Parse a JSON string into a Bundle. Throws Error with a human-readable
// message on failure - caller catches and shows a toast.
//
// Forgiving on input: strips a UTF-8 BOM (some Mail/share-sheet transports
// inject one) and trims surrounding whitespace before parsing. Without this,
// JSON.parse fails with a confusing "Unexpected token" pointing at column 1
// when the actual problem is an invisible \uFEFF prefix the medic can't see.
//
// On parse failure, the error includes the first ~40 characters of what was
// loaded so the medic can tell at a glance whether they imported the real
// bundle (starts with "{") vs an AppleDouble sidecar (binary garbage) vs an
// empty/wrong file.
export function parseBundle(json: string): Bundle {
  const cleaned = (json || "").replace(/^\uFEFF/, "").trim();
  if (!cleaned) {
    throw new Error("Bundle file is empty.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    const preview = cleaned.slice(0, 40).replace(/\s+/g, " ");
    throw new Error(
      `Bundle is not valid JSON: ${(e as Error).message}. ` +
      `File starts with: "${preview}${cleaned.length > 40 ? "..." : ""}"`,
    );
  }
  if (!isValidBundle(parsed)) {
    throw new Error("Bundle is missing required fields or has the wrong schema version.");
  }
  return parsed;
}

// Helper: build a label for the conflict report so a human can identify the
// record without opening the database.
function patientLabel(p: Patient): string {
  return `${p.lastName || "?"}, ${p.firstName || "?"}`;
}
function entryLabel(e: Entry, patient?: Patient): string {
  const who = patient ? patientLabel(patient) : "(unknown patient)";
  return `${who} - ${e.date}`;
}

// mergeBundle: write incoming patients and entries into the local database
// using LWW resolution. Returns a MergeReport with counts and the conflict log.
//
// Pure DB operations - the caller decides what UI to show with the result.
export async function mergeBundle(incoming: Bundle): Promise<MergeReport> {
  const db = getDb();
  const conflicts: ConflictItem[] = [];
  let added = 0, updated = 0, unchanged = 0;

  await db.transaction("rw", db.patients, db.entries, async () => {
    // Build lookup of local patients for entry-conflict labelling.
    const localPatientsArr = await db.patients.toArray();
    const localPatients = new Map(localPatientsArr.map((p) => [p.id, p]));

    // ─── Patients ─────────────────────────────────────────────────────────────
    for (const incomingP of incoming.patients) {
      const localP = await db.patients.get(incomingP.id);
      if (!localP) {
        await db.patients.put(incomingP);
        added++;
        continue;
      }
      if (incomingP.updatedAt > localP.updatedAt) {
        conflicts.push({
          kind: "patient",
          id: incomingP.id,
          label: patientLabel(incomingP),
          localUpdatedAt: localP.updatedAt,
          incomingUpdatedAt: incomingP.updatedAt,
          winner: "incoming",
        });
        await db.patients.put(incomingP);
        updated++;
      } else if (incomingP.updatedAt < localP.updatedAt) {
        conflicts.push({
          kind: "patient",
          id: incomingP.id,
          label: patientLabel(localP),
          localUpdatedAt: localP.updatedAt,
          incomingUpdatedAt: incomingP.updatedAt,
          winner: "local",
        });
        unchanged++;
      } else {
        unchanged++;
      }
    }

    // Refresh patient lookup after potential adds/updates so entry labels are
    // accurate.
    const refreshed = await db.patients.toArray();
    refreshed.forEach((p) => localPatients.set(p.id, p));

    // ─── Entries ──────────────────────────────────────────────────────────────
    for (const incomingE of incoming.entries) {
      const localE = await db.entries.get(incomingE.id);
      if (!localE) {
        await db.entries.put(incomingE);
        added++;
        continue;
      }
      // Both sides have this entry id. Compute the merged addenda union up
      // front so it survives whichever side wins LWW on parent fields.
      // Without this, an addendum that only existed on the LWW loser would
      // be silently dropped.
      const mergedAddenda = unionAddenda(localE.addenda, incomingE.addenda);

      if (incomingE.updatedAt > localE.updatedAt) {
        conflicts.push({
          kind: "entry",
          id: incomingE.id,
          label: entryLabel(incomingE, localPatients.get(incomingE.patientId)),
          localUpdatedAt: localE.updatedAt,
          incomingUpdatedAt: incomingE.updatedAt,
          winner: "incoming",
        });
        await db.entries.put(applyMergedAddenda(incomingE, mergedAddenda));
        updated++;
      } else if (incomingE.updatedAt < localE.updatedAt) {
        conflicts.push({
          kind: "entry",
          id: incomingE.id,
          label: entryLabel(localE, localPatients.get(localE.patientId)),
          localUpdatedAt: localE.updatedAt,
          incomingUpdatedAt: incomingE.updatedAt,
          winner: "local",
        });
        // Local wins on parent fields, but incoming may have addenda we
        // don't. If so, write local with the merged addenda; updatedAt
        // stays at local's value (we're only appending, not changing parent).
        if (!addendaEqual(localE.addenda, mergedAddenda)) {
          await db.entries.put(applyMergedAddenda(localE, mergedAddenda));
          updated++;
        } else {
          unchanged++;
        }
      } else {
        // Equal updatedAt - same state in LWW terms. Parent fields don't
        // change, but addenda could still diverge in edge cases (manual
        // import of an older bundle). Merge addenda silently, no conflict.
        if (!addendaEqual(localE.addenda, mergedAddenda)) {
          await db.entries.put(applyMergedAddenda(localE, mergedAddenda));
          updated++;
        } else {
          unchanged++;
        }
      }
    }
  });

  return { added, updated, unchanged, conflicts };
}

// Pure-function variant of mergeBundle for unit tests. Operates on plain
// arrays instead of the live database. Returns the resulting arrays and the
// same MergeReport so tests can assert without standing up fake-indexeddb.
export function mergePure(
  localPatients: Patient[],
  localEntries: Entry[],
  incoming: Bundle,
): { patients: Patient[]; entries: Entry[]; report: MergeReport } {
  const conflicts: ConflictItem[] = [];
  let added = 0, updated = 0, unchanged = 0;

  const patientMap = new Map(localPatients.map((p) => [p.id, p]));

  for (const incomingP of incoming.patients) {
    const localP = patientMap.get(incomingP.id);
    if (!localP) {
      patientMap.set(incomingP.id, incomingP);
      added++;
      continue;
    }
    if (incomingP.updatedAt > localP.updatedAt) {
      conflicts.push({
        kind: "patient", id: incomingP.id,
        label: patientLabel(incomingP),
        localUpdatedAt: localP.updatedAt,
        incomingUpdatedAt: incomingP.updatedAt,
        winner: "incoming",
      });
      patientMap.set(incomingP.id, incomingP);
      updated++;
    } else if (incomingP.updatedAt < localP.updatedAt) {
      conflicts.push({
        kind: "patient", id: incomingP.id,
        label: patientLabel(localP),
        localUpdatedAt: localP.updatedAt,
        incomingUpdatedAt: incomingP.updatedAt,
        winner: "local",
      });
      unchanged++;
    } else {
      unchanged++;
    }
  }

  const entryMap = new Map(localEntries.map((e) => [e.id, e]));
  for (const incomingE of incoming.entries) {
    const localE = entryMap.get(incomingE.id);
    if (!localE) {
      entryMap.set(incomingE.id, incomingE);
      added++;
      continue;
    }
    // Both sides have this entry. Union addenda regardless of which side
    // wins parent LWW so neither's addenda are silently dropped.
    const mergedAddenda = unionAddenda(localE.addenda, incomingE.addenda);

    if (incomingE.updatedAt > localE.updatedAt) {
      conflicts.push({
        kind: "entry", id: incomingE.id,
        label: entryLabel(incomingE, patientMap.get(incomingE.patientId)),
        localUpdatedAt: localE.updatedAt,
        incomingUpdatedAt: incomingE.updatedAt,
        winner: "incoming",
      });
      entryMap.set(incomingE.id, applyMergedAddenda(incomingE, mergedAddenda));
      updated++;
    } else if (incomingE.updatedAt < localE.updatedAt) {
      conflicts.push({
        kind: "entry", id: incomingE.id,
        label: entryLabel(localE, patientMap.get(localE.patientId)),
        localUpdatedAt: localE.updatedAt,
        incomingUpdatedAt: incomingE.updatedAt,
        winner: "local",
      });
      if (!addendaEqual(localE.addenda, mergedAddenda)) {
        entryMap.set(localE.id, applyMergedAddenda(localE, mergedAddenda));
        updated++;
      } else {
        unchanged++;
      }
    } else {
      if (!addendaEqual(localE.addenda, mergedAddenda)) {
        entryMap.set(localE.id, applyMergedAddenda(localE, mergedAddenda));
        updated++;
      } else {
        unchanged++;
      }
    }
  }

  return {
    patients: Array.from(patientMap.values()),
    entries: Array.from(entryMap.values()),
    report: { added, updated, unchanged, conflicts },
  };
}
