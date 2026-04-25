import { describe, it, expect, beforeEach } from "vitest";
import Dexie from "dexie";
import { getDb } from "../db";
import { buildBundle, mergeBundle, parseBundle } from "../sync";
import { uuid } from "../format";
import type { Patient, Entry } from "../types";
import { DEXIE_DB_NAME } from "../constants";

// IndexedDB roundtrip test. Creates a patient and a couple entries, exports
// to a JSON bundle, deletes the database, re-creates it empty, imports the
// bundle, and asserts the data round-trips exactly.
//
// fake-indexeddb is installed in setup.ts. We also call Dexie.delete()
// before each test to wipe state so tests don't bleed into each other.

beforeEach(async () => {
  await Dexie.delete(DEXIE_DB_NAME);
});

const mkPatient = (overrides: Partial<Patient> = {}): Patient => {
  const now = Date.now();
  return {
    id: uuid(),
    lastName: "RIVERA",
    firstName: "Justin",
    middleName: "M",
    idNumber: "123-45-6789",
    sex: "M",
    dob: "1985-06-15",
    rankGrade: "SGT",
    createdAt: now,
    updatedAt: now,
    createdBy: "TEST_MEDIC",
    ...overrides,
  };
};

const mkEntry = (patientId: string, overrides: Partial<Entry> = {}): Entry => {
  const now = Date.now();
  return {
    id: uuid(),
    patientId,
    date: "2026-04-25T13:42",
    narrative: "S: HA. O: vitals stable. A: tension HA. P: 800mg ibu, RTD prn.",
    signedBy: "TEST, M",
    treatingOrganization: "JTF Marianas",
    hr: "72",
    sbp: "118",
    dbp: "76",
    rr: "14",
    spo2: "99",
    temp: "98.4",
    pain: "3",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

describe("IndexedDB roundtrip", () => {
  it("persists a patient and entry, reads them back unchanged", async () => {
    const db = getDb();
    const p = mkPatient();
    const e = mkEntry(p.id);

    await db.patients.put(p);
    await db.entries.put(e);

    const loadedPatient = await db.patients.get(p.id);
    const loadedEntry = await db.entries.get(e.id);

    expect(loadedPatient).toEqual(p);
    expect(loadedEntry).toEqual(e);
  });

  it("queries entries by patientId index", async () => {
    const db = getDb();
    const p1 = mkPatient({ lastName: "ALPHA" });
    const p2 = mkPatient({ lastName: "BRAVO" });
    await db.patients.bulkPut([p1, p2]);

    const e1 = mkEntry(p1.id);
    const e2 = mkEntry(p1.id, { narrative: "second visit" });
    const e3 = mkEntry(p2.id);
    await db.entries.bulkPut([e1, e2, e3]);

    const p1Entries = await db.entries.where("patientId").equals(p1.id).toArray();
    expect(p1Entries.length).toBe(2);
    expect(p1Entries.every((e) => e.patientId === p1.id)).toBe(true);
  });

  it("round-trips a bundle through export -> parse -> mergeBundle", async () => {
    // Set up source database with one patient and two entries
    const db = getDb();
    const p = mkPatient();
    const e1 = mkEntry(p.id, { date: "2026-04-24T09:00", narrative: "first visit" });
    const e2 = mkEntry(p.id, { date: "2026-04-25T13:42", narrative: "follow-up" });
    await db.patients.put(p);
    await db.entries.bulkPut([e1, e2]);

    // Export
    const { json } = await buildBundle("TEST_MEDIC");
    expect(json).toContain('"schemaVersion": 1');
    expect(json).toContain(p.id);

    // Wipe and re-create the DB (simulates a different device)
    await Dexie.delete(DEXIE_DB_NAME);
    // Force the singleton to be re-built by reaching past the cache via
    // the same getDb call - new Dexie() will lazy-open against the empty store.

    // Parse and merge into the fresh DB
    const parsed = parseBundle(json);
    const report = await mergeBundle(parsed);

    expect(report.added).toBe(3); // 1 patient + 2 entries, all new
    expect(report.updated).toBe(0);
    expect(report.conflicts.length).toBe(0);

    // Verify data made it through identically
    const db2 = getDb();
    const loadedPatient = await db2.patients.get(p.id);
    const loadedEntries = await db2.entries.where("patientId").equals(p.id).toArray();

    expect(loadedPatient).toEqual(p);
    expect(loadedEntries.length).toBe(2);
    const sortedLoaded = [...loadedEntries].sort((a, b) => a.date.localeCompare(b.date));
    expect(sortedLoaded[0]).toEqual(e1);
    expect(sortedLoaded[1]).toEqual(e2);
  });

  it("merge with overlapping ids reports conflicts via real DB transaction", async () => {
    const db = getDb();
    const p = mkPatient({ updatedAt: 1000, lastName: "OLD" });
    await db.patients.put(p);

    // Build an incoming bundle with the same patient id but newer updatedAt
    const incomingPatient: Patient = { ...p, lastName: "NEW", updatedAt: 2000 };
    const bundle = {
      schemaVersion: 1 as const,
      exportedAt: Date.now(),
      patients: [incomingPatient],
      entries: [],
    };

    const report = await mergeBundle(bundle);
    expect(report.updated).toBe(1);
    expect(report.conflicts.length).toBe(1);
    expect(report.conflicts[0].winner).toBe("incoming");

    const after = await db.patients.get(p.id);
    expect(after?.lastName).toBe("NEW");
  });

  it("rejects malformed bundle JSON cleanly", () => {
    expect(() => parseBundle("not json")).toThrow(/not valid JSON/);
    expect(() => parseBundle('{"schemaVersion": 99}')).toThrow(/schema version/);
    expect(() => parseBundle('{"schemaVersion": 1, "patients": "nope", "entries": []}')).toThrow();
  });
});
