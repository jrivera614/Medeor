"use client";
import { tokens } from "./tokens";

// SecLabel: the small uppercase colored section header.
// Used at the top of each view to label content groups (e.g. "PCC Medications").

export function SecLabel({ children, color = tokens.brand }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        margin: "6px 0 8px",
      }}
    >
      {children}
    </div>
  );
}

// Badge: small pill label.
// Used for phase tags, count indicators, "SOON" flags.

export function Badge({ children, color = tokens.textDim, solid = false }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 9,
        fontWeight: 700,
        color: solid ? "#fff" : color,
        background: solid ? color : `${color}18`,
        padding: "1px 6px",
        borderRadius: 4,
        textTransform: "uppercase",
        letterSpacing: ".04em",
      }}
    >
      {children}
    </span>
  );
}

// PillTab: rounded category filter button.
// Used in the meds page category pill bar.

export function PillTab({ children, active, color = tokens.brand, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: tokens.radiusPill,
        border: `1px solid ${active ? color : tokens.borderSoft}`,
        background: active ? `${color}18` : "transparent",
        color: active ? color : tokens.textMuted,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ScreenHeader: fixed top header pattern.
// Composes: optional back button + title block + optional action button.
// Used by PCC hub, PCC meds page, and will replace headers in HomeClient & others.
//
// Props:
//   eyebrow     - small colored label above title (e.g. "PCC", "MEDEOR")
//   eyebrowColor- color for eyebrow text. Default brand purple.
//   title       - main title string
//   subtitle    - small grey subtitle
//   onBack      - if provided, shows back arrow button
//   action      - optional node rendered on the right (e.g. EXPORT button)

export function ScreenHeader({ eyebrow, eyebrowColor = tokens.brand, title, subtitle, onBack, action }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: `1px solid ${tokens.borderHair}`,
        background: tokens.bgHeader,
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            background: tokens.bgHover,
            border: "none",
            color: tokens.textMuted,
            fontSize: 16,
            width: 32,
            height: 32,
            borderRadius: tokens.radiusSm + 2,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "inherit",
            flexShrink: 0,
          }}
        >
          ←
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 11,
              color: eyebrowColor,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 10, color: tokens.textDim, marginTop: 1, textTransform: "uppercase", letterSpacing: ".04em" }}>
            {subtitle}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
