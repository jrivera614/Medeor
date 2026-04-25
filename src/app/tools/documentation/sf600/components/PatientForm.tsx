"use client";
import { useState } from "react";
import { tokens } from "@/app/ui";
import type { Patient } from "@/app/lib/sf600/types";

// PatientForm: flat single-screen form for creating or editing a patient.
// Density matches the PFC casualty card: tight rows, no extra section
// affordances. No patient-type toggle, no records-maintained-at, no
// relationship-to-sponsor - those fields are wasted real estate for the
// austere humanitarian use case.

const inp = {
  width: "100%", padding: "9px 12px",
  background: tokens.bgCard,
  border: `1px solid ${tokens.borderSoft}`,
  borderRadius: tokens.radiusMd,
  color: tokens.textPrimary,
  fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const,
};
const lbl = {
  fontSize: 11, color: tokens.textDim,
  display: "block" as const, marginBottom: 3, letterSpacing: ".03em",
};

export type PatientDraft = Omit<Patient, "id" | "createdAt" | "updatedAt" | "createdBy">;

export interface PatientFormProps {
  initial?: PatientDraft;
  onSave: (draft: PatientDraft) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function PatientForm({
  initial,
  onSave,
  onCancel,
  submitLabel = "Save Patient",
}: PatientFormProps) {
  const [lastName, setLastName] = useState(initial?.lastName || "");
  const [firstName, setFirstName] = useState(initial?.firstName || "");
  const [middleName, setMiddleName] = useState(initial?.middleName || "");
  const [idNumber, setIdNumber] = useState(initial?.idNumber || "");
  const [sex, setSex] = useState<Patient["sex"]>(initial?.sex || "");
  const [dob, setDob] = useState(initial?.dob || "");
  const [rankGrade, setRankGrade] = useState(initial?.rankGrade || "");

  const valid = lastName.trim() && firstName.trim();

  const submit = () => {
    if (!valid) return;
    onSave({
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      idNumber: idNumber.trim() || undefined,
      sex: sex || undefined,
      dob: dob || undefined,
      rankGrade: rankGrade.trim() || undefined,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label style={lbl}>Last Name</label>
        <input
          type="text" value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoFocus
          style={inp}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 2, minWidth: 120 }}>
          <label style={lbl}>First Name</label>
          <input
            type="text" value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inp}
          />
        </div>
        <div style={{ flex: 1, minWidth: 60 }}>
          <label style={lbl}>MI</label>
          <input
            type="text" value={middleName} maxLength={4}
            onChange={(e) => setMiddleName(e.target.value)}
            style={inp}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 2, minWidth: 120 }}>
          <label style={lbl}>ID No / SSN</label>
          <input
            type="text" value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            style={inp}
          />
        </div>
        <div style={{ flex: 1, minWidth: 60 }}>
          <label style={lbl}>Sex</label>
          <select
            value={sex || ""}
            onChange={(e) => setSex(e.target.value as Patient["sex"])}
            style={{ ...inp, colorScheme: "dark" }}
          >
            <option value="">-</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="X">X</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={lbl}>DOB</label>
          <input
            type="date" value={dob}
            onChange={(e) => setDob(e.target.value)}
            style={{ ...inp, colorScheme: "dark" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 100 }}>
          <label style={lbl}>Rank / Grade</label>
          <input
            type="text" value={rankGrade}
            onChange={(e) => setRankGrade(e.target.value)}
            style={inp}
            placeholder="SGT, E-5, CIV"
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          onClick={submit}
          disabled={!valid}
          style={{
            flex: 1, padding: "10px",
            background: valid ? tokens.brand : tokens.bgMuted,
            border: "none",
            color: valid ? "#fff" : tokens.textGhost,
            fontSize: 12, fontWeight: 700,
            borderRadius: tokens.radiusMd,
            cursor: valid ? "pointer" : "default",
            fontFamily: "inherit", letterSpacing: ".04em",
          }}
        >
          {submitLabel.toUpperCase()}
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1, padding: "10px",
            background: "transparent",
            border: `1px solid ${tokens.borderSoft}`,
            color: tokens.textMuted,
            fontSize: 12, fontWeight: 700,
            borderRadius: tokens.radiusMd,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: ".04em",
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
