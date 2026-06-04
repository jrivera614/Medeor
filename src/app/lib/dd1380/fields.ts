// DD Form 1380 (JUL 2025) - TCCC Card field model
//
// Medeor-styled guided template that mirrors the official DD 1380 TCCC Card
// field structure (MIST: Mechanism, Injuries, Signs & symptoms, Treatments).
// NOT a clone of the government form image. Field order follows the card so a
// completed report transcribes cleanly to the real form.
//
// The real card is CUI/PRVCY when filled in. This tool stores data locally on
// the device only and never transmits it.

export type DdFieldKind = "text" | "textarea" | "date" | "time" | "select" | "multiselect";

export interface DdField {
  id: string;
  label: string;
  kind: DdFieldKind;
  options?: string[];
  placeholder?: string;
  hint?: string;
}

export interface DdSection {
  id: string;
  title: string;
  color: string;
  note?: string;
  fields: DdField[];
}

export const MECHANISM_OPTS = [
  "Artillery", "Blunt", "Burn", "Fall", "Grenade", "GSW",
  "IED", "Landmine", "MVC", "RPG", "Other",
];

export const DD1380_SECTIONS: DdSection[] = [
  {
    id: "id",
    title: "Casualty ID & EVAC",
    color: "#ef4444",
    note: "Battle Roster # = casualty first + last initials, then last 4 of SSN. Example: John Doe 123-45-1234 = JD1234. EVAC priority is set by medical personnel.",
    fields: [
      { id: "battleRoster", label: "Battle Roster #", kind: "text", placeholder: "e.g. JD1234" },
      { id: "evac", label: "EVAC priority", kind: "select", options: ["Urgent (<1 hr)", "Priority (<4 hr)", "Routine (<24 hr)"] },
      { id: "name", label: "Name (Last, First)", kind: "text", hint: "Required" },
      { id: "last4", label: "Last 4 (SSN)", kind: "text", placeholder: "XXXX" },
      { id: "sex", label: "Sex", kind: "select", options: ["M", "F"] },
      { id: "date", label: "Date of injury (DD-MMM-YY)", kind: "date" },
      { id: "time", label: "Time of injury", kind: "text", placeholder: "e.g. 1300L or 1300Z" },
      { id: "service", label: "Service", kind: "select", options: ["USA", "USAF", "USCG", "USN", "USMC", "US CIV", "NON US"] },
      { id: "unit", label: "Unit", kind: "text" },
      { id: "allergies", label: "Allergies", kind: "text", placeholder: "NKDA if none known" },
    ],
  },
  {
    id: "mechanism",
    title: "Mechanism of Injury",
    color: "#f59e0b",
    note: "Mark all that apply.",
    fields: [
      { id: "mechanism", label: "Mechanism (select all)", kind: "multiselect", options: MECHANISM_OPTS },
      { id: "mechanismOther", label: "Other (specify)", kind: "text" },
    ],
  },
  {
    id: "injury",
    title: "Injuries",
    color: "#8b5cf6",
    note: "On the real card, mark injury locations with an X on the body diagram. Describe them here in text.",
    fields: [
      { id: "injuries", label: "Injury locations & description", kind: "textarea", placeholder: "e.g. R thigh GSW, L forearm frag, facial burns" },
    ],
  },
  {
    id: "tq",
    title: "Tourniquets",
    color: "#dc2626",
    note: "Record type and time for each TQ applied. Leave blank if none.",
    fields: [
      { id: "tqRArm", label: "R Arm (type, time)", kind: "text", placeholder: "CAT, 1342L" },
      { id: "tqLArm", label: "L Arm (type, time)", kind: "text" },
      { id: "tqRLeg", label: "R Leg (type, time)", kind: "text" },
      { id: "tqLLeg", label: "L Leg (type, time)", kind: "text" },
    ],
  },
  {
    id: "vitals",
    title: "Signs & Symptoms",
    color: "#3b82f6",
    note: "Up to four timed sets. Format: Time | Pulse (rate & location) | BP | RR | SpO2 | AVPU | Pain (0-10).",
    fields: [
      { id: "vitals1", label: "Set 1", kind: "text", placeholder: "1342L 120 radial 90/p 24 92 V 7" },
      { id: "vitals2", label: "Set 2", kind: "text" },
      { id: "vitals3", label: "Set 3", kind: "text" },
      { id: "vitals4", label: "Set 4", kind: "text" },
    ],
  },
  {
    id: "treatments",
    title: "Treatments",
    color: "#10b981",
    note: "C-A-B order. Fill in what was done; leave the rest blank.",
    fields: [
      { id: "tCirc", label: "C - Circulation / hemorrhage control", kind: "textarea", placeholder: "TQ, wound packing, hemostatic, pressure dressing, pelvic binder" },
      { id: "tAirway", label: "A - Airway", kind: "textarea", placeholder: "NPA, SGA, cric, ETT, positioning" },
      { id: "tBreathing", label: "B - Breathing", kind: "textarea", placeholder: "Chest seal, NDC, chest tube, O2" },
      { id: "fluids", label: "Fluids (name, volume, route, time)", kind: "textarea", placeholder: "LTOWB 1u IV 1355L; LR 500mL" },
      { id: "tInterventions", label: "Other interventions", kind: "textarea", placeholder: "Hypothermia prevention, eye shield, splint, c-collar" },
    ],
  },
  {
    id: "meds",
    title: "Medications",
    color: "#ec4899",
    note: "Document all meds given: name, dose, route, time.",
    fields: [
      { id: "analgesia", label: "Analgesia / sedation", kind: "textarea", placeholder: "Ketamine 50mg IM 1350L; OTFC 800mcg" },
      { id: "antibiotic", label: "Antibiotic", kind: "text", placeholder: "Moxifloxacin 400mg PO 1352L" },
      { id: "otherMeds", label: "Other meds", kind: "textarea", placeholder: "TXA 2g IV 1356L" },
    ],
  },
  {
    id: "notes",
    title: "Notes & First Responder",
    color: "#888888",
    note: "Anything that did not fit above, plus who filled out the card.",
    fields: [
      { id: "notes", label: "Notes", kind: "textarea" },
      { id: "responderName", label: "First responder name", kind: "text" },
      { id: "responderRelation", label: "Relation to casualty (NM / M / OP)", kind: "select", options: ["M (Medic)", "NM (Non-medic)", "OP (Other provider)"] },
    ],
  },
];

export const DD1380_NOTE =
  "DD 1380 is CUI / PRVCY when filled in. This tool stores cards locally on this device only and does not transmit anything. Attach the completed card to the casualty and ensure it reaches the receiving MTF.";
