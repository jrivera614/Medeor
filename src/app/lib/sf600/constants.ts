// SF 600 - constants
//
// Centralized magic numbers so a future medic doesn't have to grep across the
// PDF, EntryForm, and EntryList to figure out why some range looks wrong.
// Every number gets a citation or a stated rationale - if you change one,
// update the comment too.

// ─── Vital sign physiologic ranges ────────────────────────────────────────────
//
// Ranges are "plausible adult" - tight enough to flag a likely typo (RR 600
// instead of 60) without flagging a genuinely critical patient. These are
// VALIDATION ranges, not normal ranges. A hypotensive trauma patient may
// legitimately have SBP 60. A peri-arrest patient may legitimately have HR 30.
// We accept those values, we don't accept HR 6000.
//
// Bounds chosen to match Tactical Combat Casualty Care MARCH-PAWS vitals
// documentation conventions (CoTCCC TCCC Handbook, current edition) and
// PALS / ACLS extreme bounds. Pediatric medics should note temp lower bound
// is intentionally permissive for hypothermia rewarming scenarios.
//
// If you are training a 68W on this app and they are complaining the form
// rejects their vitals, it is almost certainly a unit error (F vs C for temp,
// kPa vs mmHg for BP) not a range problem.
export const VITALS_RANGES = {
  hr:   { min: 20,  max: 250, label: "HR" },     // bradycardia floor to extreme tachy
  sbp:  { min: 40,  max: 300, label: "SBP" },    // shock floor to hypertensive crisis ceiling
  dbp:  { min: 20,  max: 200, label: "DBP" },    // shock floor to crisis ceiling
  rr:   { min: 4,   max: 60,  label: "RR" },     // agonal floor to severe distress ceiling
  spo2: { min: 0,   max: 100, label: "SpO2" },   // physical bounds of percentage
  temp: { min: 85,  max: 110, label: "Temp" },   // Fahrenheit; severe hypothermia to severe hyperthermia
  pain: { min: 0,   max: 10,  label: "Pain" },   // 0-10 NRS, Joint Commission standard
} as const;

export type VitalKey = keyof typeof VITALS_RANGES;

// ─── Autosave timing ──────────────────────────────────────────────────────────
//
// 600ms picked to match the existing PFC casualty card pattern. Long enough
// that a fast typist's keystrokes don't each fire an IndexedDB write, short
// enough that a medic backgrounding the app or losing power doesn't lose more
// than the last few words of a narrative.
export const AUTOSAVE_DEBOUNCE_MS = 600;

// ─── Storage health thresholds ────────────────────────────────────────────────
//
// StorageManager.estimate() returns bytes for usage and quota. We warn at
// 80% used and hard-warn at 95%. Numbers are conservative for a 6-day austere
// deployment where sysadmin help is not available - if a tablet hits 95% mid-
// mission a medic needs to know NOW so they can export and clear, not after
// the next IndexedDB write throws QuotaExceededError.
export const STORAGE_WARN_RATIO = 0.80;
export const STORAGE_CRITICAL_RATIO = 0.95;

// ─── PDF dimensions ───────────────────────────────────────────────────────────
//
// US Letter at 72 DPI, which is the pdf-lib default unit. SF 600 is a US gov
// form so US Letter is correct - do not switch to A4 even if the medic is
// downrange. A document review chain on the receiving end will reject A4.
//
// Margin of 36pt = 0.5 inch. Slightly tighter than the official SF 600 paper
// form because we need room for a longer signature column to accommodate
// typed-name signatures rather than handwritten ones.
export const PDF_DIMS = {
  pageWidth: 612,        // 8.5" * 72
  pageHeight: 792,       // 11" * 72
  margin: 36,            // 0.5"

  // Entry table column widths
  dateColWidth: 80,
  signColWidth: 110,

  // Typography sizes (points)
  bodyFontSize: 9,
  bodyLineHeight: 11,
  signFontSize: 8,
  signLineHeight: 10,
  headerFontSize: 11,

  // Padding inside cells
  cellPadX: 4,
  cellPadY: 8,

  // Minimum entry block height even for single-line entries, so the table
  // doesn't look like a Slack thread when entries are sparse.
  minEntryHeight: 32,
} as const;

// ─── Storage keys ─────────────────────────────────────────────────────────────

export const PROVIDER_LOCALSTORAGE_KEY = "medeor:sf600:provider";
export const DEXIE_DB_NAME = "medeor_sf600";
