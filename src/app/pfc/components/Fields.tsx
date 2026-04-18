"use client";
import { CSSProperties, ReactNode } from "react";

const inp: CSSProperties = {
  width: "100%", padding: "9px 12px", background: "#ffffff08",
  border: "1px solid #ffffff14", borderRadius: 10, color: "#e8e8ed",
  fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box"
};

const smInp: CSSProperties = { ...inp, padding: "5px 8px", fontSize: 12, borderRadius: 7 };

const lblStyle: CSSProperties = {
  fontSize: 11, color: "#666", display: "block",
  marginBottom: 3, letterSpacing: ".03em"
};

export const secStyle: CSSProperties = {
  fontSize: 13, fontWeight: 700, color: "#8b5cf6",
  textTransform: "uppercase", letterSpacing: ".06em",
  padding: "14px 0 8px", borderBottom: "1px solid #ffffff10", marginBottom: 10
};

export interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
}

export function Field({ label, value, onChange, area }: FieldProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={lblStyle}>{label}</label>
      {area ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={2}
          style={{ ...inp, resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={inp}
        />
      )}
    </div>
  );
}

export interface SmallFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function SmallField({ label, value, onChange }: SmallFieldProps) {
  return (
    <div style={{ flex: "1 1 22%", minWidth: 55 }}>
      <label style={{ fontSize: 9, color: "#666" }}>{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        style={smInp}
      />
    </div>
  );
}

export interface NumFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

export function NumField({ label, value, onChange, min, max }: NumFieldProps) {
  const warn = Boolean(
    value && (isNaN(Number(value)) ||
    (min !== undefined && Number(value) < min) ||
    (max !== undefined && Number(value) > max))
  );
  return (
    <div style={{ flex: "1 1 22%", minWidth: 55 }}>
      <label style={{ fontSize: 9, color: warn ? "#ef4444" : "#666" }}>{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value || ""}
        onChange={e => {
          const v = e.target.value;
          if (v === "" || v === "-" || /^-?\d*\.?\d*$/.test(v)) onChange(v);
        }}
        style={{ ...smInp, borderColor: warn ? "#ef444480" : "#ffffff14" }}
      />
    </div>
  );
}

export interface ReadOnlyFieldProps {
  label: string;
  value: string | number | null;
  warn?: boolean;
}

export function ReadOnlyField({ label, value, warn }: ReadOnlyFieldProps) {
  return (
    <div style={{ flex: "1 1 22%", minWidth: 55 }}>
      <label style={{ fontSize: 9, color: "#666" }}>{label}</label>
      <div style={{
        ...smInp, background: "#ffffff04",
        color: warn ? "#ef4444" : value ? "#ccc" : "#444"
      }}>
        {value || "auto"}{warn ? " \u26A0" : ""}
      </div>
    </div>
  );
}

export interface SelectorRowProps {
  label: string;
  opts: Array<[string, string]>;
  value: string;
  onChange: (value: string) => void;
}

export function SelectorRow({ label, opts, value, onChange }: SelectorRowProps) {
  return (
    <div style={{ marginBottom: 6 }}>
      <label style={{ fontSize: 9, color: "#666" }}>{label}</label>
      <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
        {opts.map(([v, t]) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              flex: 1, padding: "6px 2px", fontSize: 10, borderRadius: 6,
              border: `1px solid ${value === v ? "#8b5cf6" : "#ffffff14"}`,
              background: value === v ? "#8b5cf618" : "transparent",
              color: value === v ? "#c7c8ff" : "#888",
              cursor: "pointer", fontFamily: "inherit"
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface CheckRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  time?: string;
  color?: string;
}

export function CheckRow({ label, checked, onToggle, time, color = "#10b981" }: CheckRowProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 0", borderBottom: "1px solid #ffffff06", cursor: "pointer"
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `2px solid ${checked ? color : "#ffffff18"}`,
        background: checked ? color : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all .15s"
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{"\u2713"}</span>}
      </div>
      <div style={{
        flex: 1, fontSize: 13, color: checked ? "#666" : "#ccc",
        textDecoration: checked ? "line-through" : "none", transition: "all .15s"
      }}>
        {label}
      </div>
      {time && <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>{time}</span>}
    </div>
  );
}

export interface SectionHeaderProps {
  text: ReactNode;
  right?: ReactNode;
}

export function SectionHeader({ text, right }: SectionHeaderProps) {
  return (
    <div style={{ ...secStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>{text}</span>
      {right && <span style={{ fontSize: 12, fontWeight: 400 }}>{right}</span>}
    </div>
  );
}
