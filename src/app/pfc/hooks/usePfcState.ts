"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  SAVE_KEY, LABS, BURN_REGIONS, TX_ITEMS, PRIORITIES, VENT_FIELDS,
} from "../constants";
import type {
  Patient, Mist, History, Tourniquets, Medication, VitalSet, CarePlan,
  LabResults, BurnStates, BurnDepths, TreatmentChecks, TreatmentTimes,
  PriorityStates, VentState,
} from "../types";

export const PFC_VERSION = 2;

// Helper: creates a (key, value) updater for a setState with an object value.
// Equivalent to the original `updateField` closure in PfcClient.
function updateField<T extends object>(setter: Dispatch<SetStateAction<T>>) {
  return <K extends keyof T>(key: K, value: T[K]) => {
    setter(prev => ({ ...prev, [key]: value }));
  };
}

function defaultPatientValues(): Patient {
  return {
    name: "",
    id: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    tz: "",
    pfcStart: "",
    wtkg: "",
    wtlbs: "",
    ht: "",
    ibw: "",
    blood: "",
    titer: "",
    triage: "",
    evac: "",
    status: "",
  };
}

function defaultVitalSet(): VitalSet {
  return {
    time: new Date().toTimeString().slice(0, 5),
    hr: "", sbp: "", dbp: "", rr: "", spo2: "", etco2: "", temp: "",
    eye: "", verbal: "", motor: "", avpu: "", mace: "",
    pain: "", rass: "", fluidIn: "", urineOut: "", notes: "",
  };
}

function defaultMedication(): Medication {
  return { drug: "", dose: "", route: "", time: new Date().toTimeString().slice(0, 5) };
}

export interface PfcState {
  // Status
  loaded: boolean;

  // Tab
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;

  // Section states
  patient: Patient;
  setPatient: Dispatch<SetStateAction<Patient>>;
  mist: Mist;
  setMist: Dispatch<SetStateAction<Mist>>;
  history: History;
  setHistory: Dispatch<SetStateAction<History>>;
  tourniquets: Tourniquets;
  setTourniquets: Dispatch<SetStateAction<Tourniquets>>;
  meds: Medication[];
  setMeds: Dispatch<SetStateAction<Medication[]>>;
  labResults: LabResults;
  setLabResults: Dispatch<SetStateAction<LabResults>>;
  burns: BurnStates;
  setBurns: Dispatch<SetStateAction<BurnStates>>;
  burnDepth: BurnDepths;
  setBurnDepth: Dispatch<SetStateAction<BurnDepths>>;
  checks: TreatmentChecks;
  setChecks: Dispatch<SetStateAction<TreatmentChecks>>;
  checkTimes: TreatmentTimes;
  setCheckTimes: Dispatch<SetStateAction<TreatmentTimes>>;
  priorities: PriorityStates;
  setPriorities: Dispatch<SetStateAction<PriorityStates>>;
  vitals: VitalSet[];
  setVitals: Dispatch<SetStateAction<VitalSet[]>>;
  vent: VentState;
  setVent: Dispatch<SetStateAction<VentState>>;
  carePlan: CarePlan;
  setCarePlan: Dispatch<SetStateAction<CarePlan>>;

  // Derived
  treatmentsDone: number;
  prioritiesDone: number;
  tbsa: number;

  // Handlers
  updatePatient: <K extends keyof Patient>(key: K, value: Patient[K]) => void;
  updateMist: <K extends keyof Mist>(key: K, value: Mist[K]) => void;
  updateHistory: <K extends keyof History>(key: K, value: History[K]) => void;
  updateTourniquets: <K extends keyof Tourniquets>(key: K, value: Tourniquets[K]) => void;
  updateCarePlan: <K extends keyof CarePlan>(key: K, value: CarePlan[K]) => void;
  toggleTreatment: (item: string) => void;
  addMed: () => void;
  updateMed: (index: number, key: keyof Medication, value: string) => void;
  addVital: () => void;
  updateVital: (index: number, key: keyof VitalSet, value: string) => void;
}

export function usePfcState(): PfcState {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState(0);
  const [patient, setPatient] = useState<Patient>(defaultPatientValues);
  const [mist, setMist] = useState<Mist>({ m: "", i: "", s: "", t: "", time: "", to: "" });
  const [history, setHistory] = useState<History>({ allergies: "", meds: "", past: "", oral: "", events: "" });
  const [tourniquets, setTourniquets] = useState<Tourniquets>({
    t1on: "", t1c: "", t2on: "", t2c: "", t3on: "", t3c: "", t4on: "", t4c: "", txa: "", ca: "",
  });
  const [meds, setMeds] = useState<Medication[]>([]);
  const [labResults, setLabResults] = useState<LabResults>(
    () => Object.fromEntries(LABS.map(l => [l.n, ""]))
  );
  const [burns, setBurns] = useState<BurnStates>(
    () => Object.fromEntries(BURN_REGIONS.map(r => [r.id, false]))
  );
  const [burnDepth, setBurnDepth] = useState<BurnDepths>(
    () => Object.fromEntries(BURN_REGIONS.map(r => [r.id, ""]))
  );
  const [checks, setChecks] = useState<TreatmentChecks>(
    () => Object.fromEntries(TX_ITEMS.map(item => [item, false]))
  );
  const [checkTimes, setCheckTimes] = useState<TreatmentTimes>(
    () => Object.fromEntries(TX_ITEMS.map(item => [item, ""]))
  );
  const [priorities, setPriorities] = useState<PriorityStates>(
    () => Object.fromEntries(PRIORITIES.map(p => [p, false]))
  );
  const [vitals, setVitals] = useState<VitalSet[]>([]);
  const [vent, setVent] = useState<VentState>(
    () => Object.fromEntries(VENT_FIELDS.map(f => [f, ""]))
  );
  const [carePlan, setCarePlan] = useState<CarePlan>({
    problems: "", plans: "", goals: "", concerns: "", notes: "",
  });

  // Load from localStorage (keys match original save format for backward compat)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.tab !== undefined) setTab(saved.tab);
        if (saved.pt) setPatient(prev => ({ ...prev, ...saved.pt }));
        if (saved.mist) setMist(saved.mist);
        if (saved.hx) setHistory(saved.hx);
        if (saved.tq) setTourniquets(saved.tq);
        if (saved.meds) setMeds(saved.meds);
        if (saved.labR) setLabResults(saved.labR);
        if (saved.burns) setBurns(saved.burns);
        if (saved.burnD) setBurnDepth(saved.burnD);
        if (saved.checks) setChecks(saved.checks);
        if (saved.checkT) setCheckTimes(saved.checkT);
        if (saved.prio) setPriorities(saved.prio);
        if (saved.vent) setVent(saved.vent);
        if (saved.ppgc) setCarePlan(prev => ({ ...prev, ...saved.ppgc }));
        if (saved.vitals) {
          const migrated = saved.vitals.map((v: VitalSet) => {
            if (!v.sbp && v.bp) {
              return { ...v, sbp: "", dbp: "", eye: "", verbal: "", motor: "", avpu: "", mace: "", rass: "", fluidIn: "", urineOut: "" };
            }
            return v;
          });
          setVitals(migrated);
        }
      }
    } catch (e) {}
    setLoaded(true);
  }, []);

  // Save to localStorage (keys preserved for backward compat)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        v: PFC_VERSION, tab,
        pt: patient, mist, hx: history, tq: tourniquets, meds,
        labR: labResults, burns, burnD: burnDepth, checks, checkT: checkTimes,
        prio: priorities, vitals, vent, ppgc: carePlan,
      }));
    } catch (e) {}
  }, [loaded, tab, patient, mist, history, tourniquets, meds, labResults, burns, burnDepth, checks, checkTimes, priorities, vitals, vent, carePlan]);

  // Derived values
  const treatmentsDone = Object.values(checks).filter(Boolean).length;
  const prioritiesDone = Object.values(priorities).filter(Boolean).length;
  const tbsa = BURN_REGIONS.reduce(
    (sum, region) => sum + (burns[region.id] ? region.pct : 0),
    0
  );

  // Handlers
  const updatePatient = updateField(setPatient);
  const updateMist = updateField(setMist);
  const updateHistory = updateField(setHistory);
  const updateTourniquets = updateField(setTourniquets);
  const updateCarePlan = updateField(setCarePlan);

  const toggleTreatment = (item: string) => {
    const newState = !checks[item];
    setChecks(prev => ({ ...prev, [item]: newState }));
    if (newState) {
      setCheckTimes(prev => ({ ...prev, [item]: new Date().toTimeString().slice(0, 5) }));
    }
  };

  const addMed = () => {
    setMeds(prev => [...prev, defaultMedication()]);
  };

  const updateMed = (index: number, key: keyof Medication, value: string) => {
    setMeds(prev => prev.map((med, i) => i === index ? { ...med, [key]: value } : med));
  };

  const addVital = () => {
    setVitals(prev => [...prev, defaultVitalSet()]);
  };

  const updateVital = (index: number, key: keyof VitalSet, value: string) => {
    setVitals(prev => prev.map((vital, i) => i === index ? { ...vital, [key]: value } : vital));
  };

  return {
    loaded,
    tab, setTab,
    patient, setPatient,
    mist, setMist,
    history, setHistory,
    tourniquets, setTourniquets,
    meds, setMeds,
    labResults, setLabResults,
    burns, setBurns,
    burnDepth, setBurnDepth,
    checks, setChecks,
    checkTimes, setCheckTimes,
    priorities, setPriorities,
    vitals, setVitals,
    vent, setVent,
    carePlan, setCarePlan,
    treatmentsDone,
    prioritiesDone,
    tbsa,
    updatePatient,
    updateMist,
    updateHistory,
    updateTourniquets,
    updateCarePlan,
    toggleTreatment,
    addMed,
    updateMed,
    addVital,
    updateVital,
  };
}
