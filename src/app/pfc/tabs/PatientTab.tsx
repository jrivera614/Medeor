"use client";
import { Dispatch, SetStateAction } from "react";
import { Field, secStyle } from "../components/Fields";
import { labelStyle } from "../styles";
import type { Patient } from "../types";

interface PatientTabProps {
  patient: Patient;
  setPatient: Dispatch<SetStateAction<Patient>>;
  updatePatient: <K extends keyof Patient>(key: K, value: Patient[K]) => void;
}

export default function PatientTab({ patient, setPatient, updatePatient }: PatientTabProps) {
  return (
    <>
      <div style={secStyle}>Patient Information</div>
      <Field label="Name" value={patient.name} onChange={v => updatePatient("name", v)} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <div style={{ flex: "1 1 48%" }}>
          <Field label="Battle Roster # (AB1234)" value={patient.id} onChange={v => updatePatient("id", v)} />
        </div>
        <div style={{ flex: "1 1 24%" }}>
          <Field label="Date" value={patient.date} onChange={v => updatePatient("date", v)} />
        </div>
        <div style={{ flex: "1 1 24%" }}>
          <Field label="Time" value={patient.time} onChange={v => updatePatient("time", v)} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {([["Time Zone", "tz"], ["PFC Start Time", "pfcStart"]] as Array<[string, keyof Patient]>).map(([label, key]) => (
          <div key={key} style={{ flex: "1 1 30%", minWidth: 80 }}>
            <Field label={label} value={patient[key] as string} onChange={v => updatePatient(key, v as Patient[typeof key])} />
          </div>
        ))}
        <div style={{ flex: "1 1 30%", minWidth: 80 }}>
          <Field
            label="Wt kg"
            value={patient.wtkg}
            onChange={v => {
              const kg = v.replace(/[^0-9.]/g, "");
              setPatient(prev => ({
                ...prev,
                wtkg: kg,
                wtlbs: kg && !isNaN(parseFloat(kg)) ? (parseFloat(kg) * 2.205).toFixed(1) : "",
              }));
            }}
          />
        </div>
        <div style={{ flex: "1 1 30%", minWidth: 80 }}>
          <Field
            label="Wt lbs"
            value={patient.wtlbs}
            onChange={v => {
              const lbs = v.replace(/[^0-9.]/g, "");
              setPatient(prev => ({
                ...prev,
                wtlbs: lbs,
                wtkg: lbs && !isNaN(parseFloat(lbs)) ? (parseFloat(lbs) / 2.205).toFixed(1) : "",
              }));
            }}
          />
        </div>
        {([["Height", "ht"], ["Ideal Body Wt", "ibw"]] as Array<[string, keyof Patient]>).map(([label, key]) => (
          <div key={key} style={{ flex: "1 1 30%", minWidth: 80 }}>
            <Field label={label} value={patient[key] as string} onChange={v => updatePatient(key, v as Patient[typeof key])} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {([["Blood Type", "blood"], ["Titer", "titer"], ["Triage", "triage"], ["EVAC", "evac"]] as Array<[string, keyof Patient]>).map(([label, key]) => (
          <div key={key} style={{ flex: "1 1 22%" }}>
            <Field label={label} value={patient[key] as string} onChange={v => updatePatient(key, v as Patient[typeof key])} />
          </div>
        ))}
      </div>
      <label style={labelStyle}>Status</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["Stable", "Unstable"].map(status => (
          <button
            key={status}
            onClick={() => updatePatient("status", status)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: `2px solid ${patient.status === status ? (status === "Stable" ? "#10b981" : "#ef4444") : "#ffffff14"}`,
              background: patient.status === status ? (status === "Stable" ? "#10b98118" : "#ef444418") : "transparent",
              color: patient.status === status ? (status === "Stable" ? "#10b981" : "#ef4444") : "#666",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {status}
          </button>
        ))}
      </div>
    </>
  );
}
