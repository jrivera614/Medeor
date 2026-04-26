"use client";
import { useState } from "react";
import { tokens } from "@/app/ui";
import type { Provider } from "@/app/lib/sf600/types";

// ProviderSelector: inline editor for the active medic identity on this
// device. Persists to localStorage (handled by parent) so the form below
// auto-fills the signedBy field on every entry.
//
// Two states: collapsed (shows current name + change button) and expanded
// (input fields for name + unit). Kept inline rather than in a modal because
// medics on tablet keyboards don't need another full-screen view.

export interface ProviderSelectorProps {
  provider: Provider | null;
  onChange: (provider: Provider | null) => void;
}

export function ProviderSelector({ provider, onChange }: ProviderSelectorProps) {
  const [editing, setEditing] = useState(!provider);
  const [name, setName] = useState(provider?.name || "");
  const [unit, setUnit] = useState(provider?.unit || "");

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      onChange(null);
    } else {
      onChange({ name: trimmed, unit: unit.trim() || undefined });
    }
    setEditing(false);
  };

  if (!editing) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px",
        background: tokens.bgCard,
        border: `1px solid ${tokens.borderSoft}`,
        borderRadius: tokens.radiusMd,
        marginBottom: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 9, color: tokens.textDim, textTransform: "uppercase",
            letterSpacing: ".06em", fontWeight: 700,
          }}>
            Active Provider
          </div>
          <div style={{ fontSize: 13, color: tokens.textPrimary, fontWeight: 600, marginTop: 2 }}>
            {provider?.name || "Not set"}
          </div>
          {provider?.unit && (
            <div style={{ fontSize: 11, color: tokens.textMuted, marginTop: 1 }}>
              {provider.unit}
            </div>
          )}
        </div>
        <button
          onClick={() => setEditing(true)}
          style={{
            background: tokens.bgHover, border: "none", color: tokens.textSecondary,
            fontSize: 10, fontWeight: 700, padding: "6px 12px",
            borderRadius: tokens.radiusSm, cursor: "pointer", fontFamily: "inherit",
            letterSpacing: ".04em", flexShrink: 0,
          }}
        >
          CHANGE
        </button>
      </div>
    );
  }

  const inp = {
    width: "100%", padding: "8px 10px",
    background: tokens.bgCard,
    border: `1px solid ${tokens.borderSoft}`,
    borderRadius: tokens.radiusSm + 1,
    color: tokens.textPrimary,
    fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const,
  };
  const lbl = {
    fontSize: 10, color: tokens.textDim,
    display: "block" as const, marginBottom: 3, letterSpacing: ".03em",
  };

  return (
    <div style={{
      padding: "12px 14px",
      background: tokens.bgCard,
      border: `1px solid ${tokens.brand}40`,
      borderRadius: tokens.radiusMd,
      marginBottom: 12,
    }}>
      <div style={{
        fontSize: 9, color: tokens.brand, textTransform: "uppercase",
        letterSpacing: ".06em", fontWeight: 700, marginBottom: 8,
      }}>
        Set Active Provider
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={lbl}>Name (typed signature)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="EVIL, MD"
          style={inp}
          autoFocus
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={lbl}>Unit / clinic (optional)</label>
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Mini-Me Memorial Clinic"
          style={inp}
        />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={save}
          disabled={!name.trim()}
          style={{
            flex: 1, padding: "8px",
            background: name.trim() ? tokens.brand : tokens.bgMuted,
            border: "none",
            color: name.trim() ? "#fff" : tokens.textGhost,
            fontSize: 11, fontWeight: 700,
            borderRadius: tokens.radiusSm + 1,
            cursor: name.trim() ? "pointer" : "default",
            fontFamily: "inherit", letterSpacing: ".04em",
          }}
        >
          SAVE
        </button>
        {provider && (
          <button
            onClick={() => {
              setName(provider.name);
              setUnit(provider.unit || "");
              setEditing(false);
            }}
            style={{
              flex: 1, padding: "8px",
              background: "transparent",
              border: `1px solid ${tokens.borderSoft}`,
              color: tokens.textMuted,
              fontSize: 11, fontWeight: 700,
              borderRadius: tokens.radiusSm + 1,
              cursor: "pointer", fontFamily: "inherit", letterSpacing: ".04em",
            }}
          >
            CANCEL
          </button>
        )}
      </div>
    </div>
  );
}
