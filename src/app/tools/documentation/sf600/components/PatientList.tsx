"use client";
import { tokens } from "@/app/ui";
import type { Patient, Entry } from "@/app/lib/sf600/types";
import { fmtDate } from "@/app/lib/sf600/format";

// PatientList: scrollable list of patients with last-entry timestamp.
// Sorts by most recent activity (max of patient.updatedAt vs the patient's
// most recent entry.updatedAt) so the patient you were just charting on is
// always on top.

export interface PatientListProps {
  patients: Patient[];
  entries: Entry[];
  onSelect: (id: string) => void;
}

interface PatientRow {
  patient: Patient;
  entryCount: number;
  lastTouch: number;
  lastEntryDate: string | null;
}

function buildRows(patients: Patient[], entries: Entry[]): PatientRow[] {
  // Pre-bucket entries by patientId for O(n) instead of O(n*m).
  const byPatient = new Map<string, Entry[]>();
  for (const e of entries) {
    const arr = byPatient.get(e.patientId);
    if (arr) arr.push(e);
    else byPatient.set(e.patientId, [e]);
  }

  return patients.map((p) => {
    const list = byPatient.get(p.id) || [];
    let lastTouch = p.updatedAt;
    let lastEntryDate: string | null = null;
    let mostRecentEntryTs = 0;
    for (const e of list) {
      if (e.updatedAt > lastTouch) lastTouch = e.updatedAt;
      // For display, use the entry's date (clinical timestamp), not updatedAt.
      const t = new Date(e.date).getTime();
      if (!isNaN(t) && t > mostRecentEntryTs) {
        mostRecentEntryTs = t;
        lastEntryDate = e.date;
      }
    }
    return { patient: p, entryCount: list.length, lastTouch, lastEntryDate };
  }).sort((a, b) => b.lastTouch - a.lastTouch);
}

export function PatientList({ patients, entries, onSelect }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div style={{
        padding: "32px 20px", textAlign: "center", fontSize: 12, color: tokens.textDim,
        border: `1px dashed ${tokens.borderSoft}`,
        borderRadius: tokens.radiusMd,
        marginTop: 8,
      }}>
        No patients yet. Tap NEW PATIENT to start.
      </div>
    );
  }

  const rows = buildRows(patients, entries);

  return (
    <div>
      {rows.map(({ patient: p, entryCount, lastEntryDate }) => (
        <div
          key={p.id}
          onClick={() => onSelect(p.id)}
          style={{
            background: tokens.bgCard,
            border: `1px solid ${tokens.borderSoft}`,
            borderRadius: tokens.radiusMd,
            padding: "10px 12px",
            marginBottom: 8,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: tokens.textPrimary,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {p.lastName}, {p.firstName}{p.middleName ? ` ${p.middleName}` : ""}
            </div>
            <div style={{ fontSize: 10, color: tokens.textMuted, marginTop: 2, display: "flex", gap: 8 }}>
              <span>{p.rankGrade || "\u2014"}</span>
              <span style={{ color: tokens.textGhost }}>{"\u00b7"}</span>
              <span style={{ color: entryCount > 0 ? tokens.brand : tokens.textFaint }}>
                {entryCount} {entryCount === 1 ? "entry" : "entries"}
              </span>
              {lastEntryDate && (
                <>
                  <span style={{ color: tokens.textGhost }}>{"\u00b7"}</span>
                  <span>{fmtDate(lastEntryDate)}</span>
                </>
              )}
            </div>
          </div>
          <span style={{ color: tokens.textGhost, fontSize: 14, flexShrink: 0 }}>›</span>
        </div>
      ))}
    </div>
  );
}
