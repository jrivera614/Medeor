"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader, tokens, styles } from "@/app/ui";
import { DD1380_SECTIONS, DD1380_NOTE, type DdField } from "@/app/lib/dd1380/fields";
import {
  type DdCard,
  type DdValue,
  loadCards,
  saveCard,
  deleteCard,
  deriveCardTitle,
  newCardId,
} from "@/app/lib/dd1380/db";
import { exportDd1380Pdf } from "@/app/lib/dd1380/exportPdf";

// DD 1380 client: list of saved cards + a field-driven editor. Offline via
// IndexedDB. Mechanism of injury is a multiselect (string[]); everything else
// is a string. Editor renders straight from DD1380_SECTIONS.

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

export default function Dd1380Client() {
  const router = useRouter();
  const [view, setView] = useState<View>({ kind: "list" });
  const [cards, setCards] = useState<DdCard[]>([]);
  const [draft, setDraft] = useState<Record<string, DdValue>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    loadCards()
      .then((c) => { if (alive) { setCards(c); setLoaded(true); } })
      .catch((e) => { console.warn("DD1380 load failed:", e); setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const refresh = useCallback(async () => {
    try { setCards(await loadCards()); }
    catch (e) { console.warn("DD1380 refresh failed:", e); }
  }, []);

  const openNew = () => { setDraft({}); setView({ kind: "edit", id: newCardId() }); };
  const openExisting = (c: DdCard) => { setDraft({ ...c.values }); setView({ kind: "edit", id: c.id }); };

  const setField = (fid: string, val: DdValue) => setDraft((d) => ({ ...d, [fid]: val }));

  const toggleMulti = (fid: string, opt: string) => {
    setDraft((d) => {
      const cur = Array.isArray(d[fid]) ? (d[fid] as string[]) : [];
      const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
      return { ...d, [fid]: next };
    });
  };

  const persist = useCallback(async () => {
    if (view.kind !== "edit") return;
    const existing = cards.find((c) => c.id === view.id);
    const now = Date.now();
    const createdAt = existing?.createdAt ?? now;
    const c: DdCard = {
      id: view.id,
      title: deriveCardTitle(draft, createdAt),
      values: draft,
      createdAt,
      updatedAt: now,
    };
    try { await saveCard(c); await refresh(); }
    catch (e) { console.warn("DD1380 save failed:", e); }
  }, [view, draft, cards, refresh]);

  const saveAndClose = async () => { await persist(); setView({ kind: "list" }); };

  const removeCard = async (id: string) => {
    try { await deleteCard(id); await refresh(); }
    catch (e) { console.warn("DD1380 delete failed:", e); }
  };

  const exportCurrent = async () => {
    if (view.kind !== "edit") return;
    await persist();
    const existing = cards.find((c) => c.id === view.id);
    const c: DdCard = {
      id: view.id,
      title: deriveCardTitle(draft, existing?.createdAt ?? Date.now()),
      values: draft,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
    try { await exportDd1380Pdf(c); }
    catch (e) { console.warn("DD1380 PDF export failed:", e); }
  };

  const renderField = (f: DdField) => {
    const raw = draft[f.id];
    if (f.kind === "multiselect") {
      const selected = Array.isArray(raw) ? raw : [];
      return (
        <div key={f.id} style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 11, color: tokens.textMuted, marginBottom: 6 }}>{f.label}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {f.options?.map((o) => {
              const on = selected.includes(o);
              return (
                <button
                  key={o}
                  onClick={() => toggleMulti(f.id, o)}
                  style={{
                    padding: "6px 11px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    background: on ? `${tokens.red}22` : tokens.bgCard,
                    border: `1px solid ${on ? tokens.red : tokens.borderSoft}`,
                    color: on ? tokens.red : tokens.textSecondary,
                  }}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    const val = typeof raw === "string" ? raw : "";
    return (
      <div key={f.id} style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontSize: 11, color: tokens.textMuted, marginBottom: 4 }}>
          {f.label}
          {f.hint && <span style={{ color: tokens.amber, marginLeft: 6 }}>{f.hint}</span>}
        </label>
        {f.kind === "textarea" ? (
          <textarea
            style={{ ...inputStyle, minHeight: 64, resize: "vertical", lineHeight: 1.5 }}
            placeholder={f.placeholder}
            value={val}
            onChange={(e) => setField(f.id, e.target.value)}
          />
        ) : f.kind === "select" ? (
          <select style={inputStyle} value={val} onChange={(e) => setField(f.id, e.target.value)}>
            <option value="">—</option>
            {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={f.kind === "date" ? "date" : "text"}
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
          eyebrowColor={tokens.red}
          title="TCCC Card"
          subtitle="DD 1380"
          onBack={saveAndClose}
        />
        <div style={styles.body}>
          <div style={{ padding: "12px 0" }}>
            {DD1380_SECTIONS.map((section) => (
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
              {DD1380_NOTE}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveAndClose} style={{ flex: 1, padding: "12px 16px", background: tokens.bgCard, border: `1px solid ${tokens.borderSoft}`, borderRadius: 10, color: tokens.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Save &amp; Close
              </button>
              <button onClick={exportCurrent} style={{ flex: 1, padding: "12px 16px", background: `${tokens.red}22`, border: `1px solid ${tokens.red}`, borderRadius: 10, color: tokens.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
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
        eyebrowColor={tokens.red}
        title="TCCC Cards"
        subtitle="DD 1380 casualty cards"
        onBack={() => router.push("/tools/documentation")}
      />
      <div style={styles.body}>
        <div style={{ padding: "14px 0 4px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            Fill a TCCC casualty card offline, then export a PDF to transcribe onto the official DD 1380. Cards are stored on this device only.
          </p>
        </div>

        <button onClick={openNew} style={{ width: "100%", padding: "12px 16px", background: `${tokens.red}22`, border: `1px solid ${tokens.red}`, borderRadius: 10, color: tokens.red, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", margin: "8px 0 16px" }}>
          + New Card
        </button>

        {!loaded ? (
          <div style={{ fontSize: 12, color: tokens.textDim, textAlign: "center", padding: "20px 0" }}>Loading…</div>
        ) : cards.length === 0 ? (
          <div style={{ fontSize: 12, color: tokens.textDim, textAlign: "center", padding: "20px 0", lineHeight: 1.6 }}>
            No cards yet. Tap New Card to start one.
          </div>
        ) : (
          cards.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, background: tokens.bgCard, border: `1px solid ${tokens.borderHair}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => openExisting(c)}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{c.title}</div>
                <div style={{ fontSize: 11, color: tokens.textDim, marginTop: 2 }}>
                  Updated {new Date(c.updatedAt).toLocaleString()}
                </div>
              </div>
              <button onClick={() => removeCard(c.id)} aria-label="Delete card" style={{ background: "transparent", border: "none", color: tokens.textFaint, fontSize: 16, cursor: "pointer", padding: 4 }}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
