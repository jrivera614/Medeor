// JTS TCCC After-Action Report - field model
//
// Structured to mirror the official Joint Trauma System TCCC AAR (POI_TCCC_AAR)
// submitted to JTS within 72 hours of a mission. This is a Medeor-styled
// guided template, NOT a clone of the government form image. Field names and
// section order follow the JTS form so a completed report maps cleanly when
// transcribed or submitted.
//
// Submission target (informational, shown in the app footer):
//   dha.jbsa.healthcare-ops.list.jts-prehospital@health.mil
// AARs submitted to the DoDTR should include only content up to FOUO.

export type FieldKind = "text" | "textarea" | "date" | "time" | "select";

export interface AarField {
  id: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  placeholder?: string;
  hint?: string;
}

export interface AarSection {
  id: string;
  title: string;
  color: string;
  note?: string;
  fields: AarField[];
}

// Provider attribution used throughout the interventions section.
// M = Medic, NM = Non-medic first responder, OP = Other POI provider.
export const PROVIDER_OPTS = ["M", "NM", "OP", "N/A"];

export const AAR_SECTIONS: AarSection[] = [
  {
    id: "event",
    title: "Event & Mission",
    color: "#8b5cf6",
    note: "Complete within 72 hours of the mission. Use the actual name or assigned pseudo name and keep it consistent across all transfers of care.",
    fields: [
      { id: "missionNo", label: "Mission #", kind: "text", placeholder: "Mission identifier" },
      { id: "eventDate", label: "Event date", kind: "date" },
      { id: "eventTime", label: "Time (local)", kind: "time" },
      { id: "tz", label: "Time zone", kind: "select", options: ["Local", "ZULU"] },
      { id: "country", label: "Country / theater", kind: "text", placeholder: "Country, theater" },
      { id: "airborne", label: "Airborne operation", kind: "select", options: ["No", "Yes"] },
    ],
  },
  {
    id: "casualty",
    title: "Casualty Demographics",
    color: "#ef4444",
    note: "Minimum requirement: last name and last four of SSN/DoD ID.",
    fields: [
      { id: "lastName", label: "Last name", kind: "text", hint: "Required (or pseudo name)" },
      { id: "firstName", label: "First name", kind: "text" },
      { id: "last4", label: "SSN / DoD ID (last 4)", kind: "text", hint: "Required", placeholder: "XXXX" },
      { id: "dob", label: "DOB", kind: "date" },
      { id: "sex", label: "Sex", kind: "select", options: ["M", "F"] },
      { id: "rank", label: "Rank", kind: "text" },
      { id: "unit", label: "Unit", kind: "text" },
      { id: "brNo", label: "BR #", kind: "text", placeholder: "Battle roster number" },
      { id: "injuryClass", label: "Injury classification", kind: "select", options: ["Battle Injury (BI)", "Non-Battle Injury (NBI)"] },
      { id: "status", label: "Status", kind: "select", options: ["WIA", "KIA", "DOW", "Alive", "Dead"] },
    ],
  },
  {
    id: "providers",
    title: "POI Provider Info",
    color: "#06b6d4",
    note: "Identify who provided care at point of injury. M = Medic, NM = Non-medic first responder, OP = Other POI provider.",
    fields: [
      { id: "medicName", label: "Medic (M) name", kind: "text" },
      { id: "medicRank", label: "Medic rank / title", kind: "text" },
      { id: "nmName", label: "Non-medic (NM) name", kind: "text" },
      { id: "nmRank", label: "Non-medic rank / title", kind: "text" },
      { id: "opName", label: "Other provider (OP) name", kind: "text" },
      { id: "opRank", label: "Other provider rank / title", kind: "text" },
    ],
  },
  {
    id: "injuries",
    title: "Injuries & Mechanism",
    color: "#f59e0b",
    fields: [
      { id: "mechanism", label: "Mechanism of injury", kind: "select", options: ["GSW", "Blast / IED", "Frag", "MVC", "Fall", "Burn", "Crush", "Blunt", "Other"] },
      { id: "injuryList", label: "Injuries (list and annotate body region)", kind: "textarea", placeholder: "e.g. R thigh GSW with arterial bleed; L forearm frag; blast lung" },
    ],
  },
  {
    id: "march",
    title: "Interventions (MARCH)",
    color: "#10b981",
    note: "For each intervention performed, note who performed it (M / NM / OP) and the detail. Leave blank if not performed.",
    fields: [
      { id: "tq", label: "Tourniquet (type, limb, time)", kind: "textarea", placeholder: "CAT, R thigh, 1342L. Provider: M" },
      { id: "woundPack", label: "Wound packing / hemostatic", kind: "textarea", placeholder: "Combat Gauze, R thigh. Provider: M" },
      { id: "pressure", label: "Pressure dressing", kind: "textarea" },
      { id: "airway", label: "Airway (NPA, SGA, cric, ETT)", kind: "textarea", placeholder: "Type, outcome, provider" },
      { id: "respiration", label: "Respiration (seal, NDC, chest tube, O2)", kind: "textarea", placeholder: "Vented chest seal x2; NDC R 2nd ICS. Provider: M" },
      { id: "ivio", label: "IV / IO access", kind: "textarea", placeholder: "Site, gauge, provider" },
      { id: "fluids", label: "Fluids / blood (type, volume, time)", kind: "textarea", placeholder: "LTOWB 1 unit 1355L; TXA 2g. Provider: M" },
      { id: "txa", label: "TXA (dose, time)", kind: "text" },
      { id: "hypothermia", label: "Hypothermia prevention", kind: "text", placeholder: "Type, outcome" },
      { id: "adjuncts", label: "Other adjuncts (pelvic binder, eye shield, c-collar, splint)", kind: "textarea" },
    ],
  },
  {
    id: "vitals",
    title: "Vital Signs",
    color: "#3b82f6",
    note: "Record up to four sets of vitals, earliest first. Include AVPU mental status and pain scale.",
    fields: [
      { id: "vitals1", label: "Set 1 (time, HR, BP, RR, SpO2, AVPU, pain)", kind: "text", placeholder: "1342L 120 90/p 24 92 V 7/10" },
      { id: "vitals2", label: "Set 2", kind: "text" },
      { id: "vitals3", label: "Set 3", kind: "text" },
      { id: "vitals4", label: "Set 4", kind: "text" },
    ],
  },
  {
    id: "meds",
    title: "Medications",
    color: "#ec4899",
    fields: [
      { id: "analgesia", label: "Analgesia (drug, dose, route, time)", kind: "textarea", placeholder: "Ketamine 50mg IM 1350L; OTFC 800mcg" },
      { id: "antibiotics", label: "Antibiotics", kind: "text", placeholder: "Moxifloxacin 400mg PO 1352L" },
      { id: "otherMeds", label: "Other medications", kind: "textarea" },
    ],
  },
  {
    id: "evac",
    title: "Evacuation",
    color: "#6366f1",
    fields: [
      { id: "evacCat", label: "Evacuation category", kind: "select", options: ["Urgent (URG)", "Priority (PRI)", "Routine (ROU)"] },
      { id: "evacPlatform", label: "Platform", kind: "select", options: ["Litter", "Ground vehicle", "Aircraft", "Watercraft"] },
      { id: "evacType", label: "Platform type", kind: "text", placeholder: "e.g. UH-60, MRAP" },
      { id: "pickupTime", label: "Time of pickup", kind: "text" },
      { id: "destination", label: "Destination (Role)", kind: "text", placeholder: "e.g. Role 2 FRSS" },
    ],
  },
  {
    id: "pi",
    title: "Performance Improvement",
    color: "#06b6d4",
    note: "The learning half of the AAR. Honest assessment drives better casualty care, this is the part JTS uses to update CPGs.",
    fields: [
      { id: "wentWell", label: "What went well", kind: "textarea", placeholder: "Sustains" },
      { id: "improve", label: "What to improve", kind: "textarea", placeholder: "Improves" },
      { id: "equipGaps", label: "Equipment / supply gaps", kind: "textarea" },
      { id: "trainingGaps", label: "Training gaps identified", kind: "textarea" },
      { id: "recommendations", label: "Recommendations / changes to implement", kind: "textarea" },
    ],
  },
  {
    id: "author",
    title: "Report Author",
    color: "#888888",
    fields: [
      { id: "authorName", label: "Author name", kind: "text" },
      { id: "authorRole", label: "Role / title", kind: "text" },
      { id: "reportDate", label: "Report date", kind: "date" },
    ],
  },
];

export const AAR_SUBMIT_NOTE =
  "Official JTS TCCC AARs are submitted within 72 hours to dha.jbsa.healthcare-ops.list.jts-prehospital@health.mil. Submit only content up to FOUO. This tool is an offline drafting aid; it does not transmit anything.";
