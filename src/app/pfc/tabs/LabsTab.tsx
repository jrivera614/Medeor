"use client";
import { Dispatch, SetStateAction } from "react";
import { LABS } from "../constants";
import { secStyle } from "../components/Fields";
import { smallInput } from "../styles";
import type { LabResults } from "../types";

interface LabsTabProps {
  labResults: LabResults;
  setLabResults: Dispatch<SetStateAction<LabResults>>;
}

export default function LabsTab({ labResults, setLabResults }: LabsTabProps) {
  return (
    <>
      <div style={secStyle}>Lab Values</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px", gap: 0, fontSize: 10, borderBottom: "1px solid #ffffff10", padding: "4px 0" }}>
        <div style={{ fontWeight: 700, color: "#888" }}>Test</div>
        <div style={{ fontWeight: 700, color: "#888" }}>Reference</div>
        <div style={{ fontWeight: 700, color: "#888" }}>Result</div>
      </div>
      {LABS.map((lab, i) => (
        <div
          key={lab.n}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 100px 90px",
            gap: 0,
            padding: "5px 0",
            borderBottom: "1px solid #ffffff06",
            background: i % 2 === 0 ? "#ffffff04" : "transparent",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{lab.n}</div>
          <div style={{ fontSize: 10, color: "#666" }}>{lab.r}</div>
          <div>
            <input
              type="text"
              value={labResults[lab.n]}
              onChange={e => setLabResults(prev => ({ ...prev, [lab.n]: e.target.value }))}
              style={smallInput}
            />
          </div>
        </div>
      ))}
    </>
  );
}
