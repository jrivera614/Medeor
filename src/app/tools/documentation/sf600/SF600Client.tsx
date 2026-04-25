"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, tokens, styles } from "@/app/ui";
import { safeStorage } from "@/app/lib/safeStorage";
import type { Patient, Entry, Provider, MergeReport } from "@/app/lib/sf600/types";
import { getDb, loadAllData } from "@/app/lib/sf600/db";
import { uuid } from "@/app/lib/sf600/format";
import { buildBundle, parseBundle, mergeBundle } from "@/app/lib/sf600/sync";
import { downloadSF600Pdf } from "./pdf/exportPdf";
import { PROVIDER_LOCALSTORAGE_KEY } from "@/app/lib/sf600/constants";

import { StorageHealthBanner } from "./components/StorageHealthBanner";
import { ProviderSelector } from "./components/ProviderSelector";
import { PatientList } from "./components/PatientList";
import { PatientForm, type PatientDraft } from "./components/PatientForm";
import { PatientDetail } from "./components/PatientDetail";
import { EntryForm, type EntryDraft } from "./components/EntryForm";
import { ConflictReport } from "./components/ConflictReport";

// SF600Client: top-level state machine for the SF 600 tool. Holds patients,
// entries, and provider in memory after loading from IndexedDB / localStorage,
// and routes between the four subviews:
//
//   "list"       - patient roster + provider selector + sync controls
//   "newPatient" - patient creation form
//   "detail"     - one patient's record (info + entries + actions)
//   "entry"      - entry editor
//
// We keep all data in component state and persist on every mutation, rather
// than re-querying the DB after each change. That trades a little memory for
// snappier UI on tablets - which is right for a 2-medic, ~50-patient mission.

type View =
  | { kind: "list" }
  | { kind: "newPatient" }
  | { kind: "detail"; patientId: string }
  | { kind: "entry"; patientId: string; entryId?: string };

const secStyle = {
  fontSize: 13, fontWeight: 700, color: tokens.brand,
  textTransform: "uppercase" as const, letterSpacing: ".06em",
  padding: "14px 0 8px",
  borderBottom: `1px solid ${tokens.bgMuted}`,
  marginBottom: 10,
};

export default function SF600Client() {
  const router = useRouter();

  const [view, setView] = useState<View>({ kind: "list" });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [mergeReport, setMergeReport] = useState<MergeReport | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // ─── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      // Provider is per-device, lives in localStorage.
      try {
        const p = safeStorage.getJSON<Provider>(PROVIDER_LOCALSTORAGE_KEY);
        if (mounted && p) setProvider(p);
      } catch (e) {
        console.warn("Failed to load provider from localStorage:", e);
      }
      // Patients and entries from IndexedDB.
      try {
        const data = await loadAllData();
        if (!mounted) return;
        setPatients(data.patients);
        setEntries(data.entries);
        setLoaded(true);
      } catch (e) {
        if (!mounted) return;
        const msg = (e as Error)?.message || "Could not open local database.";
        setLoadError(msg);
        setLoaded(true);
        console.error("[SF600Client] DB load failed:", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ─── Toast helper ──────────────────────────────────────────────────────────
  const showToast = useCallback((kind: "ok" | "err", text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast((t) => (t && t.text === text ? null : t)), 3500);
  }, []);

  // ─── Provider persistence ──────────────────────────────────────────────────
  const updateProvider = useCallback((p: Provider | null) => {
    setProvider(p);
    if (p) safeStorage.setJSON(PROVIDER_LOCALSTORAGE_KEY, p);
    else safeStorage.remove(PROVIDER_LOCALSTORAGE_KEY);
  }, []);

  // ─── Patient mutations ─────────────────────────────────────────────────────
  const createPatient = useCallback(async (draft: PatientDraft) => {
    const now = Date.now();
    const p: Patient = {
      ...draft,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      createdBy: provider?.name,
    };
    try {
      await getDb().patients.put(p);
      setPatients((prev) => [p, ...prev]);
      setView({ kind: "detail", patientId: p.id });
    } catch (e) {
      showToast("err", `Patient save failed: ${(e as Error).message}`);
    }
  }, [provider, showToast]);

  const updatePatient = useCallback(async (id: string, draft: PatientDraft) => {
    const existing = patients.find((p) => p.id === id);
    if (!existing) return;
    const updated: Patient = {
      ...existing,
      ...draft,
      updatedAt: Date.now(),
    };
    try {
      await getDb().patients.put(updated);
      setPatients((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      showToast("err", `Patient update failed: ${(e as Error).message}`);
      throw e;
    }
  }, [patients, showToast]);

  const deletePatient = useCallback(async (id: string) => {
    if (!confirm("Delete this patient and all their entries? This cannot be undone.")) return;
    try {
      const db = getDb();
      await db.transaction("rw", db.patients, db.entries, async () => {
        await db.entries.where("patientId").equals(id).delete();
        await db.patients.delete(id);
      });
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setEntries((prev) => prev.filter((e) => e.patientId !== id));
      setView({ kind: "list" });
    } catch (e) {
      showToast("err", `Delete failed: ${(e as Error).message}`);
    }
  }, [showToast]);

  // ─── Entry mutations ───────────────────────────────────────────────────────
  // saveEntry returns the id (new or existing). Throws on persistence failure
  // so EntryForm can show its retry UX.
  const saveEntry = useCallback(async (draft: EntryDraft): Promise<string> => {
    const now = Date.now();
    const isNew = !draft.id;
    const id = draft.id || uuid();
    const existing = isNew ? null : entries.find((e) => e.id === id);
    const persisted: Entry = {
      id,
      patientId: draft.patientId,
      date: draft.date,
      narrative: draft.narrative,
      signedBy: draft.signedBy,
      treatingOrganization: draft.treatingOrganization,
      hr: draft.hr,
      sbp: draft.sbp,
      dbp: draft.dbp,
      rr: draft.rr,
      spo2: draft.spo2,
      temp: draft.temp,
      pain: draft.pain,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await getDb().entries.put(persisted);
    setEntries((prev) => {
      const without = prev.filter((e) => e.id !== id);
      return [persisted, ...without];
    });
    return id;
  }, [entries]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await getDb().entries.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      showToast("err", `Delete failed: ${(e as Error).message}`);
    }
  }, [showToast]);

  // ─── PDF export ────────────────────────────────────────────────────────────
  const exportPatientPdf = useCallback(async (patientId: string) => {
    const p = patients.find((pp) => pp.id === patientId);
    if (!p) throw new Error("Patient not found");
    const ents = entries.filter((e) => e.patientId === patientId);
    await downloadSF600Pdf(p, ents);
  }, [patients, entries]);

  // ─── Sync: export bundle ───────────────────────────────────────────────────
  const exportBundle = useCallback(async () => {
    try {
      const { json, filename } = await buildBundle(provider?.name);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("ok", "Bundle exported");
    } catch (e) {
      showToast("err", `Export failed: ${(e as Error).message}`);
    }
  }, [provider, showToast]);

  // ─── Sync: import bundle ───────────────────────────────────────────────────
  const importBundle = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async (ev) => {
      const file = (ev.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const bundle = parseBundle(text);
        const report = await mergeBundle(bundle);
        // Reload from DB after merge so in-memory state matches truth.
        const fresh = await loadAllData();
        setPatients(fresh.patients);
        setEntries(fresh.entries);
        setMergeReport(report);
      } catch (e) {
        showToast("err", `Import failed: ${(e as Error).message}`);
      }
    };
    input.click();
  }, [showToast]);

  // ─── Derived ───────────────────────────────────────────────────────────────
  const currentPatient = useMemo(() => {
    if (view.kind !== "detail" && view.kind !== "entry") return null;
    return patients.find((p) => p.id === view.patientId) || null;
  }, [view, patients]);

  const currentPatientEntries = useMemo(() => {
    if (!currentPatient) return [];
    return entries.filter((e) => e.patientId === currentPatient.id);
  }, [entries, currentPatient]);

  const editingEntry = useMemo(() => {
    if (view.kind !== "entry" || !view.entryId) return undefined;
    return entries.find((e) => e.id === view.entryId);
  }, [view, entries]);

  // ─── Render ────────────────────────────────────────────────────────────────

  // Header configuration depends on view.
  let headerProps: {
    eyebrow?: string; title: string; subtitle?: string;
    onBack?: () => void; action?: React.ReactNode;
  };
  if (view.kind === "list") {
    headerProps = {
      eyebrow: "Documentation",
      title: "SF 600",
      subtitle: "Chronological Record of Medical Care",
      onBack: () => router.push("/tools/documentation"),
    };
  } else if (view.kind === "newPatient") {
    headerProps = {
      title: "New Patient",
      onBack: () => setView({ kind: "list" }),
    };
  } else if (view.kind === "detail") {
    headerProps = {
      title: currentPatient
        ? `${currentPatient.lastName}, ${currentPatient.firstName}`
        : "Patient",
      onBack: () => setView({ kind: "list" }),
    };
  } else {
    headerProps = {
      title: editingEntry ? "Edit Entry" : "New Entry",
      subtitle: currentPatient
        ? `${currentPatient.lastName}, ${currentPatient.firstName}`
        : undefined,
      onBack: () => view.kind === "entry"
        ? setView({ kind: "detail", patientId: view.patientId })
        : setView({ kind: "list" }),
    };
  }

  return (
    <div style={styles.app}>
      <ScreenHeader {...headerProps} />

      <div style={styles.body}>
        {!loaded ? (
          <div style={{
            padding: "40px 20px", textAlign: "center",
            fontSize: 12, color: tokens.textDim,
          }}>
            Loading{"\u2026"}
          </div>
        ) : loadError ? (
          <div style={{
            margin: "16px 0",
            background: `${tokens.red}10`,
            border: `1px solid ${tokens.red}40`,
            borderRadius: tokens.radiusMd,
            padding: "12px 14px",
          }}>
            <div style={{ fontSize: 10, color: tokens.red, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>
              Database Error
            </div>
            <div style={{ fontSize: 11, color: tokens.textSecondary, lineHeight: 1.5 }}>
              {loadError}
            </div>
          </div>
        ) : view.kind === "list" ? (
          <ListView
            provider={provider}
            patients={patients}
            entries={entries}
            onProviderChange={updateProvider}
            onSelectPatient={(id) => setView({ kind: "detail", patientId: id })}
            onNewPatient={() => setView({ kind: "newPatient" })}
            onExportBundle={exportBundle}
            onImportBundle={importBundle}
          />
        ) : view.kind === "newPatient" ? (
          <PatientForm
            onSave={createPatient}
            onCancel={() => setView({ kind: "list" })}
          />
        ) : view.kind === "detail" ? (
          currentPatient ? (
            <PatientDetail
              patient={currentPatient}
              entries={currentPatientEntries}
              onEditInfo={(d) => updatePatient(currentPatient.id, d)}
              onDelete={() => deletePatient(currentPatient.id)}
              onNewEntry={() => {
                if (!provider) {
                  showToast("err", "Set an active provider before charting.");
                  setView({ kind: "list" });
                  return;
                }
                setView({ kind: "entry", patientId: currentPatient.id });
              }}
              onEditEntry={(id) => setView({ kind: "entry", patientId: currentPatient.id, entryId: id })}
              onDeleteEntry={deleteEntry}
              onExportPdf={() => exportPatientPdf(currentPatient.id)}
            />
          ) : (
            <NotFoundMsg onBack={() => setView({ kind: "list" })} />
          )
        ) : (
          // entry view
          currentPatient && provider ? (
            <EntryForm
              patient={currentPatient}
              provider={provider}
              existing={editingEntry}
              onSave={saveEntry}
              onDone={() => setView({ kind: "detail", patientId: currentPatient.id })}
            />
          ) : (
            <NotFoundMsg onBack={() => setView({ kind: "list" })} />
          )
        )}
      </div>

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%",
          transform: "translateX(-50%)",
          background: toast.kind === "ok" ? `${tokens.green}20` : `${tokens.red}20`,
          border: `1px solid ${toast.kind === "ok" ? tokens.green : tokens.red}60`,
          color: toast.kind === "ok" ? tokens.green : tokens.red,
          padding: "8px 16px",
          borderRadius: tokens.radiusPill,
          fontSize: 12, fontWeight: 600,
          zIndex: 50,
        }}>
          {toast.text}
        </div>
      )}

      {mergeReport && (
        <ConflictReport
          report={mergeReport}
          onClose={() => setMergeReport(null)}
        />
      )}
    </div>
  );
}

// ─── List view sub-component ─────────────────────────────────────────────────

interface ListViewProps {
  provider: Provider | null;
  patients: Patient[];
  entries: Entry[];
  onProviderChange: (p: Provider | null) => void;
  onSelectPatient: (id: string) => void;
  onNewPatient: () => void;
  onExportBundle: () => void;
  onImportBundle: () => void;
}

function ListView({
  provider, patients, entries,
  onProviderChange, onSelectPatient, onNewPatient,
  onExportBundle, onImportBundle,
}: ListViewProps) {
  return (
    <>
      <StorageHealthBanner />
      <ProviderSelector provider={provider} onChange={onProviderChange} />

      <div style={{
        ...secStyle,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>Patients ({patients.length})</span>
        <button
          onClick={onNewPatient}
          disabled={!provider}
          style={{
            background: provider ? tokens.brand : tokens.bgMuted,
            border: "none",
            color: provider ? "#fff" : tokens.textGhost,
            padding: "5px 10px",
            borderRadius: tokens.radiusSm,
            fontSize: 10, fontWeight: 700,
            cursor: provider ? "pointer" : "default",
            letterSpacing: ".04em", fontFamily: "inherit",
          }}
        >
          + NEW PATIENT
        </button>
      </div>

      <PatientList
        patients={patients}
        entries={entries}
        onSelect={onSelectPatient}
      />

      <div style={secStyle}>Sync</div>
      <div style={{ fontSize: 11, color: tokens.textSecondary, lineHeight: 1.5, marginBottom: 10 }}>
        Export a JSON bundle to share with another medic, or import one they sent you. Last-write-wins by timestamp; conflicts will be reported after import.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={onExportBundle}
          style={syncBtn}
        >
          Export Bundle
        </button>
        <button
          onClick={onImportBundle}
          style={syncBtn}
        >
          Import Bundle
        </button>
      </div>
    </>
  );
}

const syncBtn = {
  flex: 1, padding: "10px 14px",
  background: tokens.bgCard,
  border: `1px solid ${tokens.borderSoft}`,
  borderRadius: tokens.radiusMd,
  color: tokens.textSecondary,
  fontSize: 12, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
} as const;

function NotFoundMsg({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: "40px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 12, color: tokens.textDim, marginBottom: 12 }}>
        Patient not found.
      </div>
      <button
        onClick={onBack}
        style={{
          background: tokens.bgCard,
          border: `1px solid ${tokens.borderSoft}`,
          borderRadius: tokens.radiusMd,
          color: tokens.textSecondary,
          padding: "8px 16px",
          fontSize: 11, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Back to list
      </button>
    </div>
  );
}
