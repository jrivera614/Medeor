// Medeor data type definitions.
// Central source of truth for the shape of every data file under src/app/data/.
// Types derived from the actual data, not from guesses.
// Optional fields used generously - relaxed mode, and nullable fields exist in real data.

// ─── TOPICS ───

export interface SeoMetadata {
  title: string;
  description: string;
  heading: string;
  intro: string;
  ssrTopics: string[];
  keywords: string;
}

export interface TopicStep {
  title: string;
  detail: string;
  instruction: string;
  diagram?: string;
  video?: string;
}

export interface TopicQuizQuestion {
  q: string;
  options: string[];
  correct: number;
  why: string;
}

export interface TopicFlashcard {
  front: string;
  back: string;
}

// Scenarios are structured as title + setup + decisions[].
// Each decision has a prompt and options with result text + correctness flag.
export interface TopicScenarioDecisionOption {
  text: string;
  result: string;
  correct: boolean;
}

export interface TopicScenarioDecision {
  prompt: string;
  options: TopicScenarioDecisionOption[];
}

export interface TopicScenario {
  title: string;
  setup: string;
  decisions: TopicScenarioDecision[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  color: string;
  subtitle: string;
  seo?: SeoMetadata;
  steps?: TopicStep[];
  quiz?: TopicQuizQuestion[];
  flashcards?: TopicFlashcard[];
  scenarios?: TopicScenario[];
}

// ─── CPGS ───

export interface CpgLink {
  title: string;
  url: string;
  date: string;
}

export interface CpgCategory {
  category: string;
  color: string;
  items: CpgLink[];
}

// ─── VIDEOS ───
// Videos are organized as module groups, each containing an array of videos.

export interface VideoLink {
  name: string;
  yt: string;
  ext?: boolean;
}

export interface Video {
  mod: string;
  title: string;
  color: string;
  vids: VideoLink[];
}

// ─── CHECKLISTS ───

export interface ChecklistItem {
  text: string;
  detail?: string;
  critical?: boolean;
}

// Checklist items can be either plain strings or structured objects.
// Historical: earlier checklists used strings, newer ones use ChecklistItem.
export type ChecklistItemValue = string | ChecklistItem;

export interface Checklist {
  id?: string;
  title: string;
  icon?: string;
  color?: string;
  description?: string;
  items: ChecklistItemValue[];
}

// ─── GRADE SHEETS ───

export interface GradeSheetStep {
  text: string;
  critical?: boolean;
}

export interface GradeSheet {
  title: string;
  tier: string;
  color: string;
  steps: GradeSheetStep[];
}

// ─── RMH (Ranger Medic Handbook) ───
// Structured as top-level sections containing nested topic cards.

export interface RmhTopic {
  title: string;
  content: string;
  keyPoints: string[];
}

export interface RmhSection {
  section: string;
  color: string;
  topics: RmhTopic[];
}

// ─── MEDICATIONS ───

export type MedCategoryId =
  | "all"
  | "hemorrhage"
  | "pain"
  | "sedation"
  | "antibiotics"
  | "pressors"
  | "blood"
  | "airway"
  | "neuro"
  | "nausea"
  | "garrison";

export interface MedCategory {
  id: MedCategoryId;
  label: string;
  color: string;
}

// Phase is stored as a slash-delimited string for historical reasons.
// Common values: "TCCC", "PFC", "PCC", "TCCC/PFC", "PCC/PFC", "Historical", "Garrison".
// A later PR will migrate this to a proper enum array.
export type MedPhase = string;

export interface Medication {
  name: string;
  category: Exclude<MedCategoryId, "all">;
  phase: MedPhase;
  dose: string;
  route: string;
  indication: string;
  timing: string;
  warnings: string;
  notes: string;
  pedsPerKg?: number;
  pedsUnit?: string;
  pedsRoute?: string;
}

// ─── PCC PROCEDURES ───
// Reference-layer procedures for the /pcc/skills page. Day-to-day skills
// used during prolonged casualty care. Surgical procedures covered in the
// pfc-procedures training topic (finger thoracostomy, escharotomy, etc.)
// are intentionally not duplicated here.

export type PccProcedureCategoryId =
  | "all"
  | "airway"
  | "access"
  | "blood"
  | "gi"
  | "gu";

export interface PccProcedureCategory {
  id: PccProcedureCategoryId;
  label: string;
  color: string;
}

export interface PccProcedure {
  id: string;
  name: string;
  category: Exclude<PccProcedureCategoryId, "all">;
  indications: string;
  contraindications: string;
  equipment: string;
  steps: string[];
  confirmation: string;
  complications: string;
  pccNotes: string;
  documentation: string;
  references: string[];
}

// ─── PCC WOUND CARE ───
// Ongoing wound management content for the /pcc/wound page.
// Separate from pccProcedures to keep the skills tab focused on
// access/airway/GI/GU reference and let wound care carry its own workflow.

export type PccWoundCareCategoryId =
  | "all"
  | "acute"
  | "infection"
  | "burns"
  | "dressings"
  | "amputation"
  | "closure";

export interface PccWoundCareCategory {
  id: PccWoundCareCategoryId;
  label: string;
  color: string;
}

export interface PccWoundCareEntry {
  id: string;
  name: string;
  category: Exclude<PccWoundCareCategoryId, "all">;
  indications: string;
  contraindications: string;
  equipment: string;
  steps: string[];
  confirmation: string;
  complications: string;
  pccNotes: string;
  documentation: string;
  references: string[];
}

// ─── PCC CPGS (curated) ───
// Curated list of JTS CPGs most relevant to prolonged casualty care,
// each paired with a short "why this matters in PCC" blurb so the medic
// understands why to open it before they tap the link.

export type PccCpgCategoryId =
  | "all"
  | "resuscitation"
  | "airway"
  | "wound"
  | "neuro"
  | "burns"
  | "environmental"
  | "ops";

export interface PccCpgCategory {
  id: PccCpgCategoryId;
  label: string;
  color: string;
}

export interface PccCpg {
  id: string;
  title: string;
  category: Exclude<PccCpgCategoryId, "all">;
  url: string;
  date: string;
  pccRelevance: string;
}
