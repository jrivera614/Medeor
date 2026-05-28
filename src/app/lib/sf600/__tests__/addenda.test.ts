import { describe, it, expect } from "vitest";
import { unionAddenda, mergePure } from "../sync";
import type { Patient, Entry, EntryAddendum, Bundle } from "../types";

// Tests for the addenda feature: the union helper, and the cross-device
// merge behavior when both sides edited the same entry. The critical
// invariant: addenda from both sides survive the merge regardless of which
// side wins LWW on parent entry fields.

const mkPatient = (id: string, updatedAt = 1000): Patient => ({
  id, lastName: "RIVERA", firstName: "J",
  createdAt: updatedAt, updatedAt,
});

const mkEntry = (
  id: string, patientId: string, updatedAt: number,
  overrides: Partial<Entry> = {},
): Entry => ({
  id, patientId,
  date: "2026-04-25T13:42",
  narrative: `entry ${id}`,
  signedBy: "TEST, M",
  createdAt: updatedAt, updatedAt,
  ...overrides,
});

const mkAddendum = (
  id: string, signedAt: number, text = `addendum ${id}`,
  signedBy = "SUPERVISOR",
): EntryAddendum => ({
  id, text, signedBy,
  signedAt, createdAt: signedAt, updatedAt: signedAt,
});

const mkBundle = (entries: Entry[], patients: Patient[] = []): Bundle => ({
  schemaVersion: 1,
  exportedAt: Date.now(),
  patients, entries,
});

// ─── unionAddenda ────────────────────────────────────────────────────────────

describe("unionAddenda", () => {
  it("returns empty array when both sides are empty", () => {
    expect(unionAddenda(undefined, undefined)).toEqual([]);
    expect(unionAddenda([], [])).toEqual([]);
    expect(unionAddenda(undefined, [])).toEqual([]);
  });

  it("returns the non-empty side when the other is empty", () => {
    const a = [mkAddendum("a1", 1000)];
    expect(unionAddenda(a, [])).toHaveLength(1);
    expect(unionAddenda([], a)).toHaveLength(1);
    expect(unionAddenda(undefined, a)).toHaveLength(1);
  });

  it("unions disjoint addenda from both sides", () => {
    const local = [mkAddendum("a1", 1000)];
    const incoming = [mkAddendum("a2", 2000)];
    const merged = unionAddenda(local, incoming);
    expect(merged).toHaveLength(2);
    const ids = merged.map((a) => a.id);
    expect(ids).toContain("a1");
    expect(ids).toContain("a2");
  });

  it("sorts result by signedAt ascending (display order)", () => {
    const local = [mkAddendum("a3", 3000)];
    const incoming = [mkAddendum("a1", 1000), mkAddendum("a2", 2000)];
    const merged = unionAddenda(local, incoming);
    expect(merged.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
  });

  it("resolves same-id conflict by per-addendum updatedAt", () => {
    // Edge case: same addendum id on both sides with different content.
    // Realistically only happens if a bundle was exported, edited on the
    // receiver, and the original signer also edited it before the next sync.
    const olderVersion = mkAddendum("a1", 1000);
    const newerVersion: EntryAddendum = {
      ...olderVersion,
      text: "newer content",
      updatedAt: 2000,
    };
    const merged = unionAddenda([olderVersion], [newerVersion]);
    expect(merged).toHaveLength(1);
    expect(merged[0].text).toBe("newer content");
    expect(merged[0].updatedAt).toBe(2000);
  });

  it("symmetric: same result whether the newer version comes from local or incoming", () => {
    const older = mkAddendum("a1", 1000);
    const newer: EntryAddendum = { ...older, text: "newer", updatedAt: 2000 };

    const merged1 = unionAddenda([older], [newer]);
    const merged2 = unionAddenda([newer], [older]);
    expect(merged1[0].text).toBe("newer");
    expect(merged2[0].text).toBe("newer");
  });

  it("does not mutate either input array", () => {
    const local = [mkAddendum("a1", 1000)];
    const incoming = [mkAddendum("a2", 2000)];
    const localCopy = [...local];
    const incomingCopy = [...incoming];
    unionAddenda(local, incoming);
    expect(local).toEqual(localCopy);
    expect(incoming).toEqual(incomingCopy);
  });
});

// ─── mergePure with addenda ──────────────────────────────────────────────────

describe("mergePure - addenda union", () => {
  it("preserves addenda from the LWW loser when incoming wins parent", () => {
    // Device A: entry updated at t=1000, has addendum a1 added at t=500
    // Device B: incoming entry updated at t=2000, has addendum a2 added at t=1500
    // Incoming wins LWW on parent (2000 > 1000). a1 must survive.
    const localE = mkEntry("e1", "p1", 1000, {
      addenda: [mkAddendum("a1", 500)],
    });
    const incomingE = mkEntry("e1", "p1", 2000, {
      narrative: "updated narrative",
      addenda: [mkAddendum("a2", 1500)],
    });
    const { entries, report } = mergePure(
      [], [localE], mkBundle([incomingE]),
    );

    expect(entries).toHaveLength(1);
    const merged = entries[0];
    // Parent narrative LWW: incoming won
    expect(merged.narrative).toBe("updated narrative");
    // Addenda: union, sorted by signedAt
    expect(merged.addenda).toHaveLength(2);
    expect(merged.addenda?.map((a) => a.id)).toEqual(["a1", "a2"]);
    // Conflict report still flags the parent-level LWW
    expect(report.conflicts).toHaveLength(1);
    expect(report.conflicts[0].winner).toBe("incoming");
    expect(report.updated).toBe(1);
  });

  it("preserves incoming-only addenda when local wins parent LWW", () => {
    // Device A: entry t=2000, no addenda. Just edited narrative.
    // Device B (incoming): entry t=1000 (older), but with addendum a1.
    // Local wins parent (2000 > 1000), but a1 should be appended.
    const localE = mkEntry("e1", "p1", 2000, {
      narrative: "local narrative",
    });
    const incomingE = mkEntry("e1", "p1", 1000, {
      narrative: "incoming narrative",
      addenda: [mkAddendum("a1", 500)],
    });
    const { entries, report } = mergePure(
      [], [localE], mkBundle([incomingE]),
    );

    const merged = entries[0];
    // Parent fields: local won
    expect(merged.narrative).toBe("local narrative");
    // Addendum from incoming was preserved
    expect(merged.addenda).toHaveLength(1);
    expect(merged.addenda?.[0].id).toBe("a1");
    // Conflict log shows local as the parent winner
    expect(report.conflicts).toHaveLength(1);
    expect(report.conflicts[0].winner).toBe("local");
    // updated++ because we wrote local with the new addenda
    expect(report.updated).toBe(1);
  });

  it("handles divergent addenda from both sides (the real-world case)", () => {
    // Device A: entry at t=100. Adds addendum a1 at t=200, bumping entry to t=200.
    // Device B (incoming): has the t=100 version, adds addendum a2 at t=300,
    //   bumping its entry to t=300.
    // Without union: incoming wins LWW (300>200) and a1 is silently lost.
    // With union: both addenda preserved, incoming's parent fields win.
    const localE = mkEntry("e1", "p1", 200, {
      addenda: [mkAddendum("a1", 200, "added on A")],
    });
    const incomingE = mkEntry("e1", "p1", 300, {
      addenda: [mkAddendum("a2", 300, "added on B")],
    });
    const { entries } = mergePure([], [localE], mkBundle([incomingE]));

    const merged = entries[0];
    expect(merged.addenda).toHaveLength(2);
    expect(merged.addenda?.map((a) => a.text)).toEqual(["added on A", "added on B"]);
  });

  it("treats equal-updatedAt entries with divergent addenda as updates, not unchanged", () => {
    // Both sides have entry at exactly t=1000, but A has a1 and B has a2.
    // Could happen with manual import of an older bundle that was somehow
    // edited in parallel. We silently merge - no conflict logged - and
    // count it as updated because we did write the merged entry.
    const localE = mkEntry("e1", "p1", 1000, {
      addenda: [mkAddendum("a1", 500)],
    });
    const incomingE = mkEntry("e1", "p1", 1000, {
      addenda: [mkAddendum("a2", 600)],
    });
    const { entries, report } = mergePure(
      [], [localE], mkBundle([incomingE]),
    );

    expect(entries[0].addenda).toHaveLength(2);
    expect(report.conflicts).toHaveLength(0);
    expect(report.updated).toBe(1);
  });

  it("brand-new entry from incoming carries its addenda intact", () => {
    const incomingE = mkEntry("e1", "p1", 1000, {
      addenda: [mkAddendum("a1", 500), mkAddendum("a2", 800)],
    });
    const { entries, report } = mergePure(
      [mkPatient("p1")], [], mkBundle([incomingE]),
    );

    expect(entries).toHaveLength(1);
    expect(entries[0].addenda).toHaveLength(2);
    expect(report.added).toBe(1);
  });

  it("entries without addenda field still round-trip correctly", () => {
    // Backward-compat: pre-v2 entries have no `addenda` field. Merging them
    // shouldn't add an empty `addenda: []` or change anything.
    const localE = mkEntry("e1", "p1", 1000);
    const incomingE = mkEntry("e1", "p1", 1000);
    const { entries, report } = mergePure(
      [], [localE], mkBundle([incomingE]),
    );
    expect(entries[0].addenda).toBeUndefined();
    expect(report.unchanged).toBe(1);
  });
});
