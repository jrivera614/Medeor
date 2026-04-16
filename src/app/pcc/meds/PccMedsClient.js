"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../../components";
import { MED_CATEGORIES, MEDICATIONS } from "../../data/medications";

// PCC Meds page. Filters the master medication list to PCC-phase entries
// (phase string contains "PCC"), preserving the same card expansion UX
// used in MedsClient.js. Keeps the "pcc" bottom nav tab active so the
// user's mental location in the app is clear.

export default function PccMedsClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState(null);

  // Base list: everything tagged with PCC in the phase field.
  // Covers "PCC", "PCC/PFC", and any future combo like "TCCC/PCC".
  const pccMeds = useMemo(
    () => MEDICATIONS.filter(m => typeof m.phase === "string" && m.phase.includes("PCC")),
    []
  );

  // Restrict the category pill bar to categories that actually have
  // PCC-phase drugs in them. Avoids empty-state click-throughs.
  const activeCategories = useMemo(() => {
    const ids = new Set(pccMeds.map(m => m.category));
    return [MED_CATEGORIES[0], ...MED_CATEGORIES.filter(c => c.id !== "all" && ids.has(c.id))];
  }, [pccMeds]);

  const filtered = useMemo(() => {
    let meds = pccMeds;
    if (category !== "all") {
      meds = meds.filter(m => m.category === category);
    }
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
      <div key={key} style={{ background: "#ffffff08", border: `1px solid ${isOpen ? catInfo.color + "40" : "#ffffff0f"}`, borderRadius: 12, padding: 0, marginBottom: 8, overflow: "hidden", transition: "all .2s" }}>
        <div onClick={() => setExpanded(isOpen ? null : key)} style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e8ed" }}>{med.name}</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: catInfo.color, background: catInfo.color + "18", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".04em" }}>{med.phase}</span>
            </div>
            <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5 }}>{med.dose}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Route: {med.route}</div>
          </div>
          <span style={{ color: "#555", fontSize: 12, marginTop: 2, transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>
        </div>
        {isOpen && (
          <div style={{ padding: "0 14px 14px", borderTop: "1px solid #ffffff0a" }}>
            <div style={{ padding: "10px 0 0" }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Indication</div>
                <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{med.indication}</div>
              </div>
              {med.timing && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Timing</div>
                  <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{med.timing}</div>
                </div>
              )}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Warnings</div>
                <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{med.warnings}</div>
              </div>
              {med.pedsPerKg && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Pediatric</div>
                  <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{med.pedsPerKg} {med.pedsUnit}/kg {med.pedsRoute}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Notes</div>
                <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>{med.notes}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={S.app}>
      <div style={{ ...S.hdr, display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => router.push("/pcc")} style={S.back} aria-label="Back to PCC hub">&#8592;</button>
        <div>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>PCC</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Medications</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 1, textTransform: "uppercase", letterSpacing: ".04em" }}>JTS PCC CPG FY26</div>
        </div>
      </div>
      <div ref={ref} style={S.body}>
        <div style={{ background: "#f59e0b08", border: "1px solid #f59e0b18", borderRadius: 10, padding: "8px 12px", margin: "12px 0 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Training Reference Only</div>
          <div style={{ fontSize: 10, color: "#888", lineHeight: 1.5 }}>Verify all dosages against your unit SOPs and current references. Not a substitute for clinical judgment.</div>
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
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setExpanded(null); }}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                border: `1px solid ${category === cat.id ? cat.color : "#ffffff14"}`,
                background: category === cat.id ? cat.color + "18" : "transparent",
                color: category === cat.id ? cat.color : "#888",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>{filtered.length} medication{filtered.length !== 1 ? "s" : ""}</div>

        {category === "all" && !search.trim() && grouped ? (
          Object.entries(grouped).map(([catId, meds]) => {
            const catInfo = getCategoryInfo(catId);
            return (
              <div key={catId} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: catInfo.color, textTransform: "uppercase", letterSpacing: ".05em", padding: "8px 0 6px", borderBottom: `1px solid ${catInfo.color}20`, marginBottom: 8 }}>
                  {catInfo.label}
                </div>
                {meds.map((med, index) => renderCard(med, catId + index))}
              </div>
            );
          })
        ) : (
          filtered.map((med, index) => renderCard(med, index))
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#555" }}>
            <div style={{ fontSize: 14 }}>No medications found</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Try a different search or category</div>
          </div>
        )}
      </div>
      <Bar active="pcc" />
    </div>
  );
}
