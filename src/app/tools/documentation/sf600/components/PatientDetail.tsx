"use client";
import { useMemo, useState } from "react";
import { tokens } from "@/app/ui";
import type { Patient, Entry, Provider } from "@/app/lib/sf600/types";
import { fmtDate } from "@/app/lib/sf600/format";
import { vitalsSummary } from "@/app/lib/sf600/vitals";
import { PatientForm, type PatientDraft } from "./PatientForm";
import { AddendumForm, type AddendumDraft } from "./AddendumForm";

// PatientDetail: shows patient summary (read-only collapsed view), all
// entries for the patient, and actions for new entry / edit info / delete /
// export PDF. Each entry can carry an append-only chain of addenda - signed
// amendments from supervisors or late entries by the original author.

const secStyle = {
  fontSize: 13, fontWeight: 700, color: tokens.brand,
  textTransform: "uppercase" as const, letterSpacing: ".06em",
  padding: "14px 0 8px",
  borderBottom: `1px solid ${tokens.bgMuted}`,
  marginBottom: 10,
};

export interface PatientDetailProps {
  patient: Patient;
  entries: Entry[];
  provider: Provider | null;

  onEditInfo: (draft: PatientDraft) => Promise<void> | void;
  onDelete: () => void;
  onNewEntry: () => void;
  onEditEntry: (id: string) => void;
  onDeleteEntry: (id: string) => Promise<void> | void;
  onAddAddendum: (entryId: string, draft: AddendumDraft) => Promise<void> | void;
  onDeleteAddendum: (entryId: string, addendumId: string) => Promise<void> | void;
  onExportPdf: () => Promise<void> | void;
}

export function PatientDetail({
  patient, entries, provider,
  onEditInfo, onDelete, onNewEntry,
  onEditEntry, onDeleteEntry,
  onAddAddendum, onDeleteAddendum,
  onExportPdf,
}: PatientDetailProps) {
  const [editing, setEditing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  // entryId of the entry currently having an addendum added. null = none.
  const [addingToEntry, setAddingToEntry] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  );

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await onExportPdf();
    } catch (e) {
      setExportError((e as Error).message || "PDF export failed");
    } finally {
      setExporting(false);
    }
  };

  if (editing) {
    const initial: PatientDraft = {
      lastName: patient.lastName,
      firstName: patient.firstName,
      middleName: patient.middleName,
      idNumber: patient.idNumber,
      sex: patient.sex,
      dob: patient.dob,
      rankGrade: patient.rankGrade,
    };
    return (
      <div>
        <div style={secStyle}>Edit Patient</div>
        <PatientForm
          initial={initial}
          submitLabel="Save Changes"
          onSave={async (draft) => {
            await onEditInfo(draft);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div style={secStyle}>Patient</div>
      <div style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.borderSoft}`,
        borderRadius: tokens.radiusMd,
        padding: "12px 14px",
      }}>
        <SummaryRow k="Name" v={`${patient.lastName}, ${patient.firstName}${patient.middleName ? " " + patient.middleName : ""}`} />
        <SummaryRow k="ID No / SSN" v={patient.idNumber || ""} />
        <SummaryRow k="Sex" v={patient.sex || ""} />
        <SummaryRow k="DOB" v={patient.dob || ""} />
        <SummaryRow k="Rank / Grade" v={patient.rankGrade || ""} last />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => setEditing(true)}
          style={detailBtn(tokens.textSecondary, tokens.borderSoft)}
        >
          Edit Info
        </button>
        <button
          onClick={handleExport}
          disabled={exporting || sorted.length === 0}
          style={{
            ...detailBtn(sorted.length === 0 ? tokens.textGhost : tokens.brand, `${tokens.brand}40`),
            cursor: exporting || sorted.length === 0 ? "default" : "pointer",
            opacity: exporting ? 0.6 : 1,
          }}
        >
          {exporting ? "Exporting..." : "Export PDF"}
        </button>
        <button
          onClick={onDelete}
          style={detailBtn(tokens.red, `${tokens.red}40`)}
        >
          Delete
        </button>
      </div>

      {exportError && (
        <div style={{
          marginTop: 8,
          background: `${tokens.red}10`,
          border: `1px solid ${tokens.red}30`,
          borderRadius: tokens.radiusSm + 1,
          padding: "8px 12px",
          fontSize: 11,
          color: tokens.red,
        }}>
          {exportError}
        </div>
      )}

      <div style={{
        ...secStyle,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>Entries ({sorted.length})</span>
        <button
          onClick={onNewEntry}
          style={{
            background: tokens.brand, border: "none", color: "#fff",
            padding: "5px 10px",
            borderRadius: tokens.radiusSm,
            fontSize: 10, fontWeight: 700,
            cursor: "pointer", letterSpacing: ".04em", fontFamily: "inherit",
          }}
        >
          + NEW ENTRY
        </button>
      </div>

      {sorted.length === 0 ? (
        <div style={{
          padding: "28px 20px", textAlign: "center", fontSize: 12,
          color: tokens.textDim,
          border: `1px dashed ${tokens.borderSoft}`,
          borderRadius: tokens.radiusMd,
        }}>
          No entries yet.
        </div>
      ) : (
        sorted.map((e) => {
          const vs = vitalsSummary(e);
          const addenda = e.addenda ?? [];
          const hasAddenda = addenda.length > 0;
          return (
            <div
              key={e.id}
              style={{
                background: tokens.bgCard,
                // Subtle accent border on entries with addenda so the chain
                // is visible at a glance from the patient list scroll.
                border: hasAddenda
                  ? `1px solid ${tokens.brand}40`
                  : `1px solid ${tokens.borderSoft}`,
                borderRadius: tokens.radiusMd,
                padding: 12, marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 10, color: tokens.textMuted, fontFamily: "monospace" }}>
                    {fmtDate(e.date)}
                  </div>
                  {hasAddenda && (
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: tokens.brand,
                      background: `${tokens.brand}10`,
                      border: `1px solid ${tokens.brand}40`,
                      padding: "2px 6px",
                      borderRadius: 10,
                      letterSpacing: ".06em",
                      fontFamily: "monospace",
                    }}>
                      {addenda.length} CS
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => onEditEntry(e.id)}
                    style={inlineBtn(tokens.textSecondary)}
                    // Editing the original entry after addenda exist is allowed
                    // (medic may need to fix a typo), but we surface a soft
                    // warning via title so the medic at least sees the chain
                    // before they pop into the editor.
                    title={hasAddenda
                      ? `This entry has ${addenda.length} addend${addenda.length === 1 ? "um" : "a"}. Editing may invalidate the review chain.`
                      : undefined}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteEntry(e.id)}
                    style={inlineBtn(tokens.red)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {vs && (
                <div style={{
                  fontSize: 10, color: tokens.brand,
                  fontFamily: "monospace",
                  background: `${tokens.brand}10`,
                  padding: "4px 8px",
                  borderRadius: 6, marginBottom: 6,
                  letterSpacing: ".02em",
                }}>
                  {vs}
                </div>
              )}
              {e.narrative && (
                <div style={{
                  fontSize: 12, color: tokens.textPrimary,
                  whiteSpace: "pre-wrap", lineHeight: 1.5,
                  fontFamily: "'Menlo', ui-monospace, monospace",
                }}>
                  {e.narrative}
                </div>
              )}
              <div style={{
                fontSize: 10, color: tokens.textFaint, marginTop: 8,
                borderTop: `1px solid ${tokens.borderHair}`, paddingTop: 6,
              }}>
                {e.signedBy}{e.treatingOrganization ? ` \u00b7 ${e.treatingOrganization}` : ""}
              </div>

              {/* Addenda chain. Append-only, immutable post-sign. Each renders
                  inside the entry as a nested block with a brand-colored left
                  edge so the chain is visually distinct from the original. */}
              {addenda.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    marginTop: 10,
                    padding: "8px 12px",
                    background: `${tokens.brand}08`,
                    borderLeft: `2px solid ${tokens.brand}`,
                    borderRadius: `0 ${tokens.radiusSm}px ${tokens.radiusSm}px 0`,
                  }}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 4,
                  }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: tokens.brand,
                      textTransform: "uppercase", letterSpacing: ".08em",
                    }}>
                      Addendum {i + 1}
                    </span>
                    <span style={{
                      fontSize: 9, color: tokens.textDim,
                      fontFamily: "monospace",
                    }}>
                      {fmtDate(new Date(a.signedAt).toISOString())}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 12, color: tokens.textPrimary,
                    whiteSpace: "pre-wrap", lineHeight: 1.5,
                    fontFamily: "'Menlo', ui-monospace, monospace",
                    marginBottom: 4,
                  }}>
                    {a.text}
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 10, color: tokens.textMuted,
                    borderTop: `1px solid ${tokens.brand}20`,
                    paddingTop: 4,
                  }}>
                    <span>
                      {a.signedBy}{a.signedUnit ? ` \u00b7 ${a.signedUnit}` : ""}
                    </span>
                    <button
                      onClick={() => onDeleteAddendum(e.id, a.id)}
                      style={{
                        ...inlineBtn(tokens.red),
                        fontSize: 9,
                        opacity: 0.7,
                      }}
                      title="Delete this addendum"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Add-addendum button. Disabled until a provider is selected
                  since the addendum signature defaults to the active provider.
                  Anyone with the chart can add an addendum - no self-block,
                  since the original author legitimately needs to add late
                  entries to their own notes. */}
              <button
                onClick={() => setAddingToEntry(e.id)}
                disabled={!provider}
                style={{
                  width: "100%",
                  padding: "7px",
                  marginTop: 10,
                  background: "transparent",
                  border: `1px dashed ${provider ? `${tokens.brand}66` : tokens.borderSoft}`,
                  borderRadius: tokens.radiusSm,
                  color: provider ? tokens.brand : tokens.textGhost,
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: ".04em",
                  cursor: provider ? "pointer" : "default",
                  textTransform: "uppercase",
                  fontFamily: "inherit",
                }}
                title={provider ? undefined : "Set an active provider first"}
              >
                + Add Addendum
              </button>
            </div>
          );
        })
      )}

      {/* Add-addendum modal. Reuses the same provider as the entry-level
          default but the medic can edit name/unit on the fly so a second
          medic on the same device can sign without first changing the global
          provider. */}
      {addingToEntry && provider && (
        <AddendumForm
          parentEntry={sorted.find((e) => e.id === addingToEntry) ?? null}
          defaultSignedBy={provider.name}
          defaultSignedUnit={provider.unit}
          onSubmit={async (draft) => {
            await onAddAddendum(addingToEntry, draft);
            setAddingToEntry(null);
          }}
          onCancel={() => setAddingToEntry(null)}
        />
      )}
    </>
  );
}

function SummaryRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "6px 0",
      borderBottom: last ? "none" : `1px solid ${tokens.borderHair}`,
    }}>
      <span style={{
        fontSize: 10, color: tokens.textDim,
        letterSpacing: ".03em", textTransform: "uppercase",
      }}>
        {k}
      </span>
      <span style={{
        fontSize: 12,
        color: v ? tokens.textPrimary : tokens.textGhost,
        fontFamily: v ? "inherit" : "monospace",
      }}>
        {v || "\u2014"}
      </span>
    </div>
  );
}

function detailBtn(color: string, borderColor: string) {
  return {
    flex: 1, padding: "9px",
    background: "transparent",
    border: `1px solid ${borderColor}`,
    borderRadius: tokens.radiusMd,
    color,
    fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  } as const;
}

function inlineBtn(color: string) {
  return {
    background: "transparent", border: "none",
    color, fontSize: 10, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", padding: 0,
  } as const;
}
