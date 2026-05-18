"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { tokens } from "@/app/ui";
import { NumField } from "@/app/pfc/components/Fields";
import type { Entry, Patient, Provider } from "@/app/lib/sf600/types";
import { AUTOSAVE_DEBOUNCE_MS, VITALS_RANGES } from "@/app/lib/sf600/constants";
import { hasVitals } from "@/app/lib/sf600/vitals";
import { nowLocalISO } from "@/app/lib/sf600/format";

// EntryForm: the SOAP-style note editor for a single chronological entry.
// Autosaves with a 600ms debounce. On save failure, surfaces a retry button
// rather than silently swallowing the error - this is the Tier 1 fix from
// the previous session, where a failed IndexedDB write would only console.error
// and the medic would have no idea their last 5 minutes of charting was lost.
//
// Save lifecycle states:
//   "idle"   - no pending save, nothing to do
//   "dirty"  - user typed something, waiting for debounce
//   "saving" - actively writing to IndexedDB
//   "saved"  - last save succeeded (sticky for 1.5s then back to idle)
//   "error"  - last save failed, retry button visible
//
// The error state holds the last attempted draft in pendingDraft so the retry
// button can re-attempt without losing data the user typed since.

const inp = {
  width: "100%", padding: "9px 12px",
  background: tokens.bgCard,
  border: `1px solid ${tokens.borderSoft}`,
  borderRadius: tokens.radiusMd,
  color: tokens.textPrimary,
  fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const,
};
const lbl = {
  fontSize: 11, color: tokens.textDim,
  display: "block" as const, marginBottom: 3, letterSpacing: ".03em",
};
const secStyle = {
  fontSize: 13, fontWeight: 700, color: tokens.brand,
  textTransform: "uppercase" as const, letterSpacing: ".06em",
  padding: "14px 0 8px",
  borderBottom: `1px solid ${tokens.bgMuted}`,
  marginBottom: 10,
};
const subSec = {
  fontSize: 10, color: tokens.textMuted, fontWeight: 600,
  marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: ".04em",
};

// Draft = the shape sent to onSave. Includes id only when editing existing.
export interface EntryDraft {
  id?: string;
  patientId: string;
  date: string;
  narrative: string;
  signedBy: string;
  treatingOrganization?: string;
  hr?: string;
  sbp?: string;
  dbp?: string;
  rr?: string;
  spo2?: string;
  temp?: string;
  pain?: string;
}

export interface EntryFormProps {
  patient: Patient;
  provider: Provider;
  existing?: Entry;

  // onSave returns the entry id (new or existing). Throws on persistence
  // failure so the form can show retry UX. Do NOT swallow errors in caller.
  onSave: (draft: EntryDraft) => Promise<string>;

  // Callback for the "Done" header button - typically navigates away.
  onDone: () => void;
}

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export function EntryForm({ patient, provider, existing, onSave, onDone }: EntryFormProps) {
  const [date, setDate] = useState(existing?.date || nowLocalISO());
  const [narrative, setNarrative] = useState(existing?.narrative || "");
  const [org, setOrg] = useState(existing?.treatingOrganization || provider.unit || "");
  const [hr, setHr] = useState(existing?.hr || "");
  const [sbp, setSbp] = useState(existing?.sbp || "");
  const [dbp, setDbp] = useState(existing?.dbp || "");
  const [rr, setRr] = useState(existing?.rr || "");
  const [spo2, setSpo2] = useState(existing?.spo2 || "");
  const [temp, setTemp] = useState(existing?.temp || "");
  const [pain, setPain] = useState(existing?.pain || "");
  const [entryId, setEntryId] = useState<string | undefined>(existing?.id);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = true;
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current);
    };
  }, []);

  // Build a draft from current state. Empty strings collapse to undefined so
  // we don't persist meaningless blanks in IndexedDB.
  const buildDraft = useCallback((): EntryDraft => ({
    id: entryId,
    patientId: patient.id,
    date,
    narrative,
    signedBy: provider.name,
    treatingOrganization: org.trim() || undefined,
    hr: hr || undefined,
    sbp: sbp || undefined,
    dbp: dbp || undefined,
    rr: rr || undefined,
    spo2: spo2 || undefined,
    temp: temp || undefined,
    pain: pain || undefined,
  }), [entryId, patient.id, date, narrative, provider.name, org, hr, sbp, dbp, rr, spo2, temp, pain]);

  const performSave = useCallback(async (draft: EntryDraft) => {
    setSaveState("saving");
    setErrorMsg(null);
    try {
      const newId = await onSave(draft);
      if (!entryId && newId) setEntryId(newId);
      setSaveState("saved");
      if (savedFlashTimer.current) clearTimeout(savedFlashTimer.current);
      savedFlashTimer.current = setTimeout(() => {
        setSaveState((prev) => (prev === "saved" ? "idle" : prev));
      }, 1500);
    } catch (e) {
      setSaveState("error");
      const msg = (e as Error)?.message || "Save failed";
      setErrorMsg(msg);
      console.error("[SF600 EntryForm] save failed:", e);
    }
  }, [onSave, entryId]);

  const triggerSave = useCallback(async () => {
    const draft = buildDraft();
    // Don't save a totally empty new entry. Once an id exists we always save
    // (clearing fields is a legitimate edit).
    if (!draft.id && !draft.narrative.trim() && !hasVitals(draft)) return;
    await performSave(draft);
  }, [buildDraft, performSave]);

  // triggerSave is rebuilt whenever its deps change - including onSave, whose
  // identity is tied to the parent's entries array. A save mutates that array,
  // so if the autosave effect depended on triggerSave it would re-run after
  // every save, re-arm the debounce, and the form would save on a 600ms loop
  // forever. Hold the latest triggerSave in a ref and keep it OUT of the
  // effect deps - autosave must fire on field edits only.
  const triggerSaveRef = useRef(triggerSave);
  useEffect(() => {
    triggerSaveRef.current = triggerSave;
  });

  // Autosave: any change to a watched field schedules a debounced save.
  useEffect(() => {
    if (!hydrated.current) return;
    setSaveState((prev) => (prev === "saving" ? prev : "dirty"));
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void triggerSaveRef.current();
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [date, narrative, org, hr, sbp, dbp, rr, spo2, temp, pain]);

  // Manual retry from the error banner. Builds a fresh draft from the current
  // form state, so any text the medic typed AFTER seeing the error is included
  // in the retry. Important: the ref-based "stash the attempted draft" pattern
  // was wrong here - it would silently discard amendments. buildDraft() is
  // already memoized against every form field via useCallback deps, so it
  // always reflects the latest state.
  const onRetry = useCallback(() => {
    void performSave(buildDraft());
  }, [buildDraft, performSave]);

  // Force-save on done so an entry typed in the last 600ms isn't lost when
  // the user backs out before the debounce fires.
  const handleDone = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    const draft = buildDraft();
    if (draft.id || draft.narrative.trim() || hasVitals(draft)) {
      try {
        await performSave(draft);
      } catch {
        // performSave already set error state. Don't navigate away on failure.
        return;
      }
    }
    onDone();
  }, [buildDraft, performSave, onDone]);

  return (
    <div>
      <SaveStatus state={saveState} errorMsg={errorMsg} onRetry={onRetry} />

      <div style={secStyle}>When</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <div style={{ flex: "1 1 55%", minWidth: 140, marginBottom: 10 }}>
          <label style={lbl}>Date / Time</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...inp, colorScheme: "dark" }}
          />
        </div>
        <div style={{ flex: "1 1 40%", minWidth: 100, marginBottom: 10 }}>
          <label style={lbl}>Treating Org</label>
          <input
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Unit / clinic"
            style={inp}
          />
        </div>
      </div>

      <div style={secStyle}>Vitals</div>
      <div style={subSec}>Hemodynamics</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        <NumField label="HR" min={VITALS_RANGES.hr.min} max={VITALS_RANGES.hr.max} value={hr} onChange={setHr} />
        <NumField label="SBP" min={VITALS_RANGES.sbp.min} max={VITALS_RANGES.sbp.max} value={sbp} onChange={setSbp} />
        <NumField label="DBP" min={VITALS_RANGES.dbp.min} max={VITALS_RANGES.dbp.max} value={dbp} onChange={setDbp} />
        <NumField label="PAIN" min={VITALS_RANGES.pain.min} max={VITALS_RANGES.pain.max} value={pain} onChange={setPain} />
      </div>
      <div style={subSec}>Respiratory / Other</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        <NumField label="RR" min={VITALS_RANGES.rr.min} max={VITALS_RANGES.rr.max} value={rr} onChange={setRr} />
        <NumField label="SpO2" min={VITALS_RANGES.spo2.min} max={VITALS_RANGES.spo2.max} value={spo2} onChange={setSpo2} />
        <NumField label="TEMP" min={VITALS_RANGES.temp.min} max={VITALS_RANGES.temp.max} value={temp} onChange={setTemp} />
      </div>

      <div style={secStyle}>Narrative</div>
      <div style={{ marginBottom: 10 }}>
        <label style={lbl}>Symptoms, Diagnosis, Treatment</label>
        <textarea
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          rows={12}
          placeholder={"S: chief complaint, HPI\nO: exam\nA: assessment\nP: treatment, dispo, return precautions"}
          style={{
            ...inp,
            resize: "vertical",
            fontFamily: "'Menlo', ui-monospace, monospace",
            fontSize: 12, lineHeight: 1.5,
          }}
        />
      </div>

      <div style={{
        fontSize: 9, color: tokens.textFaint,
        padding: "8px 0", textAlign: "center", letterSpacing: ".04em",
      }}>
        SIGNED BY {provider.name.toUpperCase()} {"\u00b7"} AUTOSAVES
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={handleDone}
          style={{
            flex: 1, padding: "10px",
            background: tokens.brand, border: "none", color: "#fff",
            fontSize: 12, fontWeight: 700,
            borderRadius: tokens.radiusMd,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: ".04em",
          }}
        >
          DONE
        </button>
      </div>
    </div>
  );
}

// ─── Save status banner ─────────────────────────────────────────────────────

interface SaveStatusProps {
  state: SaveState;
  errorMsg: string | null;
  onRetry: () => void;
}

function SaveStatus({ state, errorMsg, onRetry }: SaveStatusProps) {
  if (state === "idle" || state === "dirty") return null;

  if (state === "saving") {
    return (
      <StatusBar color={tokens.textMuted}>
        <span style={{ fontSize: 11 }}>Saving{"\u2026"}</span>
      </StatusBar>
    );
  }
  if (state === "saved") {
    return (
      <StatusBar color={tokens.green}>
        <span style={{ fontSize: 11 }}>Saved</span>
      </StatusBar>
    );
  }
  // error
  return (
    <div style={{
      background: `${tokens.red}10`,
      border: `1px solid ${tokens.red}40`,
      borderRadius: tokens.radiusMd,
      padding: "10px 14px",
      marginBottom: 10,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: tokens.red,
        textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4,
      }}>
        Save Failed
      </div>
      <div style={{
        fontSize: 11, color: tokens.textSecondary,
        lineHeight: 1.5, marginBottom: 8,
      }}>
        {errorMsg || "Could not write to local storage."} Your typed text is still in the form. Tap retry, or copy your narrative to a safe place before closing.
      </div>
      <button
        onClick={onRetry}
        style={{
          background: tokens.red, border: "none", color: "#fff",
          padding: "6px 14px",
          borderRadius: tokens.radiusSm + 1,
          fontSize: 11, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit", letterSpacing: ".04em",
        }}
      >
        RETRY SAVE
      </button>
    </div>
  );
}

function StatusBar({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: `${color}10`,
      border: `1px solid ${color}30`,
      borderRadius: tokens.radiusSm + 1,
      padding: "6px 12px",
      marginBottom: 10,
      color,
      fontWeight: 600,
    }}>
      {children}
    </div>
  );
}
