// PCC nursing care checklists for the /pcc/nursing page.
// Organized by cadence (q1h / q4h / q8h / prn) the way a medic running a
// prolonged casualty actually structures the work. Aligned with the JTS PCC
// nursing guidance and the HITMAN / SHEEP-VOMIT frameworks already in the app.

export interface NursingGroup {
  id: string;
  title: string;
  cadence: string;
  color: string;
  items: string[];
}

export const NURSING_GROUPS: NursingGroup[] = [
  {
    id: "q1h",
    title: "Hourly",
    cadence: "q1h",
    color: "#ef4444",
    items: [
      "Vitals: HR, BP, RR, SpO2, temp (and EtCO2 if advanced airway)",
      "Mental status / GCS trend",
      "Urine output recorded (goal >0.5 mL/kg/hr adult)",
      "Pain score and sedation depth assessed",
      "Bleeding / dressing check on active wounds",
      "IV / IO site patency and flow confirmed",
      "Airway: tube depth, secured, waveform present if intubated",
    ],
  },
  {
    id: "q2h",
    title: "Every 2 hours",
    cadence: "q2h",
    color: "#f59e0b",
    items: [
      "Reposition to offload pressure points",
      "Passive range of motion to all extremities",
      "Heels, sacrum, occiput, elbows inspected and padded",
      "Head of bed at 30 degrees confirmed",
      "Reassess distal pulses on injured / splinted limbs",
    ],
  },
  {
    id: "q4h",
    title: "Every 4 hours",
    cadence: "q4h",
    color: "#06b6d4",
    items: [
      "Full head-to-toe reassessment",
      "Cuff pressure check (ETT / cric / trach), 20-30 cmH2O",
      "Lung sounds, bilateral and clear",
      "Bowel sounds / abdominal distension check",
      "NG/OG external length mark verified if present",
      "Intake and output tallied, running balance updated",
      "Temperature management: actively warming or cooling as needed",
    ],
  },
  {
    id: "q8h",
    title: "Every 8 / shift",
    cadence: "q8-12h",
    color: "#8b5cf6",
    items: [
      "Wound cleaned / irrigated, dressing changed per plan",
      "IV/IO site rotated if due (IO 24h, PIV 72-96h)",
      "Foley meatal care and securement check",
      "Stoma / line site care (cric, chest tube)",
      "Oral hygiene performed",
      "Eye care (lubrication, lids closed if sedated)",
      "DVT prophylaxis: ROM, compression, ambulate if able",
      "Skin survey for breakdown documented",
      "DD 1380 / SF 600 updated, supplies inventoried",
      "Handoff brief prepared for relief",
    ],
  },
  {
    id: "prn",
    title: "As needed",
    cadence: "prn",
    color: "#10b981",
    items: [
      "Suction airway when secretions audible or SpO2 falling",
      "Bolus analgesia / sedation per protocol for breakthrough",
      "Antiemetic for nausea before it compromises the airway",
      "Recheck after every casualty movement or transport",
      "Re-secure all tubes and lines after any reposition",
      "Escalate to telemedicine for any unexplained deterioration",
    ],
  },
];

export const NURSING_NOTE =
  "Cadence is a floor, not a ceiling. A deteriorating casualty gets reassessed continuously. Document every task with a time on the SF 600 flow sheet so the next provider can trend it.";
