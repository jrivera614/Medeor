// SF 600 - vitals helpers
//
// hasVitals and vitalsSummary used to be triplicated across EntryList,
// EntryForm, and PDF export. Single source of truth lives here.
//
// Both functions take a partial Entry-shape so they can be called from
// in-flight form state (where some fields are still primitives) as well as
// from persisted Entry records.

import type { Entry } from "./types";
import { VITALS_RANGES, type VitalKey } from "./constants";

// Subset of Entry containing only vital fields. Lets these helpers accept
// either a full Entry or a draft form-state object without forcing callers
// to fill in patientId/signedBy/etc. just to get a vitals string.
export type VitalsInput = Partial<Pick<Entry, VitalKey>>;

// hasVitals: does this entry have any vital sign recorded?
// Treats empty string as missing. Treats whitespace-only as missing.
export function hasVitals(e: VitalsInput): boolean {
  return Boolean(
    (e.hr && e.hr.trim()) ||
    (e.sbp && e.sbp.trim()) ||
    (e.dbp && e.dbp.trim()) ||
    (e.rr && e.rr.trim()) ||
    (e.spo2 && e.spo2.trim()) ||
    (e.temp && e.temp.trim()) ||
    (e.pain && e.pain.trim())
  );
}

// vitalsSummary: one-line dot-separated summary, e.g.
//   "HR 88 . BP 120/78 . RR 16 . SpO2 98% . T 98.6 . Pain 3/10"
// Only includes fields that are present. BP shows "-/dbp" or "sbp/-" if only
// one half is recorded so the medic can see the gap.
export function vitalsSummary(e: VitalsInput): string {
  const parts: string[] = [];
  if (e.hr) parts.push(`HR ${e.hr}`);
  if (e.sbp || e.dbp) parts.push(`BP ${e.sbp || "-"}/${e.dbp || "-"}`);
  if (e.rr) parts.push(`RR ${e.rr}`);
  if (e.spo2) parts.push(`SpO2 ${e.spo2}%`);
  if (e.temp) parts.push(`T ${e.temp}`);
  if (e.pain) parts.push(`Pain ${e.pain}/10`);
  return parts.join(" \u00b7 "); // middle dot
}

// isVitalInRange: pure function used by NumField wrappers and tests.
// Returns true for empty strings (not entered yet, don't warn) so the caller
// doesn't have to check separately.
export function isVitalInRange(key: VitalKey, value: string): boolean {
  if (!value) return true;
  const n = Number(value);
  if (isNaN(n)) return false;
  const range = VITALS_RANGES[key];
  return n >= range.min && n <= range.max;
}
