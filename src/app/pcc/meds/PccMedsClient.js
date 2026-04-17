"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../../components";
import { MED_CATEGORIES, MEDICATIONS } from "../../data/medications";
import { Card, ScreenHeader, PillTab, SecLabel, Badge, styles, tokens } from "../../ui";

// PCC Meds page. Filters the master medication list to PCC-phase entries.
// Uses the shared UI primitives (Card, ScreenHeader, PillTab, Badge, SecLabel).

export default function PccMedsClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const pccMeds = useMemo(
    () => MEDICATIONS.filter(m => typeof m.phase === "string" && m.phase.includes("PCC")),
    []
  );

  const activeCategories = useMemo(() => {
    const ids = new Set(pccMeds.map(m => m.category));
    return [MED_CATEGORIES[0], ...MED_CATEGORIES.filter(c => c.id !== "all" && ids.has(c.id))];
  }, [pccMeds]);

  const filtered = useMemo(() => {
    let meds = pccMeds;
    if (category !== "all") meds = meds.filter(m => m.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      meds = meds.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.indication.toLowerCase().includes(q) ||
        m.route.toLowerCase().includes(q) ||
        m.dose.toLowerCase().includes(q)
      );
    }
    return meds;
  }, [pccMeds, search, category]);

  const grouped = useMemo(() => {
    if (category !== "all") return null;
    const groups = {};
    filtered.forEach(m => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, [filtered, category]);

  const getCategoryInfo = (catId) => MED_CATEGORIES.find(c => c.id === catId);

  const renderCard = (med, key) => {
    const isOpen = expanded === key;
    const catInfo = getCategoryInfo(med.category);
    return (
      <Card
        key={key}
        pad={0}
        style={{
          border: `1px solid ${isOpen ? `${catInfo.color}40` : tokens.borderHair}`,
          overflow: "hidden",
        }}
      >
        <div
          onClick={() => setExpanded(isOpen ? null : key)}
          style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{med.name}</span>
              <Badge color={catInfo.color}>{med.phase}</Badge>
            </div>
            <div style={{ fontSize: 12, color: tokens.textSecondary, lineHeight: 1.5 }}>{med.dose}</div>
            <div style={{ fontSize: 11, color: tokens.textDim, marginTop: 2 }}>Route: {med.route}</div>
          </div>
          <span style={{ color: tokens.textFaint, fontSize: 12, marginTop: 2, transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>
        </div>
        {isOpen && (
          <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${tokens.borderHair}` }}>
            <div style={{ padding: "10px 0 0" }}>
              <DetailRow label="Indication" color={tokens.green} value={med.indication} />
              {med.timing && <DetailRow label="Timing" color={tokens.brand} value={med.timing} />}
              <DetailRow label="Warnings" color={tokens.red} value={med.warnings} />
              {med.pedsPerKg && (
                <DetailRow label="Pediatric" color={tokens.cyan} value={`${med.pedsPerKg} ${med.pedsUnit}/kg ${med.pedsRoute}`} />
              )}
              <DetailRow label="Notes" color={tokens.amber} value={med.notes} last />
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
        title="Medications"
        subtitle="JTS PCC CPG FY26"
        onBack={() => router.push("/pcc")}
      />

      <div ref={ref} style={styles.body}>
        <div style={{ background: `${tokens.amber}08`, border: `1px solid ${tokens.amber}18`, borderRadius: tokens.radiusMd, padding: "8px 12px", margin: "12px 0 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: tokens.amber, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
            Training Reference Only
          </div>
          <div style={{ fontSize: 10, color: tokens.textMuted, lineHeight: 1.5 }}>
            Verify all dosages against your unit SOPs and current references. Not a substitute for clinical judgment.
          </div>
        </div>

        <div style={{ padding: "8px 0" }}>
          <input
            type="text"
            placeholder="Search PCC meds, doses, indications..."
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
          {filtered.length} medication{filtered.length !== 1 ? "s" : ""}
        </div>

        {category === "all" && !search.trim() && grouped ? (
          Object.entries(grouped).map(([catId, meds]) => {
            const catInfo = getCategoryInfo(catId);
            return (
              <div key={catId} style={{ marginBottom: 16 }}>
                <SecLabel color={catInfo.color}>{catInfo.label}</SecLabel>
                {meds.map((med, index) => renderCard(med, catId + index))}
              </div>
            );
          })
        ) : (
          filtered.map((med, index) => renderCard(med, index))
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: tokens.textFaint }}>
            <div style={{ fontSize: 14 }}>No medications found</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Try a different search or category</div>
          </div>
        )}
      </div>

      <Bar active="pcc" />
    </div>
  );
}

function DetailRow({ label, color, value, last = false }) {
  return (
    <div style={{ marginBottom: last ? 0 : 10 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}
