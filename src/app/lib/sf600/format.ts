// SF 600 - formatting helpers
//
// Centralized so EntryList, EntryForm, and PDF export all render dates the
// same way. The PDF needs DTG-style military format ("25 APR 2026 1342"); the
// list view needs locale-aware short format. Both live here.

// nowLocalISO: returns "YYYY-MM-DDTHH:MM" in the user's local time zone, no
// offset suffix. Suitable for <input type="datetime-local"> default values.
// We deliberately do NOT use toISOString() because that would shift to UTC.
export function nowLocalISO(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

// fmtDate: locale-aware short representation for the entry list.
// Falls back to the raw ISO string if parsing fails so we never display a
// confusing "Invalid Date".
export function fmtDate(iso: string | undefined | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

// fmtDateMil: military DTG format used in the PDF export.
// "25 APR 2026 1342" for full datetime, "25 APR 2026" for date-only inputs.
const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

export function fmtDateMil(iso: string | undefined | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, "0");
  const mon = MONTH_ABBR[d.getMonth()];
  const dateStr = `${p(d.getDate())} ${mon} ${d.getFullYear()}`;
  if (!iso.includes("T")) return dateStr;
  return `${dateStr} ${p(d.getHours())}${p(d.getMinutes())}`;
}

// uuid: prefer crypto.randomUUID where available, fall back to a v4-ish
// generator for older browsers / tests where crypto is mocked.
export function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
