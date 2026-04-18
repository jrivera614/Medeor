"use client";
import { Dispatch, SetStateAction } from "react";
import { VENT_FIELDS } from "../constants";
import { Field, secStyle } from "../components/Fields";
import type { VentState } from "../types";

interface VentTabProps {
  vent: VentState;
  setVent: Dispatch<SetStateAction<VentState>>;
}

export default function VentTab({ vent, setVent }: VentTabProps) {
  return (
    <>
      <div style={secStyle}>Ventilator Settings</div>
      {VENT_FIELDS.map(field => (
        <Field
          key={field}
          label={field}
          value={vent[field]}
          onChange={v => setVent(prev => ({ ...prev, [field]: v }))}
        />
      ))}
    </>
  );
}
