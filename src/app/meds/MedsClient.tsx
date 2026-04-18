"use client";
import { useState, useMemo, ReactNode } from "react";
import { useAppState, S, Bar } from "../components";
import { MED_CATEGORIES, MEDICATIONS } from "../data/medications";
import type { MedCategory, MedCategoryId, Medication } from "../data/types";

export default function MedsClient() {
  const { ref } = useAppState();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MedCategoryId>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo<Medication[]>(() => {
    let meds: Medication[] = MEDICATIONS;
    if (category !== "all") {
      meds = meds.filter(med => med.category === category);
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      meds = meds.filter(med =>
        med.name.toLowerCase().includes(query) ||
        med.indication.toLowerCase().includes(query) ||
        med.route.toLowerCase().includes(query) ||
        med.dose.toLowerCase().includes(query)
      );
    }
    return meds;
  }, [search, category]);

  const grouped = useMemo<Record<string, Medication[]> | null>(() => {
    if (category !== "all") return null;
    const groups: Record<string, Medication[]> = {};
    filtered.forEach(med => {
      if (!groups[med.category]) groups[med.category] = [];
      groups[med.category].push(med);
    });
    return groups;
  }, [filtered, category]);

  const getCategoryInfo = (catId: string): MedCategory | undefined =>
    MED_CATEGORIES.find(c => c.id === catId);

  const renderCard = (med: Medication, index: string | number): ReactNode => {
    const key = med.name + index;
    const isOpen = expanded === key;
    const catInfo = getCategoryInfo(med.category);
    const catColor = catInfo?.color || "#888";
    return (
      <div key={key} style={{background:"#ffffff08",border:`1px solid ${isOpen ? catColor + "40" : "#ffffff0f"}`,borderRadius:12,padding:0,marginBottom:8,overflow:"hidden",transition:"all .2s"}}>
        <div onClick={() => setExpanded(isOpen ? null : key)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:14,fontWeight:600,color:"#e8e8ed"}}>{med.name}</span>
              <span style={{fontSize:8,fontWeight:700,color:catColor,background:catColor+"18",padding:"1px 6px",borderRadius:4,textTransform:"uppercase",letterSpacing:".04em"}}>{med.phase}</span>
            </div>
            <div style={{fontSize:12,color:"#aaa",lineHeight:1.5}}>{med.dose}</div>
            <div style={{fontSize:11,color:"#666",marginTop:2}}>Route: {med.route}</div>
          </div>
          <span style={{color:"#555",fontSize:12,marginTop:2,transition:"transform .2s",transform:isOpen?"rotate(90deg)":"none"}}>›</span>
        </div>
        {isOpen && (
          <div style={{padding:"0 14px 14px",borderTop:"1px solid #ffffff0a"}}>
            <div style={{padding:"10px 0 0"}}>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:9,fontWeight:700,color:"#10b981",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Indication</div>
                <div style={{fontSize:12,color:"#ccc",lineHeight:1.5}}>{med.indication}</div>
              </div>
              {med.timing && (
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Timing</div>
                  <div style={{fontSize:12,color:"#ccc",lineHeight:1.5}}>{med.timing}</div>
                </div>
              )}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:9,fontWeight:700,color:"#ef4444",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Warnings</div>
                <div style={{fontSize:12,color:"#ccc",lineHeight:1.5}}>{med.warnings}</div>
              </div>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:"#f59e0b",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Notes</div>
                <div style={{fontSize:12,color:"#ccc",lineHeight:1.5}}>{med.notes}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div>
          <div style={{fontSize:16,fontWeight:700}}>Medication Reference</div>
          <div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>TCCC / PFC / Garrison</div>
        </div>
      </div>
      <div ref={ref} style={S.body}>
        {/* Disclaimer */}
        <div style={{background:"#f59e0b08",border:"1px solid #f59e0b18",borderRadius:10,padding:"8px 12px",margin:"12px 0 8px"}}>
          <div style={{fontSize:9,fontWeight:700,color:"#f59e0b",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>Training Reference Only</div>
          <div style={{fontSize:10,color:"#888",lineHeight:1.5}}>Verify all dosages against your unit SOPs and current references. Not a substitute for clinical judgment.</div>
        </div>

        {/* Search */}
        <div style={{padding:"8px 0"}}>
          <input
            type="text"
            placeholder="Search meds, doses, indications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{...S.input,fontSize:13,padding:"10px 14px"}}
          />
        </div>

        {/* Category filter pills */}
        <div style={{display:"flex",gap:6,overflowX:"auto",padding:"6px 0 12px",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",msOverflowStyle:"none"}}>
          {MED_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setExpanded(null); }}
              style={{
                padding:"6px 12px",
                borderRadius:20,
                border:`1px solid ${category === cat.id ? cat.color : "#ffffff14"}`,
                background:category === cat.id ? cat.color + "18" : "transparent",
                color:category === cat.id ? cat.color : "#888",
                fontSize:11,
                fontWeight:600,
                cursor:"pointer",
                fontFamily:"inherit",
                whiteSpace:"nowrap",
                flexShrink:0,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{fontSize:11,color:"#555",marginBottom:8}}>{filtered.length} medication{filtered.length !== 1 ? "s" : ""}</div>

        {/* Cards */}
        {category === "all" && !search.trim() && grouped ? (
          Object.entries(grouped).map(([catId, meds]) => {
            const catInfo = getCategoryInfo(catId);
            if (!catInfo) return null;
            return (
              <div key={catId} style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:700,color:catInfo.color,textTransform:"uppercase",letterSpacing:".05em",padding:"8px 0 6px",borderBottom:`1px solid ${catInfo.color}20`,marginBottom:8}}>
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
          <div style={{textAlign:"center",padding:"40px 0",color:"#555"}}>
            <div style={{fontSize:14}}>No medications found</div>
            <div style={{fontSize:11,marginTop:4}}>Try a different search or category</div>
          </div>
        )}
      </div>
      <Bar active="meds"/>
    </div>
  );
}
