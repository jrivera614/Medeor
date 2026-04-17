"use client";
import { Card } from "./Card";
import { tokens } from "./tokens";

// Tile: the homepage + hub tile.
// Composition: Card + tinted icon circle + title/subtitle + chevron.
// Renders as a button for proper keyboard focus and screen reader semantics.
//
// Props:
//   icon         - node (emoji, character, or <Icon />)
//   title        - string
//   subtitle     - string
//   color        - hex accent. Tints icon bg and hover border.
//   onClick      - handler
//   badges       - array of { text, color } to render under subtitle
//   checkmark    - bool. If true, green check overlay on icon (progress indicator)
//   trailing     - optional node rendered in place of the default chevron

export function Tile({ icon, title, subtitle, color = tokens.brand, onClick, badges = [], checkmark = false, trailing }) {
  return (
    <Card onClick={onClick} hoverColor={color} as="button">
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div
          style={{
            fontSize: 22,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 11,
            background: `${color}14`,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {icon}
          {checkmark && (
            <div
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 12,
                height: 12,
                borderRadius: 6,
                background: tokens.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>✓</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: 11, color: tokens.textDim, marginTop: 2 }}>{subtitle}</div>
          )}
          {badges.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {badges.map((b, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 9,
                    color: b.color || tokens.green,
                    background: `${b.color || tokens.green}14`,
                    padding: "1px 6px",
                    borderRadius: 4,
                    fontWeight: 600,
                  }}
                >
                  {b.text}
                </span>
              ))}
            </div>
          )}
        </div>
        {trailing !== undefined ? trailing : <span style={{ color: tokens.textGhost, fontSize: 14 }}>›</span>}
      </div>
    </Card>
  );
}
