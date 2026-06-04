// DD 1380 TCCC Card - storage types and Dexie database
//
// Offline-first, one database per medic device. A DdCard is a key/value map
// of field id -> value (string, or string[] for multiselect fields like
// mechanism of injury) plus metadata. Mirrors the AAR storage approach.

import Dexie, { type Table } from "dexie";

export type DdValue = string | string[];

export interface DdCard {
  id: string;
  title: string;
  values: Record<string, DdValue>;
  createdAt: number;
  updatedAt: number;
}

const DD1380_DB_NAME = "medeor_dd1380";

class Dd1380Database extends Dexie {
  cards!: Table<DdCard, string>;

  constructor() {
    super(DD1380_DB_NAME);
    // ─── version 1: initial schema ───
    this.version(1).stores({
      cards: "id, title, updatedAt",
    });
  }
}

let _db: Dd1380Database | null = null;

export function getDd1380Db(): Dd1380Database {
  if (typeof indexedDB === "undefined") {
    throw new Error("DD 1380 database requires IndexedDB (browser or test shim).");
  }
  if (!_db) _db = new Dd1380Database();
  return _db;
}

export async function loadCards(): Promise<DdCard[]> {
  const db = getDd1380Db();
  return db.cards.orderBy("updatedAt").reverse().toArray();
}

export async function saveCard(c: DdCard): Promise<void> {
  const db = getDd1380Db();
  await db.cards.put(c);
}

export async function deleteCard(id: string): Promise<void> {
  const db = getDd1380Db();
  await db.cards.delete(id);
}

export function deriveCardTitle(values: Record<string, DdValue>, createdAt: number): string {
  const br = typeof values.battleRoster === "string" ? values.battleRoster.trim() : "";
  const name = typeof values.name === "string" ? values.name.trim() : "";
  if (br && name) return `${br} - ${name}`;
  if (name) return name;
  if (br) return br;
  return `Card ${new Date(createdAt).toISOString().slice(0, 10)}`;
}

export function newCardId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `dd_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
