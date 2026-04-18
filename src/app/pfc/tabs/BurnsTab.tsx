"use client";
import { Dispatch, SetStateAction } from "react";
import { BURN_REGIONS } from "../constants";
import { secStyle } from "../components/Fields";
import { smallInput } from "../styles";
import type { Patient, BurnStates, BurnDepths } from "../types";

interface BurnsTabProps {
  patient: Patient;
  burns: BurnStates;
  setBurns: Dispatch<SetStateAction<BurnStates>>;
  burnDepth: BurnDepths;
  setBurnDepth: Dispatch<SetStateAction<BurnDepths>>;
  tbsa: number;
}

export default function BurnsTab({ patient, burns, setBurns, burnDepth, setBurnDepth, tbsa }: BurnsTabProps) {
  return (
    <>
      <div style={{ ...secStyle, display: "flex", justifyContent: "space-between" }}>
        <span>Burn Assessment</span>
        <span style={{ fontSize: 14, color: tbsa > 0 ? "#ef4444" : "#666", fontWeight: 400 }}>
          {tbsa}% TBSA
        </span>
      </div>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>
        Tap to mark burned regions. Modified Lund-Browder for adults.
      </div>
      {BURN_REGIONS.map(region => (
        <div
          key={region.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 0",
            borderBottom: "1px solid #ffffff06",
          }}
        >
          <div
            onClick={() => setBurns(prev => ({ ...prev, [region.id]: !prev[region.id] }))}
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: `2px solid ${burns[region.id] ? "#ef4444" : "#ffffff18"}`,
              background: burns[region.id] ? "#ef4444" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {burns[region.id] && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: burns[region.id] ? "#ef4444" : "#ccc" }}>{region.label}</div>
            <div style={{ fontSize: 10, color: "#666" }}>{region.pct}% TBSA</div>
          </div>
          {burns[region.id] && (
            <select
              value={burnDepth[region.id]}
              onChange={e => setBurnDepth(prev => ({ ...prev, [region.id]: e.target.value }))}
              style={{ ...smallInput, width: 110, appearance: "auto", background: "#ffffff0f" }}
            >
              <option value="">Depth</option>
              <option value="Superficial">Superficial</option>
              <option value="Partial">Partial</option>
              <option value="Full">Full Thickness</option>
            </select>
          )}
        </div>
      ))}
      {tbsa > 0 && patient.wtkg && (
        <div
          style={{
            background: "#ef444418",
            border: "1px solid #ef444440",
            borderRadius: 10,
            padding: 12,
            marginTop: 12,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444" }}>Parkland Formula</div>
          <div style={{ fontSize: 13, color: "#ccc", marginTop: 4 }}>
            4 x {patient.wtkg}kg x {tbsa}% = {(4 * parseFloat(patient.wtkg) * tbsa).toFixed(0)}ml / 24hr
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
            First 8hr: {(4 * parseFloat(patient.wtkg) * tbsa / 2).toFixed(0)}ml ({(4 * parseFloat(patient.wtkg) * tbsa / 2 / 8).toFixed(0)}ml/hr)
          </div>
        </div>
      )}
    </>
  );
}
