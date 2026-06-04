"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, tokens, styles } from "@/app/ui";
import { AAR_SECTIONS, AAR_SUBMIT_NOTE, type AarField } from "@/app/lib/aar/fields";
import {
  type AarReport,
  loadReports,
  saveReport,
  deleteReport,
  deriveTitle,
  newReportId,
} from "@/app/lib/aar/db";
import { exportAarPdf } from "@/app/lib/aar/exportPdf";

// AAR client: list of saved reports + a field-driven editor.
// All persistence is offline via IndexedDB (see lib/aar/db.ts). The editor
// renders straight from AAR_SECTIONS, so adding a field in fields.ts needs no
// change here.

type View = { kind: "list" } | { kind: "edit"; id: string };

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: tokens.bgCard,
  border: `1px solid ${tokens.borderSoft}`,
  borderRadius: 8,
  padding: "9px 11px",
  color: tokens.textPrimary,
  fontSize: 13,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export default function AarClient() {
  const router = useRouter();
  const [view, setView] = useState<View>({ kind: "list" });
  const [reports, setReports] = useState<AarReport[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const flash = useCallback((kind: "ok" | "err", text: string) => {
    setStatus({ kind, text });
    window.setTimeout(() => setStatus(null), 3200);
  }, []);

  useEffect(() => {
    let alive = true;
    loadReports()
      .then((r) => { if (alive) { setReports(r); setLoaded(true); } })
      .catch((e) => { console.warn("AAR load failed:", e); setLoaded(true); flash("err", "Could not load saved reports on this device."); });
    return () => { alive = false; };
  }, [flash]);

  const refresh = useCallback(async () => {
    try { setReports(await loadReports()); }
    catch (e) { console.warn("AAR refresh failed:", e); }
  }, []);

  const openNew = () => {
    setDraft({});
    setView({ kind: "edit", id: newReportId() });
  };

  const openExisting = (r: AarReport) => {
    setDraft({ ...r.values });
    setView({ kind: "edit", id: r.id });
  };

  const setField = (fid: string, val: string) =>
    setDraft((d) => ({ ...d, [fid]: val }));

  const persist = useCallback(async (): Promise<boolean> => {
    if (view.kind !== "edit") return false;
    const existing = reports.find((r) => r.id === view.id);
    const now = Date.now();
    const createdAt = existing?.createdAt ?? now;
    const r: AarReport = {
      id: view.id,
      title: deriveTitle(draft, createdAt),
      values: draft,
      createdAt,
      updatedAt: now,
    };
    try {
      await saveReport(r);
      await refresh();
      return true;
    } catch (e) {
      console.warn("AAR save failed:", e);
      flash("err", "Save failed. This device may be out of storage or in private mode.");
      return false;
    }
  }, [view, draft, reports, refresh, flash]);

  const saveAndClose = async () => {
    const ok = await persist();
    if (ok) {
      flash("ok", "Report saved.");
      setView({ kind: "list" });
    }
  };

  const removeReport = async (id: string) => {
    try { await deleteReport(id); await refresh(); flash("ok", "Report deleted."); }
    catch (e) { console.warn("AAR delete failed:", e); flash("err", "Could not delete the report."); }
  };

  const exportCurrent = async () => {
    if (view.kind !== "edit") return;
    // Minimum data check: a casualty AAR with no identifier is a documentation
    // hazard. Block export and tell the user which fields are missing.
    const missing: string[] = [];
    if (!(draft.lastName || "").trim()) missing.push("casualty last name");
    if (!(draft.last4 || "").trim()) missing.push("last 4 (SSN/DoD ID)");
    if (missing.length > 0) {
      flash("err", `Add ${missing.join(" and ")} before exporting.`);
      return;
    }
    const ok = await persist();
    if (!ok) return;
    const existing = reports.find((r) => r.id === view.id);
    const r: AarReport = {
      id: view.id,
      title: deriveTitle(draft, existing?.createdAt ?? Date.now()),
      values: draft,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
    try { await exportAarPdf(r); flash("ok", "PDF exported."); }
    catch (e) { console.warn("AAR PDF export failed:", e); flash("err", "PDF export failed."); }
  };

  const renderField = (f: AarField) => {
    const val = draft[f.id] ?? "";
    return (
      <div key={f.id} style={{ marginBottom: 12 }}>
        <label htmlFor={f.id} style={{ display: "block", fontSize: 11, color: tokens.textMuted, marginBottom: 4 }}>
          {f.label}
          {f.hint && <span style={{ color: tokens.amber, marginLeft: 6 }}>{f.hint}</span>}
        </label>
        {f.kind === "textarea" ? (
          <textarea
            id={f.id}
            style={{ ...inputStyle, minHeight: 64, resize: "vertical", lineHeight: 1.5 }}
            placeholder={f.placeholder}
            value={val}
            onChange={(e) => setField(f.id, e.target.value)}
          />
        ) : f.kind === "select" ? (
          <select id={f.id} style={inputStyle} value={val} onChange={(e) => setField(f.id, e.target.value)}>
            <option value="">—</option>
            {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            id={f.id}
            type={f.kind === "date" ? "date" : f.kind === "time" ? "time" : "text"}
            style={inputStyle}
            placeholder={f.placeholder}
            value={val}
            onChange={(e) => setField(f.id, e.target.value)}
          />
        )}
      </div>
    );
  };

  // ─── EDIT VIEW ───
  if (view.kind === "edit") {
    return (
      <div style={styles.app}>
        <ScreenHeader
          eyebrow="Documentation"
          eyebrowColor={tokens.indigo}
          title="TCCC After-Action"
          subtitle="JTS medical AAR"
          onBack={saveAndClose}
        />
        <div style={styles.body}>
        {status && (
          <div style={{ position: "sticky", top: 0, zIndex: 5, background: status.kind === "ok" ? `${tokens.green}1a` : `${tokens.red}1a`, border: `1px solid ${status.kind === "ok" ? tokens.green : tokens.red}`, borderRadius: 8, padding: "8px 12px", margin: "10px 0 0" }} role="status" aria-live="polite">
            <span style={{ fontSize: 12, fontWeight: 600, color: status.kind === "ok" ? tokens.green : tokens.red }}>{status.text}</span>
          </div>
        )}
          <div style={{ padding: "12px 0" }}>
            {AAR_SECTIONS.map((section) => (
              <div key={section.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: section.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: tokens.textPrimary }}>{section.title}</span>
                </div>
                {section.note && (
                  <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.5, margin: "2px 0 10px", paddingLeft: 18 }}>
                    {section.note}
                  </div>
                )}
                <div style={{ paddingLeft: 2 }}>
                  {section.fields.map(renderField)}
                </div>
              </div>
            ))}

            <div style={{ fontSize: 10, color: tokens.textDim, lineHeight: 1.5, margin: "4px 0 12px" }}>
              {AAR_SUBMIT_NOTE}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveAndClose} style={{ flex: 1, padding: "12px 16px", background: tokens.bgCard, border: `1px solid ${tokens.borderSoft}`, borderRadius: 10, color: tokens.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Save &amp; Close
              </button>
              <button onClick={exportCurrent} style={{ flex: 1, padding: "12px 16px", background: `${tokens.indigo}22`, border: `1px solid ${tokens.indigo}`, borderRadius: 10, color: tokens.indigo, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ───
  return (
    <div style={styles.app}>
      <ScreenHeader
        eyebrow="Documentation"
        eyebrowColor={tokens.indigo}
        title="After-Action Reports"
        subtitle="JTS TCCC AAR template"
        onBack={() => router.push("/tools/documentation")}
      />
      <div style={styles.body}>
        {status && (
          <div style={{ position: "sticky", top: 0, zIndex: 5, background: status.kind === "ok" ? `${tokens.green}1a` : `${tokens.red}1a`, border: `1px solid ${status.kind === "ok" ? tokens.green : tokens.red}`, borderRadius: 8, padding: "8px 12px", margin: "10px 0 0" }} role="status" aria-live="polite">
            <span style={{ fontSize: 12, fontWeight: 600, color: status.kind === "ok" ? tokens.green : tokens.red }}>{status.text}</span>
          </div>
        )}
        <div style={{ padding: "14px 0 4px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            Draft a TCCC after-action report offline, then export a PDF to transcribe into the official JTS submission. Reports are stored on this device only.
          </p>
        </div>

        <button onClick={openNew} style={{ width: "100%", padding: "12px 16px", background: `${tokens.indigo}22`, border: `1px solid ${tokens.indigo}`, borderRadius: 10, color: tokens.indigo, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", margin: "8px 0 16px" }}>
          + New AAR
        </button>

        {!loaded ? (
          <div style={{ fontSize: 12, color: tokens.textDim, textAlign: "center", padding: "20px 0" }}>Loading…</div>
        ) : reports.length === 0 ? (
          <div style={{ fontSize: 12, color: tokens.textDim, textAlign: "center", padding: "20px 0", lineHeight: 1.6 }}>
            No reports yet. Tap New AAR to start one.
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, background: tokens.bgCard, border: `1px solid ${tokens.borderHair}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => openExisting(r)}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{r.title}</div>
                <div style={{ fontSize: 11, color: tokens.textDim, marginTop: 2 }}>
                  Updated {new Date(r.updatedAt).toLocaleString()}
                </div>
              </div>
              <button onClick={() => removeReport(r.id)} aria-label="Delete report" style={{ background: "transparent", border: "none", color: tokens.textFaint, fontSize: 16, cursor: "pointer", padding: 4 }}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
