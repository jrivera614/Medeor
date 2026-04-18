"use client";
import { Dispatch, SetStateAction } from "react";
import { Prog } from "../../components";
import { TX_ITEMS, PRIORITIES } from "../constants";
import { secStyle } from "../components/Fields";
import type { TreatmentChecks, TreatmentTimes, PriorityStates } from "../types";

interface TreatmentTabProps {
  checks: TreatmentChecks;
  checkTimes: TreatmentTimes;
  toggleTreatment: (item: string) => void;
  priorities: PriorityStates;
  setPriorities: Dispatch<SetStateAction<PriorityStates>>;
  treatmentsDone: number;
  prioritiesDone: number;
}

export default function TreatmentTab({
  checks, checkTimes, toggleTreatment,
  priorities, setPriorities,
  treatmentsDone, prioritiesDone,
}: TreatmentTabProps) {
  return (
    <>
      <div style={{ ...secStyle, display: "flex", justifyContent: "space-between" }}>
        <span>Treatment Checklist</span>
        <span style={{ fontSize: 12, color: treatmentsDone === TX_ITEMS.length ? "#10b981" : "#666", fontWeight: 400 }}>
          {treatmentsDone}/{TX_ITEMS.length}
        </span>
      </div>
      <Prog c={treatmentsDone} t={TX_ITEMS.length} />
      <div style={{ marginTop: 10 }}>
        {TX_ITEMS.map(item => (
          <div
            key={item}
            onClick={() => toggleTreatment(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 0",
              borderBottom: "1px solid #ffffff06",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: `2px solid ${checks[item] ? "#10b981" : "#ffffff18"}`,
                background: checks[item] ? "#10b981" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {checks[item] && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 13,
                color: checks[item] ? "#666" : "#ccc",
                textDecoration: checks[item] ? "line-through" : "none",
              }}
            >
              {item}
            </div>
            {checkTimes[item] && (
              <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>{checkTimes[item]}</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ ...secStyle, display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <span>Priorities</span>
        <span style={{ fontSize: 12, color: prioritiesDone === PRIORITIES.length ? "#10b981" : "#666", fontWeight: 400 }}>
          {prioritiesDone}/{PRIORITIES.length}
        </span>
      </div>
      <Prog c={prioritiesDone} t={PRIORITIES.length} />
      <div style={{ marginTop: 10 }}>
        {PRIORITIES.map(pItem => (
          <div
            key={pItem}
            onClick={() => setPriorities(prev => ({ ...prev, [pItem]: !prev[pItem] }))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid #ffffff06",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                border: `2px solid ${priorities[pItem] ? "#8b5cf6" : "#ffffff18"}`,
                background: priorities[pItem] ? "#8b5cf6" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {priorities[pItem] && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>&#10003;</span>}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 12,
                color: priorities[pItem] ? "#666" : "#bbb",
                textDecoration: priorities[pItem] ? "line-through" : "none",
              }}
            >
              {pItem}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
