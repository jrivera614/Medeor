"use client";
import { Dispatch, SetStateAction } from "react";
import { S } from "../../components";
import { Field, secStyle } from "../components/Fields";
import type { Tourniquets, Medication } from "../types";

interface InterventionsTabProps {
  tourniquets: Tourniquets;
  updateTourniquets: <K extends keyof Tourniquets>(key: K, value: Tourniquets[K]) => void;
  meds: Medication[];
  setMeds: Dispatch<SetStateAction<Medication[]>>;
  addMed: () => void;
  updateMed: (index: number, key: keyof Medication, value: string) => void;
}

export default function InterventionsTab({
  tourniquets, updateTourniquets, meds, setMeds, addMed, updateMed,
}: InterventionsTabProps) {
  return (
    <>
      <div style={secStyle}>Tourniquets</div>
      {[1, 2, 3, 4].map(i => {
        const onKey = `t${i}on` as keyof Tourniquets;
        const cKey = `t${i}c` as keyof Tourniquets;
        return (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
            <div style={{ flex: 1 }}>
              <Field label={`TQ ${i} Time On`} value={tourniquets[onKey]} onChange={v => updateTourniquets(onKey, v)} />
            </div>
            <div style={{ flex: 1 }}>
              <Field label={`TQ ${i} Converted`} value={tourniquets[cKey]} onChange={v => updateTourniquets(cKey, v)} />
            </div>
          </div>
        );
      })}
      <div style={{ height: 1, background: "#ffffff10", margin: "10px 0" }} />
      <div style={secStyle}>TXA / Calcium</div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Field label="2g TXA Slow Push" value={tourniquets.txa} onChange={v => updateTourniquets("txa", v)} />
        </div>
        <div style={{ flex: 1 }}>
          <Field label="1g Calcium Given At" value={tourniquets.ca} onChange={v => updateTourniquets("ca", v)} />
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#555", fontStyle: "italic", marginBottom: 10 }}>
        1g elemental Ca = 10cc CaCl or 30cc Ca Gluconate
      </div>
      <div style={{ height: 1, background: "#ffffff10", margin: "10px 0" }} />
      <div style={{ ...secStyle, display: "flex", justifyContent: "space-between" }}>
        <span>Medications</span>
        <span style={{ fontSize: 12, color: "#666", fontWeight: 400 }}>{meds.length} recorded</span>
      </div>
      <button
        onClick={addMed}
        style={{ ...S.btn("#8b5cf6", true), marginBottom: 14, padding: "10px 16px", fontSize: 13 }}
      >
        + Add Medication
      </button>
      {meds.length === 0 && (
        <div style={{ color: "#555", fontSize: 13, padding: 12 }}>No medications recorded.</div>
      )}
      {meds.map((med, idx) => (
        <div
          key={idx}
          style={{
            background: "#ffffff06",
            border: "1px solid #ffffff0f",
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", fontFamily: "monospace" }}>Med {idx + 1}</div>
            <button
              onClick={() => setMeds(prev => prev.filter((_, i) => i !== idx))}
              style={{
                background: "#ef444420",
                border: "1px solid #ef444440",
                color: "#ef4444",
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Remove
            </button>
          </div>
          <Field label="Drug Name" value={med.drug} onChange={v => updateMed(idx, "drug", v)} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Field label="Dose" value={med.dose} onChange={v => updateMed(idx, "dose", v)} />
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Route" value={med.route} onChange={v => updateMed(idx, "route", v)} />
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Time" value={med.time} onChange={v => updateMed(idx, "time", v)} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
