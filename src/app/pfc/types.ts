// PCC Casualty Card type definitions.
// Shapes mirror the existing runtime state exactly. Save format uses
// shortened keys (pt, mist, hx, tq, etc.) for localStorage compatibility;
// full names are used here for clarity.

export interface Patient {
  name: string;
  id: string;        // Battle Roster number
  date: string;
  time: string;
  tz: string;        // Time zone
  pfcStart: string;
  wtkg: string;
  wtlbs: string;
  ht: string;
  ibw: string;
  blood: string;
  titer: string;
  triage: string;
  evac: string;
  status: string;    // "Stable" | "Unstable" | ""
}

export interface Mist {
  m: string;   // Mechanism
  i: string;   // Injuries
  s: string;   // Signs/Symptoms
  t: string;   // Treatment
  time: string;
  to: string;
}

export interface History {
  allergies: string;
  meds: string;
  past: string;
  oral: string;
  events: string;
}

export interface Tourniquets {
  t1on: string;
  t1c: string;
  t2on: string;
  t2c: string;
  t3on: string;
  t3c: string;
  t4on: string;
  t4c: string;
  txa: string;
  ca: string;
}

export interface Medication {
  drug: string;
  dose: string;
  route: string;
  time: string;
}

export interface VitalSet {
  time: string;
  hr: string;
  sbp: string;
  dbp: string;
  rr: string;
  spo2: string;
  etco2: string;
  temp: string;
  eye: string;
  verbal: string;
  motor: string;
  avpu: string;
  mace: string;
  pain: string;
  rass: string;
  fluidIn: string;
  urineOut: string;
  notes: string;
  // v1 legacy field. Present on unmigrated cards, removed when the v1->v2
  // migration in PfcClient runs on load. Do not reference in new code.
  bp?: string;
}

export interface CarePlan {
  problems: string;
  plans: string;
  goals: string;
  concerns: string;
  notes: string;
}

// Dynamic keyed maps
export type LabResults = Record<string, string>;
export type BurnStates = Record<string, boolean>;
export type BurnDepths = Record<string, string>;
export type TreatmentChecks = Record<string, boolean>;
export type TreatmentTimes = Record<string, string>;
export type PriorityStates = Record<string, boolean>;
export type VentState = Record<string, string>;

// localStorage save shape - uses shortened keys for backward compatibility
export interface PfcSavedState {
  v?: number;
  tab?: number;
  pt?: Partial<Patient>;
  mist?: Mist;
  hx?: History;
  tq?: Tourniquets;
  meds?: Medication[];
  labR?: LabResults;
  burns?: BurnStates;
  burnD?: BurnDepths;
  checks?: TreatmentChecks;
  checkT?: TreatmentTimes;
  prio?: PriorityStates;
  vitals?: VitalSet[];
  vent?: VentState;
  ppgc?: Partial<CarePlan>;
}

// Constants structural types
export interface LabDef {
  n: string;  // name
  r: string;  // reference range
}

export interface BurnRegion {
  id: string;
  label: string;
  pct: number;
}

export interface NurseItem {
  cat: string;
  detail: string;
}

export type GcsOption = [string, string];  // [score, label]
