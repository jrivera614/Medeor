// JTS TCCC AAR - storage types and Dexie database
//
// Offline-first, one database per medic device. An AarReport is a flat
// key/value map of field id -> string value, plus metadata. Keeping values
// as a string map (rather than a rigid typed record) means adding or
// reordering fields in fields.ts never requires a schema migration here.

import Dexie, { type Table } from "dexie";

export interface AarReport {
  id: string;
  // Display label for the report list. Derived from casualty last name +
  // mission # at save time, falls back to the created date.
  title: string;
  values: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

const AAR_DB_NAME = "medeor_aar";

class AarDatabase extends Dexie {
  reports!: Table<AarReport, string>;

  constructor() {
    super(AAR_DB_NAME);
    // ─── version 1: initial schema ───
    this.version(1).stores({
      reports: "id, title, updatedAt",
    });
  }
}

let _db: AarDatabase | null = null;

export function getAarDb(): AarDatabase {
  if (typeof indexedDB === "undefined") {
    throw new Error("AAR database requires IndexedDB (browser or test shim).");
  }
  if (!_db) _db = new AarDatabase();
  return _db;
}

export async function loadReports(): Promise<AarReport[]> {
  const db = getAarDb();
  return db.reports.orderBy("updatedAt").reverse().toArray();
}

export async function saveReport(r: AarReport): Promise<void> {
  const db = getAarDb();
  await db.reports.put(r);
}

export async function deleteReport(id: string): Promise<void> {
  const db = getAarDb();
  await db.reports.delete(id);
}

// Build a human label for the report list from its values.
export function deriveTitle(values: Record<string, string>, createdAt: number): string {
  const name = (values.lastName || "").trim();
  const mission = (values.missionNo || "").trim();
  if (name && mission) return `${name} - ${mission}`;
  if (name) return name;
  if (mission) return `Mission ${mission}`;
  return `AAR ${new Date(createdAt).toISOString().slice(0, 10)}`;
}

export function newReportId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `aar_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
