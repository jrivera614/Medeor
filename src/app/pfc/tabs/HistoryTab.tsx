"use client";
import { Field, secStyle } from "../components/Fields";
import type { History } from "../types";

interface HistoryTabProps {
  history: History;
  updateHistory: <K extends keyof History>(key: K, value: History[K]) => void;
}

export default function HistoryTab({ history, updateHistory }: HistoryTabProps) {
  return (
    <>
      <div style={secStyle}>Medical History</div>
      <Field label="Allergies" value={history.allergies} onChange={v => updateHistory("allergies", v)} area />
      <Field label="Medications" value={history.meds} onChange={v => updateHistory("meds", v)} area />
      <Field label="Past Pertinent History" value={history.past} onChange={v => updateHistory("past", v)} area />
      <Field label="Last Oral Intake" value={history.oral} onChange={v => updateHistory("oral", v)} />
      <Field label="Events Leading to Illness/Injury" value={history.events} onChange={v => updateHistory("events", v)} area />
    </>
  );
}
