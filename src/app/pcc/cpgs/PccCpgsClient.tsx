"use client";
import { useState, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../../components";
import { PCC_CPG_CATEGORIES, PCC_CPGS } from "../../data/pccCpgs";
import { Card, PillTab, SecLabel, Badge, styles, tokens } from "../../ui";
import { ScreenHeader } from "../../ui/primitives";
import type { PccCpg, PccCpgCategory, PccCpgCategoryId } from "../../data/types";

// PCC CPGs page. Curated JTS CPG list with a PCC-specific relevance blurb
// for each entry. Tap a card to expand and see the blurb; an Open PDF
// button opens the official source in a new tab.

export default function PccCpgsClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PccCpgCategoryId>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const activeCategories = useMemo<PccCpgCategory[]>(() => {
    const ids = new Set(PCC_CPGS.map(c => c.category));
    return [PCC_CPG_CATEGORIES[0], ...PCC_CPG_CATEGORIES.filter(c => c.id !== "all" && ids.has(c.id))];
  }, []);

  const filtered = useMemo<PccCpg[]>(() => {
    let cpgs = PCC_CPGS;
    if (category !== "all") cpgs = cpgs.filter(c => c.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      cpgs = cpgs.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.pccRelevance.toLowerCase().includes(q)
      );
    }
    return cpgs;
  }, [search, category]);

  const grouped = useMemo<Record<string, PccCpg[]> | null>(() => {
    if (category !== "all") return null;
    const groups: Record<string, PccCpg[]> = {};
    filtered.forEach(c => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [filtered, category]);

  const getCategoryInfo = (catId: string): PccCpgCategory | undefined =>
    PCC_CPG_CATEGORIES.find(c => c.id === catId);

  const renderCard = (cpg: PccCpg): ReactNode => {
    const isOpen = expanded === cpg.id;
    const catInfo = getCategoryInfo(cpg.category);
    const catColor = catInfo?.color || tokens.textMuted;
    return (
      <Card
        key={cpg.id}
        pad={0}
        style={{
          border: `1px solid ${isOpen ? `${catColor}40` : tokens.borderHair}`,
          overflow: "hidden",
        }}
      >
        <div
          onClick={() => setExpanded(isOpen ? null : cpg.id)}
          style={{ padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10 }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{cpg.title}</span>
              <Badge color={catColor}>{cpg.date}</Badge>
            </div>
            <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.5 }}>{truncate(cpg.pccRelevance, 110)}</div>
          </div>
          <span style={{ color: tokens.textFaint, fontSize: 12, marginTop: 2, transition: "transform .2s", transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>
        </div>
        {isOpen && (
          <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${tokens.borderHair}` }}>
            <div style={{ padding: "10px 0 12px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: catColor, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>
                Why this matters in PCC
              </div>
              <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.55 }}>{cpg.pccRelevance}</div>
            </div>
            <a
              href={cpg.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: `${catColor}18`,
                border: `1px solid ${catColor}40`,
                borderRadius: tokens.radiusSm,
                color: catColor,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              Open PDF ↗
            </a>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={styles.app}>
      <ScreenHeader
        eyebrow="PCC"
        title="JTS CPGs"
        subtitle="Curated · PCC relevant"
        onBack={() => router.push("/pcc")}
      />

      <div ref={ref} style={styles.body}>
        <div style={{ background: `${tokens.amber}08`, border: `1px solid ${tokens.amber}18`, borderRadius: tokens.radiusMd, padding: "8px 12px", margin: "12px 0 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: tokens.amber, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
            Curated for PCC
          </div>
          <div style={{ fontSize: 10, color: tokens.textMuted, lineHeight: 1.5 }}>
            Subset of JTS CPGs most critical to prolonged care decision-making. For the full library, see the main CPGs page.
          </div>
        </div>

        <div style={{ padding: "8px 0" }}>
          <input
            type="text"
            placeholder="Search CPGs by title or relevance..."
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
          {filtered.length} CPG{filtered.length !== 1 ? "s" : ""}
        </div>

        {category === "all" && !search.trim() && grouped ? (
          Object.entries(grouped).map(([catId, cpgs]) => {
            const catInfo = getCategoryInfo(catId);
            if (!catInfo) return null;
            return (
              <div key={catId} style={{ marginBottom: 16 }}>
                <SecLabel color={catInfo.color}>{catInfo.label}</SecLabel>
                {cpgs.map(c => renderCard(c))}
              </div>
            );
          })
        ) : (
          filtered.map(c => renderCard(c))
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: tokens.textFaint }}>
            <div style={{ fontSize: 14 }}>No CPGs found</div>
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
