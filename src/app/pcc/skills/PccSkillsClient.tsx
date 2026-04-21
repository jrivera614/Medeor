"use client";
import { useState, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../../components";
import { PCC_PROCEDURE_CATEGORIES, PCC_PROCEDURES } from "../../data/pccProcedures";
import { Card, PillTab, SecLabel, styles, tokens } from "../../ui";
import { ScreenHeader } from "../../ui/primitives";
import type { PccProcedure, PccProcedureCategory, PccProcedureCategoryId } from "../../data/types";

// PCC Skills & Procedures page. Mirrors the PccMedsClient pattern:
// category pill filter, search, expandable cards with section rows.
// Content is reference-layer for prolonged care. Initial surgical procedures
// (finger thoracostomy, escharotomy, fasciotomy, canthotomy) live in the
// pfc-procedures training module and are not duplicated here.

export default function PccSkillsClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PccProcedureCategoryId>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const activeCategories = useMemo<PccProcedureCategory[]>(() => {
    const ids = new Set(PCC_PROCEDURES.map(p => p.category));
    return [PCC_PROCEDURE_CATEGORIES[0], ...PCC_PROCEDURE_CATEGORIES.filter(c => c.id !== "all" && ids.has(c.id))];
  }, []);

  const filtered = useMemo<PccProcedure[]>(() => {
    let procs = PCC_PROCEDURES;
    if (category !== "all") procs = procs.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      procs = procs.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.indications.toLowerCase().includes(q) ||
        p.equipment.toLowerCase().includes(q) ||
        p.steps.some(s => s.toLowerCase().includes(q))
      );
    }
    return procs;
  }, [search, category]);

  const grouped = useMemo<Record<string, PccProcedure[]> | null>(() => {
    if (category !== "all") return null;
    const groups: Record<string, PccProcedure[]> = {};
    filtered.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filtered, category]);

  const getCategoryInfo = (catId: string): PccProcedureCategory | undefined =>
    PCC_PROCEDURE_CATEGORIES.find(c => c.id === catId);

  const renderCard = (proc: PccProcedure): ReactNode => {
    const isOpen = expanded === proc.id;
    const catInfo = getCategoryInfo(proc.category);
    const catColor = catInfo?.color || tokens.textMuted;
    return (
      <Card
        key={proc.id}
        pad={0}
        style={{
          border: `1px solid ${isOpen ? `${catColor}40` : tokens.borderHair}`,
          overflow: "hidden",
        }}
      >
        <div
          onClick={() => setExpanded(isOpen ? null : proc.id)}
          style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{proc.name}</span>
            </div>
            <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.5 }}>{truncate(proc.indications, 110)}</div>
          </div>
          <span style={{ color: tokens.textFaint, fontSize: 12, marginTop: 2, transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>
        </div>
        {isOpen && (
          <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${tokens.borderHair}` }}>
            <div style={{ padding: "10px 0 0" }}>
              <Section label="Indications" color={tokens.green} value={proc.indications} />
              <Section label="Contraindications" color={tokens.red} value={proc.contraindications} />
              <Section label="Equipment" color={tokens.brand} value={proc.equipment} />
              <StepsSection steps={proc.steps} />
              <Section label="Confirmation" color={tokens.cyan} value={proc.confirmation} />
              <Section label="Complications" color={tokens.amber} value={proc.complications} />
              <Section label="PCC Considerations" color={tokens.indigo} value={proc.pccNotes} />
              <Section label="Documentation" color={tokens.pink} value={proc.documentation} />
              <RefsSection refs={proc.references} />
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={styles.app}>
      <ScreenHeader
        eyebrow="PCC"
        title="Skills & Procedures"
        subtitle="JTS CPG FY26 · Reference"
        onBack={() => router.push("/pcc")}
      />

      <div ref={ref} style={styles.body}>
        <div style={{ background: `${tokens.amber}08`, border: `1px solid ${tokens.amber}18`, borderRadius: tokens.radiusMd, padding: "8px 12px", margin: "12px 0 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: tokens.amber, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
            Training Reference Only
          </div>
          <div style={{ fontSize: 10, color: tokens.textMuted, lineHeight: 1.5 }}>
            Verify against current unit SOPs, JTS CPGs, and telemedicine guidance. Not a substitute for clinical judgment or hands-on training.
          </div>
        </div>

        <div style={{ padding: "8px 0" }}>
          <input
            type="text"
            placeholder="Search procedures, indications, equipment..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, fontSize: 13, padding: "10px 14px" }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "6px 0 12px", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {activeCategories.map(cat => (
            <PillTab
              key={cat.id}
              active={category === cat.id}
              color={cat.color}
              onClick={() => { setCategory(cat.id); setExpanded(null); }}
            >
              {cat.label}
            </PillTab>
          ))}
        </div>

        <div style={{ fontSize: 11, color: tokens.textFaint, marginBottom: 8 }}>
          {filtered.length} procedure{filtered.length !== 1 ? "s" : ""}
        </div>

        {category === "all" && !search.trim() && grouped ? (
          Object.entries(grouped).map(([catId, procs]) => {
            const catInfo = getCategoryInfo(catId);
            if (!catInfo) return null;
            return (
              <div key={catId} style={{ marginBottom: 16 }}>
                <SecLabel color={catInfo.color}>{catInfo.label}</SecLabel>
                {procs.map(p => renderCard(p))}
              </div>
            );
          })
        ) : (
          filtered.map(p => renderCard(p))
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: tokens.textFaint }}>
            <div style={{ fontSize: 14 }}>No procedures found</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Try a different search or category</div>
          </div>
        )}
      </div>

      <Bar active="pcc" />
    </div>
  );
}

function truncate(text: string, len: number): string {
  if (text.length <= len) return text;
  return text.slice(0, len).trimEnd() + "...";
}

interface SectionProps {
  label: string;
  color: string;
  value: string;
  last?: boolean;
}

function Section({ label, color, value, last = false }: SectionProps) {
  return (
    <div style={{ marginBottom: last ? 0 : 10 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function StepsSection({ steps }: { steps: string[] }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: tokens.brand, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>
        Steps
      </div>
      <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#ccc", lineHeight: 1.55 }}>
        {steps.map((s, i) => (
          <li key={i} style={{ marginBottom: 4 }}>{s}</li>
        ))}
      </ol>
    </div>
  );
}

function RefsSection({ refs }: { refs: string[] }) {
  if (!refs || refs.length === 0) return null;
  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: tokens.textDim, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>
        References
      </div>
      <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.5 }}>
        {refs.join(" · ")}
      </div>
    </div>
  );
}
