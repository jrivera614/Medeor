// SF 600 - Dexie database
//
// IndexedDB schema for offline-first patient and entry storage.
//
// Design notes:
// - One database per medic device. Sync between devices is via JSON bundle
//   export/import, not via shared backend.
// - Indexed fields on Patient: id, lastName, updatedAt. lastName so the patient
//   list can sort alphabetically without loading everything into memory.
//   updatedAt for sync merges and "recently modified" sorts.
// - Indexed fields on Entry: id, patientId, date, updatedAt. patientId is the
//   hot path - everything filters by it. date for sort order in the list.
// - Outbox table reserved for future server sync but populated as an empty
//   store so a v2 migration doesn't need to add it later.
//
// Migration policy: any breaking change bumps the version number, adds a
// version().upgrade() block. NEVER edit a previously-shipped version() call
// in place - that will corrupt existing client databases.

import Dexie, { type Table } from "dexie";
import type { Patient, Entry } from "./types";
import { DEXIE_DB_NAME } from "./constants";

class SF600Database extends Dexie {
  patients!: Table<Patient, string>;
  entries!: Table<Entry, string>;

  constructor() {
    super(DEXIE_DB_NAME);

    // ─── version 1: initial schema ────────────────────────────────────────────
    // Shipped to medics on or after 2026-04-25. Do not edit this block.
    // Any new fields or indexes go in version(2)+ via .upgrade().
    this.version(1).stores({
      patients: "id, lastName, updatedAt",
      entries:  "id, patientId, date, updatedAt",
    });

    // ─── version 2: addenda on entries ────────────────────────────────────────
    // Adds optional Entry.addenda field for the supervisor-review feature.
    //
    // No index changes: addenda are read with their parent entry, not queried
    // independently. No backfill needed: the field is optional, so existing
    // rows are valid as-is and code reads `entry.addenda ?? []` everywhere.
    //
    // We still bump the version and provide an upgrade callback so Dexie
    // records the schema change in the version chain. Without an explicit
    // version(2) bump, a future v3 migration would have a harder time
    // detecting which clients have addendum-aware code.
    this.version(2).stores({
      patients: "id, lastName, updatedAt",
      entries:  "id, patientId, date, updatedAt",
    }).upgrade(async () => {
      // Intentionally empty. Addenda field is optional and undefined-safe.
    });

    // ─── future versions ──────────────────────────────────────────────────────
    // Rules for adding migrations:
    // 1. Never delete or edit a previous version() call - it must remain in
    //    the chain forever so devices upgrading from older versions migrate
    //    correctly.
    // 2. The .stores() call is a DELTA description, not a full schema. Each
    //    version()'s stores() call replaces the previous schema entirely, so
    //    list every table you want to keep, not just changes.
    // 3. The .upgrade() callback runs INSIDE a transaction. Don't call other
    //    Dexie operations on `this` from within it - use the `tx` parameter.
    // 4. Test migrations with fake-indexeddb before shipping.
  }
}

// Singleton instance. Only available where IndexedDB is reachable -
// real browsers, and node test environments with fake-indexeddb installed.
// On the server (SSR) there is no IndexedDB and we throw.

let _db: SF600Database | null = null;

export function getDb(): SF600Database {
  if (typeof indexedDB === "undefined") {
    throw new Error("SF 600 database requires IndexedDB (browser or test shim).");
  }
  if (!_db) _db = new SF600Database();
  return _db;
}

// Convenience: fetch every patient and entry. Used on app load and on bundle
// export. Sorted by updatedAt desc so the most recently touched record shows
// first in lists.
export async function loadAllData(): Promise<{ patients: Patient[]; entries: Entry[] }> {
  const db = getDb();
  const [patients, entries] = await Promise.all([
    db.patients.orderBy("updatedAt").reverse().toArray(),
    db.entries.orderBy("updatedAt").reverse().toArray(),
  ]);
  return { patients, entries };
}

// Storage health: returns ratio used / quota in [0, 1], or null if the browser
// does not support StorageManager.estimate (older Safari, some embedded WebKit).
// Surfaced by the StorageHealthBanner on app load.
export async function getStorageHealth(): Promise<{
  usage: number;
  quota: number;
  ratio: number;
} | null> {
  if (typeof navigator === "undefined") return null;
  if (!navigator.storage || typeof navigator.storage.estimate !== "function") {
    return null;
  }
  try {
    const est = await navigator.storage.estimate();
    const usage = est.usage ?? 0;
    const quota = est.quota ?? 0;
    if (quota === 0) return null;
    return { usage, quota, ratio: usage / quota };
  } catch (e) {
    console.warn("StorageManager.estimate() failed:", e);
    return null;
  }
}
