import type { PccCpg, PccCpgCategory } from "./types";

// Curated PCC CPGs. Each entry pairs a JTS Clinical Practice Guideline
// with a short "why this matters in PCC" blurb so the medic knows what
// decision the CPG helps them make before opening the PDF.
// All URLs come from CPGS in data/cpgs.ts (single source of truth).

export const PCC_CPG_CATEGORIES: PccCpgCategory[] = [
  { id: "all",            label: "All",             color: "#94a3b8" },
  { id: "resuscitation",  label: "Resuscitation",   color: "#ef4444" },
  { id: "airway",         label: "Airway & Vent",   color: "#06b6d4" },
  { id: "wound",          label: "Wound & Surgery", color: "#f59e0b" },
  { id: "neuro",          label: "Neuro",           color: "#8b5cf6" },
  { id: "burns",          label: "Burns & Infect",  color: "#10b981" },
  { id: "environmental",  label: "Environmental",   color: "#f97316" },
  { id: "ops",            label: "Ops & Docs",      color: "#6366f1" },
];

export const PCC_CPGS: PccCpg[] = [
  // ─── Resuscitation ───
  {
    id: "dcr-pfc",
    title: "Damage Control Resuscitation in PFC",
    category: "resuscitation",
    url: "https://jts.health.mil/assets/docs/cpgs/Damage_Control_Resuscitation_PFC_01_Oct_2018_ID73.pdf",
    date: "Oct 2018",
    pccRelevance: "Core reference for resuscitation decisions when you are hours or days from surgical care. Defines permissive hypotension targets, blood product priorities, and when to shift from damage control to balanced resuscitation.",
  },
  {
    id: "whole-blood",
    title: "Whole Blood Transfusion",
    category: "resuscitation",
    url: "https://jts.health.mil/assets/docs/cpgs/Whole_Blood_Transfusion_15_May_2018_ID21.pdf",
    date: "May 2018",
    pccRelevance: "WBB activation, donor screening, calcium replacement intervals, and reaction management. Open this before your first transfusion and again if the casualty is not improving after a unit.",
  },
  {
    id: "type-a-wb",
    title: "Type A Specific Whole Blood Transfusion",
    category: "resuscitation",
    url: "https://jts.health.mil/assets/docs/cpgs/Type_A_Specific_WB_Transfusion_30_May_2025_ID96_v1.1.pdf",
    date: "May 2025",
    pccRelevance: "Current guidance when type O low-titer is exhausted or not available. Use this to make the type-specific call with telemedicine rather than from memory.",
  },
  {
    id: "dcr",
    title: "Damage Control Resuscitation",
    category: "resuscitation",
    url: "https://jts.health.mil/assets/docs/cpgs/Damage_Control_Resuscitation_12_Jul_2019_ID18.pdf",
    date: "Jul 2019",
    pccRelevance: "The non-PFC parent document. Use for principles (ratios, endpoints, hypothermia management) when the PFC version does not cover your specific scenario.",
  },
  {
    id: "vte",
    title: "VTE Prevention",
    category: "resuscitation",
    url: "https://jts.health.mil/assets/docs/cpgs/Prevention_of_Venous_Thromboembolism_29_Mar_2024_ID36v1.2.pdf",
    date: "Mar 2024",
    pccRelevance: "Prolonged immobility in PCC puts every casualty at DVT and PE risk. Use this to time chemoprophylaxis initiation and decide on mechanical prophylaxis.",
  },

  // ─── Airway & Vent ───
  {
    id: "airway",
    title: "Airway Management in Trauma",
    category: "airway",
    url: "https://jts.health.mil/assets/docs/cpgs/Airway_Management_in_Trauma_28_Jan_2026_ID39.pdf",
    date: "Jan 2026",
    pccRelevance: "Current guidance for definitive airway selection and management. Critical for any PCC casualty with impending airway failure, head or neck trauma, or burns with inhalation injury.",
  },
  {
    id: "vent-basics",
    title: "Mechanical Ventilation Basics",
    category: "airway",
    url: "https://jts.health.mil/assets/docs/cpgs/Mechnical_Ventilation_Basics_09_Apr_2025_ID92_v1.1.pdf",
    date: "Apr 2025",
    pccRelevance: "Starting settings, troubleshooting, and adjustment framework for SAVe II and EMV+ 731. The first document to open when you are initiating or managing a ventilator.",
  },
  {
    id: "arf",
    title: "Acute Respiratory Failure",
    category: "airway",
    url: "https://jts.health.mil/assets/docs/cpgs/Acute_Respiratory_Failure_23_Jan_2017_ID06_v1.1.pdf",
    date: "Jan 2017",
    pccRelevance: "ARDS management, lung protective ventilation, and escalation strategies. When your ventilated PCC casualty is desaturating and settings are maxed, this is the playbook.",
  },
  {
    id: "vap",
    title: "Ventilator-Associated Pneumonia",
    category: "airway",
    url: "https://jts.health.mil/assets/docs/cpgs/Ventilator_Associated_Pneumonia_(VAP)_07_May_2020_ID45.pdf",
    date: "May 2020",
    pccRelevance: "Any ventilated casualty beyond 48 hours is at VAP risk. Prevention bundle and empiric treatment regimens for a common and serious PCC complication.",
  },
  {
    id: "thoracic",
    title: "Wartime Thoracic Injury",
    category: "airway",
    url: "https://jts.health.mil/assets/docs/cpgs/Wartime_Thoracic_Injury_26_Dec_2018_ID74.pdf",
    date: "Dec 2018",
    pccRelevance: "Chest tube ongoing management, hemothorax drainage thresholds, and indications for surgical consultation. Pairs directly with the Skills tab chest tube management reference.",
  },

  // ─── Wound & Surgery ───
  {
    id: "wound-pfc",
    title: "Wound Management in PFC",
    category: "wound",
    url: "https://jts.health.mil/assets/docs/cpgs/Wound_Management_PFC_24_Jul_2017_ID62.pdf",
    date: "Jul 2017",
    pccRelevance: "Delayed primary closure criteria, dressing schedules, and infection monitoring in the prolonged field environment. Pairs with the Wound Care tab as the primary reference.",
  },
  {
    id: "war-wounds",
    title: "War Wound Debridement & Irrigation",
    category: "wound",
    url: "https://jts.health.mil/assets/docs/cpgs/War_Wounds_Debridement_and_Irrigation_27_Sep_2021_ID31.pdf",
    date: "Sep 2021",
    pccRelevance: "Current irrigation volumes, debridement technique, and tissue assessment. Open before every debridement session in PCC.",
  },
  {
    id: "infection-prevention",
    title: "Infection Prevention in Combat Injuries",
    category: "wound",
    url: "https://jts.health.mil/assets/docs/cpgs/Infection_Prevention_in_Combat-related_Injuries_27_Jan_2021_ID24.pdf",
    date: "Jan 2021",
    pccRelevance: "Empiric antibiotic selection by injury pattern, duration of therapy, and tetanus prophylaxis decisions. Use when you need to start or adjust antibiotics in PCC.",
  },
  {
    id: "compartment",
    title: "Compartment Syndrome & Fasciotomy",
    category: "wound",
    url: "https://jts.health.mil/assets/docs/cpgs/Extremity_Compartment_Syndrome_and_Fasciotomy_25_Jul_2016_ID17.pdf",
    date: "Jul 2016",
    pccRelevance: "Reference when PCC casualty develops compartment syndrome after reperfusion, crush, or prolonged tourniquet. Supports field fasciotomy decision with telemedicine.",
  },
  {
    id: "amputation",
    title: "Amputation Evaluation & Treatment",
    category: "wound",
    url: "https://jts.health.mil/assets/docs/cpgs/Amputation_Evaluation_and_Treatment_10_Oct_2024_ID07_v1.1.pdf",
    date: "Oct 2024",
    pccRelevance: "Stump care, tourniquet conversion timing, and surgical planning. Critical reference for any traumatic amputation managed in PCC.",
  },
  {
    id: "pelvic-fracture",
    title: "Pelvic Fracture Care",
    category: "wound",
    url: "https://jts.health.mil/assets/docs/cpgs/Pelvic_Fracture_Care_17_Feb_2026_ID34.pdf",
    date: "Feb 2026",
    pccRelevance: "Current guidance for pelvic binder management, hemorrhage control, and evacuation priority. Pelvic fractures are often occult bleeding sources in PCC casualties.",
  },
  {
    id: "gu-injury",
    title: "Genitourinary Injury",
    category: "wound",
    url: "https://jts.health.mil/assets/docs/cpgs/Genitourinary_Injury_Trauma_Management_29_Mar_2024_ID42_v1.2.pdf",
    date: "Mar 2024",
    pccRelevance: "Foley decisions, suprapubic catheter indications, and urologic trauma management. Reference before and during Foley placement in any casualty with pelvic or urethral trauma.",
  },

  // ─── Neuro ───
  {
    id: "tbi-pfc",
    title: "TBI in Prolonged Field Care",
    category: "neuro",
    url: "https://jts.health.mil/assets/docs/cpgs/Traumatic_Brain_Injury_PFC_06_Dec_2017_ID63.pdf",
    date: "Dec 2017",
    pccRelevance: "ICP management, sedation strategy, and neurologic monitoring when neurosurgical care is far away. Every PCC TBI casualty needs this document referenced.",
  },
  {
    id: "tbi-deployed",
    title: "TBI & Neurosurgery Deployed",
    category: "neuro",
    url: "https://jts.health.mil/assets/docs/cpgs/TBI_Neurosurgery_Deployed%20Environment_15_Sep_2023_ID30_v1.1.pdf",
    date: "Sep 2023",
    pccRelevance: "Current deployed TBI management including surgical indications. Pairs with the PFC version for full coverage of TBI decision-making.",
  },
  {
    id: "spine",
    title: "Cervical & Thoracolumbar Spine",
    category: "neuro",
    url: "https://jts.health.mil/assets/docs/cpgs/Cervical_Thoracolumbar_Spine_Injury_19_Jun_2020_ID15.pdf",
    date: "Jun 2020",
    pccRelevance: "Spine precautions, clearance algorithms, and immobilization strategy during prolonged care. Affects every positioning and transport decision.",
  },

  // ─── Burns & Infection ───
  {
    id: "burn-pfc",
    title: "Burn Management in PFC",
    category: "burns",
    url: "https://jts.health.mil/assets/docs/cpgs/Burn_Management_PFC_13_Jan_2017_ID57.pdf",
    date: "Jan 2017",
    pccRelevance: "Burn resuscitation, wound care, and escharotomy decisions when a burn unit is days away. Pairs with the Wound Care tab burn daily care reference.",
  },
  {
    id: "burn-care",
    title: "Burn Care (current)",
    category: "burns",
    url: "https://jts.health.mil/assets/docs/cpgs/Burn_Care_CPG_10_June_2025_ID12_v1.3.pdf",
    date: "Jun 2025",
    pccRelevance: "Current version covering initial assessment, fluid formulas, and analgesia. Use alongside the PFC-specific burn document.",
  },
  {
    id: "sepsis-pfc",
    title: "Sepsis Management in PFC",
    category: "burns",
    url: "https://jts.health.mil/assets/docs/cpgs/Sepsis_Management_PFC_28_Oct_2020_ID83.pdf",
    date: "Oct 2020",
    pccRelevance: "Sepsis recognition, fluid strategy, and vasopressor use in the prolonged care environment. Wound infection progression to sepsis is a top-three PCC mortality driver.",
  },
  {
    id: "fungal",
    title: "Invasive Fungal Infection",
    category: "burns",
    url: "https://jts.health.mil/assets/docs/cpgs/Invasive_Fungal_Infection_in_War_Wounds_17_Jul_2023_ID28.pdf",
    date: "Jul 2023",
    pccRelevance: "Blast and soil-contaminated wounds are at risk. Use this when a wound that should be healing is getting worse, smells off, or shows gray necrosis.",
  },

  // ─── Environmental ───
  {
    id: "hypothermia",
    title: "Hypothermia Prevention & Treatment",
    category: "environmental",
    url: "https://jts.health.mil/assets/docs/cpgs/Hypothermia_Prevention_Treatment_07_Jun_2023_ID23.pdf",
    date: "Jun 2023",
    pccRelevance: "Hypothermia worsens coagulopathy and mortality in trauma. Core PCC content for active rewarming during prolonged field care in any environment.",
  },

  // ─── Ops & Docs ───
  {
    id: "telemedicine",
    title: "Telemedicine in Deployed Setting",
    category: "ops",
    url: "https://jts.health.mil/assets/docs/cpgs/Telemedicine_Deployed_Setting_19_Sep_2023_ID94_v1.2.pdf",
    date: "Sep 2023",
    pccRelevance: "How and when to escalate to telemedicine consult. In PCC, telemedicine is often the difference between a procedure going right or wrong. Know the process cold.",
  },
  {
    id: "documentation",
    title: "Documentation in PFC",
    category: "ops",
    url: "https://jts.health.mil/assets/docs/cpgs/Documentation_Prolonged_Field_Care_13_Nov_2018_ID72_v1.1.pdf",
    date: "Nov 2018",
    pccRelevance: "Flow sheet expectations and handoff documentation for prolonged care. Anything you did not document did not happen; this CPG tells you what the receiving MTF needs.",
  },
  {
    id: "en-route",
    title: "En Route Patient Packaging",
    category: "ops",
    url: "https://jts.health.mil/assets/docs/cpgs/En_Route_Care_Patient_Packaging_21_Aug_2024_ID97_v1.2.pdf",
    date: "Aug 2024",
    pccRelevance: "Packaging, securing, and preparing for transport after prolonged care stabilization. Transition-of-care reference for MEDEVAC handoff.",
  },
  {
    id: "nursing-pcc",
    title: "Nursing Interventions in PCC",
    category: "ops",
    url: "https://jts.health.mil/assets/docs/cpgs/Nursing_Interventions_PCC_08_July_2025_ID70_v1.1.pdf",
    date: "Jul 2025",
    pccRelevance: "The foundation document for the PCC nursing tab. Covers q1h, q4h, q8h task intervals and the nursing-care bundles that drive outcomes in prolonged care.",
  },
];
