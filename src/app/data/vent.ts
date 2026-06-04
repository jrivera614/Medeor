// Mechanical ventilation reference content for the /pcc/vent and /pcc/trouble pages.
// Aligned with the JTS Airway Management and Mechanical Ventilation CPG and the
// JTS Acute Respiratory Failure CPG. Field-transport vent focused (SAVe II, EMV+,
// Hamilton-T1). Intubation itself is covered in the PFC Procedures training module.

export interface VentSetting {
  label: string;
  value: string;
  note: string;
}

export interface MnemonicLetter {
  letter: string;
  term: string;
  detail: string;
}

export interface VentTopic {
  id: string;
  title: string;
  color: string;
  body: string;
}

export interface TroubleEntry {
  id: string;
  problem: string;
  color: string;
  causes: string;
  action: string;
}

// ─── INITIAL VENT SETTINGS ───
export const VENT_SETTINGS: VentSetting[] = [
  { label: "Mode", value: "Volume A/C", note: "Volume-controlled assist/control is the default for transport vents and the simplest to manage." },
  { label: "Tidal volume", value: "6-8 mL/kg PBW", note: "Use predicted body weight from height, not actual weight. Target 6 mL/kg for ARDS or blast lung." },
  { label: "Rate", value: "12-16 / min", note: "Titrate to EtCO2 and pH. Increase for metabolic acidosis or to clear CO2." },
  { label: "FiO2", value: "1.0, then wean", note: "Start 100 percent, wean to the lowest FiO2 holding SpO2 92-96 percent. High FiO2 wastes finite oxygen and risks toxicity." },
  { label: "PEEP", value: "5 cmH2O", note: "Increase in steps of 2-3 for refractory hypoxemia. Watch blood pressure: high PEEP drops preload and can crash a hypovolemic casualty." },
  { label: "I:E ratio", value: "1:2", note: "Lengthen expiratory time (1:3, 1:4) for obstructive physiology or air trapping." },
];

// ─── SOAPME (pre-intubation setup) ───
export const SOAPME: MnemonicLetter[] = [
  { letter: "S", term: "Suction", detail: "Working, mounted, and within reach before you start." },
  { letter: "O", term: "Oxygen", detail: "Source confirmed and BVM connected and functional." },
  { letter: "A", term: "Airway", detail: "Tube of the planned size, one size smaller staged, bougie, blade, backup supraglottic." },
  { letter: "P", term: "Positioning + Pharmacy", detail: "Casualty positioned (ear-to-sternal-notch), induction and paralytic drawn and labeled." },
  { letter: "M", term: "Monitors", detail: "SpO2 and continuous EtCO2 capnography on before the attempt." },
  { letter: "E", term: "EtCO2 + Equipment", detail: "Confirmation method ready, ventilator powered and pre-set so you can transition straight to it." },
];

// ─── DOPES (deterioration on the vent) ───
export const DOPES: MnemonicLetter[] = [
  { letter: "D", term: "Displacement", detail: "Tube migrated or out. Check depth mark and capnography waveform. No waveform means no airway until proven otherwise." },
  { letter: "O", term: "Obstruction", detail: "Kink, mucus plug, or biting. Pass a suction catheter; if it will not pass, the tube is obstructed." },
  { letter: "P", term: "Pneumothorax", detail: "Absent breath sounds, rising peak pressure, hypotension, tracheal shift. Decompress immediately." },
  { letter: "E", term: "Equipment", detail: "Vent, circuit, or oxygen failure. Disconnect from the vent and bag the casualty by hand while you troubleshoot the machine off the patient." },
  { letter: "S", term: "Stacked breaths", detail: "Auto-PEEP / breath stacking, common in obstructive lungs. Disconnect to let the casualty exhale fully, then lengthen expiratory time." },
];

// ─── REFERENCE TOPICS ───
export const VENT_TOPICS: VentTopic[] = [
  {
    id: "lung-protective",
    title: "Lung-protective targets",
    color: "#06b6d4",
    body: "Keep tidal volume at 6-8 mL/kg of predicted body weight and plateau (or peak, if plateau is unavailable on the transport vent) below 30 cmH2O. Permissive hypercapnia is acceptable: a higher CO2 and pH down to roughly 7.20 is tolerated to avoid high-pressure ventilation. The lungs are easier to injure than to fix in a field setting.",
  },
  {
    id: "oxygenation",
    title: "Oxygenation strategy",
    color: "#3b82f6",
    body: "Two knobs raise oxygenation: FiO2 and PEEP. Wean FiO2 first to protect your oxygen supply, then use PEEP for recruitment in refractory hypoxemia. Target SpO2 92-96 percent. Chasing 100 percent burns oxygen and adds nothing. Oxygen is a finite, mission-limiting resource: a concentrator extends a mission, a cylinder runs out.",
  },
  {
    id: "ards",
    title: "ARDS and blast lung",
    color: "#8b5cf6",
    body: "Blast lung and ARDS both want low tidal volume (6 mL/kg PBW), higher PEEP, and tolerance of hypercapnia. Blast lung also raises the risk of air embolism and pneumothorax with positive pressure, so use the lowest pressures that maintain oxygenation, avoid aggressive PEEP, and have decompression ready. Prone positioning helps oxygenation if you have the hands and it is safe to do.",
  },
  {
    id: "weaning",
    title: "Weaning readiness",
    color: "#10b981",
    body: "Reassess daily. Candidate for a spontaneous breathing trial when FiO2 is at or below 0.4, PEEP at or below 5, the casualty is hemodynamically stable, and they are triggering their own breaths. Liberation is rarely the priority in active PCC, but unnecessary sedation and ventilation add burden and risk, so do not over-ventilate a casualty who could be supported more simply.",
  },
  {
    id: "burden",
    title: "The PCC reality",
    color: "#f59e0b",
    body: "A vented casualty is one of the highest-burden tasks in all of prolonged care. They cannot be left alone, ever. They need continuous monitoring, scheduled suctioning, mandatory humidification (HME at minimum), sedation and analgesia management, cuff checks, and a charged BVM within arm's reach at all times. Build oxygen resupply into the evacuation plan and contact telemedicine early and often.",
  },
];

// ─── TROUBLESHOOTING (alarms + deterioration) ───
export const TROUBLE_ENTRIES: TroubleEntry[] = [
  {
    id: "high-pressure",
    problem: "High peak pressure alarm",
    color: "#ef4444",
    causes: "Mucus plug or kinked tube, biting, bronchospasm, pneumothorax, mainstem intubation, decreasing lung compliance (ARDS), or breath stacking.",
    action: "Work DOPES. Suction and check the circuit first. Listen for bilateral breath sounds. If sounds are absent on one side with hypotension, decompress for pneumothorax. If the tube is too deep, withdraw to correct depth. If the cause is unclear, disconnect and bag by hand.",
  },
  {
    id: "low-pressure",
    problem: "Low pressure / low minute volume / disconnect",
    color: "#f59e0b",
    causes: "Circuit disconnect or leak, cuff leak or underinflation, accidental extubation, dislodged tube.",
    action: "Trace the circuit from vent to tube. Reconnect any open junction. Check cuff pressure (20-30 cmH2O) and reinflate if low. Confirm tube depth and capnography. If the tube is out, bag with mask and prepare to replace the airway.",
  },
  {
    id: "apnea",
    problem: "Apnea alarm",
    color: "#8b5cf6",
    causes: "Casualty not triggering and the vent set rate is too low, oversedation, the casualty has arrested, or a sensing or trigger failure.",
    action: "Check the casualty first, not the machine. Confirm a pulse and chest rise. If apneic and pulseless, start resuscitation. If breathing but not triggering, raise the set rate or switch to a full control mode and reassess sedation depth.",
  },
  {
    id: "desat",
    problem: "Falling SpO2",
    color: "#06b6d4",
    causes: "Any DOPES cause, plus inadequate FiO2 or PEEP, secretions, atelectasis, or a probe artifact.",
    action: "Confirm the reading with a good waveform and warm digit. If real, work DOPES. Pre-oxygenate and suction. Increase FiO2 short term, then address the underlying cause. Consider recruiting with PEEP if oxygenation is refractory and pressures allow.",
  },
  {
    id: "vent-fail",
    problem: "Ventilator or power failure",
    color: "#3b82f6",
    causes: "Dead battery, no backup power, internal fault, exhausted oxygen supply.",
    action: "Disconnect the casualty and bag manually with the BVM. This is exactly why the BVM lives at the bedside. Troubleshoot or swap the machine off the patient. Switch to backup power or a fresh cylinder. Never spend time fixing a vent while a casualty goes unventilated.",
  },
];

export const VENT_REFERENCES =
  "JTS Airway Management and Mechanical Ventilation CPG · JTS Acute Respiratory Failure CPG · TCCC Guidelines current edition";
