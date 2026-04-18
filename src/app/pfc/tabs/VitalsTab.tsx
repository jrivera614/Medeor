"use client";
import { Dispatch, SetStateAction } from "react";
import { S } from "../../components";
import { EYE_OPTS, VERBAL_OPTS, MOTOR_OPTS, AVPU_OPTS, calcGCS, calcMAP, calcSI } from "../constants";
import { Field, SelectorRow, NumField, secStyle } from "../components/Fields";
import { smallInput } from "../styles";
import type { VitalSet } from "../types";

interface VitalsTabProps {
  vitals: VitalSet[];
  setVitals: Dispatch<SetStateAction<VitalSet[]>>;
  addVital: () => void;
  updateVital: (index: number, key: keyof VitalSet, value: string) => void;
}

export default function VitalsTab({ vitals, setVitals, addVital, updateVital }: VitalsTabProps) {
  return (
    <>
      <div style={secStyle}>Vital Signs</div>
      <button
        onClick={addVital}
        style={{ ...S.btn("#8b5cf6", true), marginBottom: 14, padding: "10px 16px", fontSize: 13 }}
      >
        + Record Vitals
      </button>
      {vitals.length === 0 && (
        <div style={{ color: "#555", fontSize: 13, padding: 12 }}>No vitals recorded.</div>
      )}
      {vitals.map((vitalSet, idx) => {
        const gcs = calcGCS(vitalSet);
        const map = calcMAP(vitalSet);
        const si = calcSI(vitalSet);
        return (
          <div
            key={idx}
            style={{
              background: "#ffffff06",
              border: "1px solid #ffffff0f",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6", fontFamily: "monospace" }}>
                Set {idx + 1} — {vitalSet.time}
              </div>
              <button
                onClick={() => setVitals(prev => prev.filter((_, i) => i !== idx))}
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

            <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>
              Hemodynamics
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              <NumField label="HR" min={20} max={250} value={vitalSet.hr} onChange={val => updateVital(idx, "hr", val)} />
              <NumField label="SBP" min={40} max={300} value={vitalSet.sbp} onChange={val => updateVital(idx, "sbp", val)} />
              <NumField label="DBP" min={20} max={200} value={vitalSet.dbp} onChange={val => updateVital(idx, "dbp", val)} />
              <div style={{ flex: "1 1 22%", minWidth: 55 }}>
                <label style={{ fontSize: 9, color: "#666" }}>MAP</label>
                <div style={{ ...smallInput, background: "#ffffff04", color: map ? "#ccc" : "#444" }}>
                  {map || "auto"}
                </div>
              </div>
              <div style={{ flex: "1 1 22%", minWidth: 55 }}>
                <label style={{ fontSize: 9, color: "#666" }}>SI</label>
                <div style={{ ...smallInput, background: "#ffffff04", color: si && parseFloat(si) > 0.9 ? "#ef4444" : "#ccc" }}>
                  {si || "auto"}{si && parseFloat(si) > 0.9 ? " ⚠" : ""}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>
              Respiratory
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              <NumField label="RR" min={4} max={60} value={vitalSet.rr} onChange={val => updateVital(idx, "rr", val)} />
              <NumField label="SpO2" min={0} max={100} value={vitalSet.spo2} onChange={val => updateVital(idx, "spo2", val)} />
              <NumField label="ETCO2" min={0} max={100} value={vitalSet.etco2} onChange={val => updateVital(idx, "etco2", val)} />
              <NumField label="Temp" min={85} max={110} value={vitalSet.temp} onChange={val => updateVital(idx, "temp", val)} />
            </div>

            <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>
              Neuro (GCS: {gcs || "--"})
            </div>
            <SelectorRow opts={EYE_OPTS} value={vitalSet.eye} onChange={val => updateVital(idx, "eye", val)} label="Eye Opening (E)" />
            <SelectorRow opts={VERBAL_OPTS} value={vitalSet.verbal} onChange={val => updateVital(idx, "verbal", val)} label="Verbal (V)" />
            <SelectorRow opts={MOTOR_OPTS} value={vitalSet.motor} onChange={val => updateVital(idx, "motor", val)} label="Motor (M)" />
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 9, color: "#666" }}>AVPU</label>
              <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
                {AVPU_OPTS.map(avpu => (
                  <button
                    key={avpu}
                    onClick={() => updateVital(idx, "avpu", avpu)}
                    style={{
                      flex: 1,
                      padding: "6px 2px",
                      fontSize: 10,
                      borderRadius: 6,
                      border: `1px solid ${vitalSet.avpu === avpu ? "#8b5cf6" : "#ffffff14"}`,
                      background: vitalSet.avpu === avpu ? "#8b5cf618" : "transparent",
                      color: vitalSet.avpu === avpu ? "#c7c8ff" : "#888",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {avpu[0]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              <NumField label="MACE2" min={0} max={100} value={vitalSet.mace} onChange={val => updateVital(idx, "mace", val)} />
              <NumField label="Pain (0-10)" min={0} max={10} value={vitalSet.pain} onChange={val => updateVital(idx, "pain", val)} />
              <NumField label="RASS (-5/+4)" min={-5} max={4} value={vitalSet.rass} onChange={val => updateVital(idx, "rass", val)} />
            </div>

            <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>
              I/O
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <NumField label="Fluid In (ml)" min={0} value={vitalSet.fluidIn} onChange={val => updateVital(idx, "fluidIn", val)} />
              <NumField label="Urine Out (ml)" min={0} value={vitalSet.urineOut} onChange={val => updateVital(idx, "urineOut", val)} />
            </div>

            <Field label="Notes" value={vitalSet.notes} onChange={val => updateVital(idx, "notes", val)} area />
          </div>
        );
      })}
    </>
  );
}
