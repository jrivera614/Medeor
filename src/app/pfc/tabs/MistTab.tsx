"use client";
import { Field, secStyle } from "../components/Fields";
import type { Mist } from "../types";

interface MistTabProps {
  mist: Mist;
  updateMist: <K extends keyof Mist>(key: K, value: Mist[K]) => void;
}

export default function MistTab({ mist, updateMist }: MistTabProps) {
  return (
    <>
      <div style={secStyle}>M.I.S.T. Report</div>
      <Field label="M - Mechanism of Injury" value={mist.m} onChange={v => updateMist("m", v)} area />
      <Field label="I - Injuries Found" value={mist.i} onChange={v => updateMist("i", v)} area />
      <Field label="S - Signs / Symptoms" value={mist.s} onChange={v => updateMist("s", v)} area />
      <Field label="T - Treatment Given" value={mist.t} onChange={v => updateMist("t", v)} area />
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Field label="Report Time" value={mist.time} onChange={v => updateMist("time", v)} />
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Reported To" value={mist.to} onChange={v => updateMist("to", v)} />
        </div>
      </div>
    </>
  );
}
