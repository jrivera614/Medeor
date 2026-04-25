import { describe, it, expect } from "vitest";
import { mergePure } from "../sync";
import type { Patient, Entry, Bundle } from "../types";

// Tests for the pure merge function. Operates on plain arrays so we don't
// need fake-indexeddb here - that's covered separately in roundtrip.test.ts.
//
// Critical invariants under last-write-wins:
//   - Newer updatedAt always wins, regardless of which side it's on.
//   - Same updatedAt = unchanged, no conflict logged.
//   - Different updatedAt with both sides present = conflict logged.
//   - New ids on the incoming side = added, no conflict.

const mkPatient = (id: string, lastName: string, updatedAt: number): Patient => ({
  id, lastName, firstName: "Test",
  createdAt: updatedAt, updatedAt,
});

const mkEntry = (id: string, patientId: string, updatedAt: number): Entry => ({
  id, patientId,
  date: "2026-04-25T13:42",
  narrative: `entry ${id}`,
  signedBy: "TEST, M",
  createdAt: updatedAt, updatedAt,
});

const mkBundle = (patients: Patient[], entries: Entry[]): Bundle => ({
  schemaVersion: 1,
  exportedAt: Date.now(),
  patients, entries,
});

describe("mergePure - patient merging", () => {
  it("adds new incoming patients", () => {
    const local: Patient[] = [];
    const incoming = mkBundle([mkPatient("p1", "RIVERA", 1000)], []);
    const { patients, report } = mergePure(local, [], incoming);

    expect(patients.length).toBe(1);
    expect(patients[0].id).toBe("p1");
    expect(report.added).toBe(1);
    expect(report.updated).toBe(0);
    expect(report.unchanged).toBe(0);
    expect(report.conflicts.length).toBe(0);
  });

  it("replaces local with incoming when incoming is newer", () => {
    const local = [mkPatient("p1", "OLD_NAME", 1000)];
    const incoming = mkBundle([mkPatient("p1", "NEW_NAME", 2000)], []);
    const { patients, report } = mergePure(local, [], incoming);

    expect(patients.length).toBe(1);
    expect(patients[0].lastName).toBe("NEW_NAME");
    expect(report.updated).toBe(1);
    expect(report.conflicts.length).toBe(1);
    expect(report.conflicts[0].winner).toBe("incoming");
  });

  it("keeps local when local is newer", () => {
    const local = [mkPatient("p1", "LOCAL_NAME", 2000)];
    const incoming = mkBundle([mkPatient("p1", "STALE_NAME", 1000)], []);
    const { patients, report } = mergePure(local, [], incoming);

    expect(patients.length).toBe(1);
    expect(patients[0].lastName).toBe("LOCAL_NAME");
    expect(report.unchanged).toBe(1);
    expect(report.updated).toBe(0);
    expect(report.conflicts.length).toBe(1);
    expect(report.conflicts[0].winner).toBe("local");
  });

  it("treats identical updatedAt as unchanged with no conflict", () => {
    const local = [mkPatient("p1", "RIVERA", 1000)];
    const incoming = mkBundle([mkPatient("p1", "RIVERA", 1000)], []);
    const { report } = mergePure(local, [], incoming);

    expect(report.unchanged).toBe(1);
    expect(report.conflicts.length).toBe(0);
  });
});

describe("mergePure - entry merging", () => {
  it("merges entries by id with the same LWW rules", () => {
    const local = [mkEntry("e1", "p1", 1000), mkEntry("e2", "p1", 5000)];
    const incoming = mkBundle([], [
      mkEntry("e1", "p1", 2000),  // incoming newer - replace
      mkEntry("e2", "p1", 4000),  // local newer - keep
      mkEntry("e3", "p1", 3000),  // brand new - add
    ]);
    const { entries, report } = mergePure([], local, incoming);

    expect(entries.length).toBe(3);
    expect(report.added).toBe(1);
    expect(report.updated).toBe(1);
    expect(report.unchanged).toBe(1);
    expect(report.conflicts.length).toBe(2);

    // Verify the right narrative survived
    const e1 = entries.find((e) => e.id === "e1");
    expect(e1?.updatedAt).toBe(2000); // incoming won
    const e2 = entries.find((e) => e.id === "e2");
    expect(e2?.updatedAt).toBe(5000); // local won
  });

  it("logs the actual updatedAt values in the conflict report", () => {
    const local = [mkEntry("e1", "p1", 1000)];
    const incoming = mkBundle([], [mkEntry("e1", "p1", 2000)]);
    const { report } = mergePure([], local, incoming);

    expect(report.conflicts[0].localUpdatedAt).toBe(1000);
    expect(report.conflicts[0].incomingUpdatedAt).toBe(2000);
    expect(report.conflicts[0].kind).toBe("entry");
  });
});

describe("mergePure - mixed patient + entry bundles", () => {
  it("handles a realistic two-medic sync scenario", () => {
    // Medic A's local DB
    const localPatients = [
      mkPatient("p1", "RIVERA", 1000),
      mkPatient("p2", "GARCIA", 2000),
    ];
    const localEntries = [
      mkEntry("e1", "p1", 1500),
      mkEntry("e2", "p2", 2500),
    ];

    // Medic B's bundle - both edited p1 since last sync, B added p3, B's e1 is newer
    const incoming = mkBundle(
      [
        mkPatient("p1", "RIVERA-EDITED", 3000),  // newer than A's
        mkPatient("p2", "GARCIA", 1500),         // older than A's
        mkPatient("p3", "NEW_PATIENT", 4000),    // brand new
      ],
      [
        mkEntry("e1", "p1", 3500),               // newer than A's
        mkEntry("e2", "p2", 2000),               // older than A's
        mkEntry("e3", "p3", 4500),               // brand new
      ],
    );

    const { patients, entries, report } = mergePure(localPatients, localEntries, incoming);

    expect(patients.length).toBe(3);
    expect(entries.length).toBe(3);

    // Counts: 1+1 added (p3, e3), 1+1 updated (p1, e1), 1+1 unchanged (p2, e2)
    expect(report.added).toBe(2);
    expect(report.updated).toBe(2);
    expect(report.unchanged).toBe(2);
    expect(report.conflicts.length).toBe(4);

    // Verify the winners
    expect(patients.find((p) => p.id === "p1")?.lastName).toBe("RIVERA-EDITED");
    expect(patients.find((p) => p.id === "p2")?.updatedAt).toBe(2000); // A's stuck
    expect(entries.find((e) => e.id === "e1")?.updatedAt).toBe(3500);  // B's won
    expect(entries.find((e) => e.id === "e2")?.updatedAt).toBe(2500);  // A's stuck
  });

  it("does not lose data when an empty bundle is merged", () => {
    const local = [mkPatient("p1", "RIVERA", 1000)];
    const localE = [mkEntry("e1", "p1", 1500)];
    const empty = mkBundle([], []);
    const { patients, entries, report } = mergePure(local, localE, empty);

    expect(patients.length).toBe(1);
    expect(entries.length).toBe(1);
    expect(report.added).toBe(0);
    expect(report.updated).toBe(0);
    expect(report.unchanged).toBe(0);
    expect(report.conflicts.length).toBe(0);
  });
});
