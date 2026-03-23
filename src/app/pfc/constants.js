// PFC Casualty Card Constants
// Based on PFC CC v25 (8July2023) from prolongedfieldcare.org

export const SAVE_KEY = "medeor_pfc_card";

export const TABS = ["Info","MIST","Hx","Intv","Labs","Burns","Tx","Vitals","Vent","Nursing","PPGC"];

export const TX_ITEMS = [
  "Send MIST Report",
  "Stop Massive Bleeding",
  "Pelvic/Feet Binder",
  "Convert TQ <4hrs",
  "Open Airway",
  "Upgrade/Secure Airway",
  "Awake/Post-Cric Checklist",
  "BVM or Vent w/ PEEP",
  "Needle-D / Finger-T / Thoracostomy",
  "Initiate Blood Transfusion",
  "TXA 2g Slow Push (<3 hrs)",
  "Calcium",
  "2nd IV/IO",
  "Pressors for Distributive Shock?",
  "Peripheral Pulses",
  "Hypothermia Tx/Prevention",
  "Analgesia Management",
  "Procedural Sedation",
  "Antibiotics/War Wound Tx",
  "Irrigate/Debride/Dress",
  "Tetanus Status",
  "Reduce/Pad/Splint Fx",
  "Position/Pad Patient",
  "DVT Prophylaxis",
  "Foley/Bladder Tap",
  "UA Dipstick",
  "Labs (if available)",
  "Fasciotomy",
  "Confirm TBSA & Burn Fluids",
  "Escharotomy",
  "Teleconsult Prep & Call",
  "Expose Patient",
  "Reassess All Treatments",
  "US: EFAST/RUSH/ONDS",
  "Detailed Exam",
  "Attach Monitors",
  "GCS/Neuro/MACE",
  "NG/OG Tube",
  "Adjust Vent (ABG?)",
  "X-Ray/Imaging",
  "PreOp Eval",
  "Amputation",
  "Shunt",
  "Preperitoneal Pelvic Packing",
  "Clear C-Spine",
];

export const PRIORITIES = [
  "Complete initial life saving TCCC",
  "Initiate palliative care for expectants",
  "Delineate roles and responsibilities",
  "Perform comprehensive exam and history",
  "Make problem list",
  "Chart and trend vital signs",
  "Perform telemedical consult",
  "Create a nursing care plan",
  "Plan for resupply and electrical issues",
  "Perform tactical timeout/mini rounds",
  "Implement wake/rest/chow plan",
  "Obtain and interpret lab studies",
  "Make detailed analgesia & sedation plan",
  "Perform necessary surgical procedures",
  "Prepare handover documentation & supply",
  "Prepare team for evac care",
  "Submit medical AAR to JTS",
  "Submit operational AAR to Command",
  "Send lessons to prolongedfieldcare.org",
];

export const LABS = [
  { n: "pH", r: "7.32-.41" },
  { n: "pCO2", r: "42-53" },
  { n: "pO2", r: "35-42" },
  { n: "HCO3", r: "24-28" },
  { n: "SO2%", r: "70-75" },
  { n: "Base D/E", r: "-2 to 2" },
  { n: "Na+", r: "136-145" },
  { n: "K+", r: "3.5-5.0" },
  { n: "Ca++", r: "8.6-10.2" },
  { n: "Cl-", r: "98-106" },
  { n: "BUN", r: "8-20" },
  { n: "Creat", r: "M:.7-1.3/F:.5-1.1" },
  { n: "Gluc", r: "70-99" },
  { n: "WBC", r: "3200-9800" },
  { n: "PLT", r: "150-450" },
  { n: "HCT%", r: "M:42-50/F:37-47" },
  { n: "Hgb", r: "M:14-18/F:12-16" },
  { n: "Agap", r: "7-13" },
  { n: "PT/INR", r: "11-13/0.8-1.2" },
  { n: "Lact", r: "0.4-2.3" },
];

export const VENT_FIELDS = [
  "Mode", "Flow Rate", "Tidal Volume", "Vent Rate",
  "FiO2%", "PEEP", "Pplat", "Drive P", "PIP", "I:E Ratio"
];

export const NURSE_ITEMS = [
  { cat: "GCS", detail: "Eye(4) + Verbal(5) + Motor(6) = 15" },
  { cat: "HEENT", detail: "Suction / Clean / Moisten | Eye / Nose / Mouth / Ears" },
  { cat: "Respiratory", detail: "Look / Listen / Feel | BVM / Vent / O2" },
  { cat: "Integumentary", detail: "Look / Touch / Smell | Position / Pad / Massage | Clean / Dry / Dress" },
  { cat: "GI", detail: "Look / Listen / Touch / Tap | Nausea / PPI / Nutrition" },
  { cat: "Pain/Sedation", detail: "Maintenance & Procedural Bumps | Drips (Pain or TIVA)" },
  { cat: "I/O", detail: "IV / IO / NGT / OGT / Foley / Stool" },
  { cat: "Extra", detail: "Battery / Power | Stock / Resupply" },
];

export const BURN_REGIONS = [
  { id: "head", label: "Head", pct: 7 },
  { id: "neck", label: "Neck", pct: 2 },
  { id: "chest", label: "Anterior Trunk", pct: 13 },
  { id: "back", label: "Posterior Trunk", pct: 13 },
  { id: "buttL", label: "Buttock (L)", pct: 2.5 },
  { id: "buttR", label: "Buttock (R)", pct: 2.5 },
  { id: "genital", label: "Genitalia", pct: 1 },
  { id: "uArmL", label: "Upper Arm (L)", pct: 4 },
  { id: "uArmR", label: "Upper Arm (R)", pct: 4 },
  { id: "lArmL", label: "Lower Arm (L)", pct: 3 },
  { id: "lArmR", label: "Lower Arm (R)", pct: 3 },
  { id: "handL", label: "Hand (L)", pct: 2.5 },
  { id: "handR", label: "Hand (R)", pct: 2.5 },
  { id: "thighL", label: "Thigh (L)", pct: 9.5 },
  { id: "thighR", label: "Thigh (R)", pct: 9.5 },
  { id: "legL", label: "Lower Leg (L)", pct: 7 },
  { id: "legR", label: "Lower Leg (R)", pct: 7 },
  { id: "footL", label: "Foot (L)", pct: 3.5 },
  { id: "footR", label: "Foot (R)", pct: 3.5 },
];

export const EYE_OPTS = [["4", "Spontaneous"], ["3", "To voice"], ["2", "To pain"], ["1", "None"]];
export const VERBAL_OPTS = [["5", "Oriented"], ["4", "Confused"], ["3", "Inappropriate"], ["2", "Incomprehensible"], ["1", "None"]];
export const MOTOR_OPTS = [["6", "Obeys"], ["5", "Localizes"], ["4", "Withdrawal"], ["3", "Flexion"], ["2", "Extension"], ["1", "None"]];
export const AVPU_OPTS = ["Alert", "Voice", "Pain", "Unresponsive"];

// Computed helpers
export const calcGCS = (v) => {
  const e = parseInt(v.eye) || 0;
  const vb = parseInt(v.verbal) || 0;
  const m = parseInt(v.motor) || 0;
  return e + vb + m;
};

export const calcMAP = (v) => {
  const s = parseInt(v.sbp);
  const d = parseInt(v.dbp);
  return (s && d) ? Math.round(d + (s - d) / 3) : null;
};

export const calcSI = (v) => {
  const h = parseInt(v.hr);
  const s = parseInt(v.sbp);
  return (h && s) ? (h / s).toFixed(2) : null;
};

export const newVitalSet = () => ({
  time: new Date().toTimeString().slice(0, 5),
  hr: "", sbp: "", dbp: "", rr: "", spo2: "", etco2: "", temp: "",
  eye: "", verbal: "", motor: "", avpu: "", mace: "",
  pain: "", rass: "", fluidIn: "", urineOut: "", notes: ""
});

export const newMed = () => ({
  drug: "", dose: "", route: "",
  time: new Date().toTimeString().slice(0, 5)
});

export const defaultPatient = () => ({
  name: "", id: "",
  date: new Date().toISOString().split("T")[0],
  time: new Date().toTimeString().slice(0, 5),
  tz: "", pfcStart: "", wtkg: "", wtlbs: "", ht: "", ibw: "",
  blood: "", titer: "", triage: "", evac: "", status: ""
});
