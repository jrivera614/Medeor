"use client";
import { Field, secStyle } from "../components/Fields";
import { inputStyle } from "../styles";
import type { CarePlan } from "../types";

interface PpgcTabProps {
  carePlan: CarePlan;
  updateCarePlan: <K extends keyof CarePlan>(key: K, value: CarePlan[K]) => void;
}

export default function PpgcTab({ carePlan, updateCarePlan }: PpgcTabProps) {
  return (
    <>
      <div style={secStyle}>Problems / Plans / Goals / Concerns</div>
      <Field label="Problems" value={carePlan.problems} onChange={v => updateCarePlan("problems", v)} area />
      <Field label="Plans" value={carePlan.plans} onChange={v => updateCarePlan("plans", v)} area />
      <Field label="Goals" value={carePlan.goals} onChange={v => updateCarePlan("goals", v)} area />
      <Field label="Concerns" value={carePlan.concerns} onChange={v => updateCarePlan("concerns", v)} area />
      <div style={{ height: 1, background: "#ffffff10", margin: "14px 0" }} />
      <div style={secStyle}>Serial Assessment Notes</div>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>
        Running narrative: physical assessments, wake/rest plan, telemedicine recommendations, red flags, standing orders.
      </div>
      <textarea
        value={carePlan.notes || ""}
        onChange={e => updateCarePlan("notes", e.target.value)}
        rows={8}
        style={{ ...inputStyle, resize: "vertical" }}
        placeholder="Serial assessment notes..."
      />
    </>
  );
}
