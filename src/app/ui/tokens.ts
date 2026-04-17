// Medeor design tokens
// Central source of truth for colors, spacing, and typography.
// To rebrand or theme the app, edit this file only.

export const tokens = {
  // Backgrounds
  bgApp:     "#0a0a0f",
  bgHeader:  "rgba(10,10,15,.97)",
  bgCard:    "#ffffff08",
  bgHover:   "#ffffff0f",
  bgMuted:   "#ffffff10",

  // Borders
  borderHair: "#ffffff0f",
  borderSoft: "#ffffff14",

  // Text
  textPrimary:   "#e8e8ed",
  textSecondary: "#aaaaaa",
  textMuted:     "#888888",
  textDim:       "#666666",
  textFaint:     "#555555",
  textGhost:     "#444444",
  textWhisper:   "#333333",

  // Brand + semantic colors
  brand:   "#8b5cf6",
  indigo:  "#6366f1",
  green:   "#10b981",
  red:     "#ef4444",
  amber:   "#f59e0b",
  cyan:    "#06b6d4",
  pink:    "#ec4899",
  blue:    "#3b82f6",

  // Typography
  fontFamily: "'DM Sans', system-ui, sans-serif",

  // Layout
  maxWidth:     480,
  radiusSm:     7,
  radiusMd:     10,
  radiusLg:     13,
  radiusPill:   20,
  radiusCircle: 9999,
};

// Common composed styles. Importers still get full control via props.
export const styles = {
  app: {
    fontFamily: tokens.fontFamily,
    background: tokens.bgApp,
    color: tokens.textPrimary,
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    maxWidth: tokens.maxWidth,
    margin: "0 auto",
    overflow: "hidden",
  },
  body: {
    flex: 1,
    padding: "0 16px 130px",
    overflowY: "auto",
    transition: "all .18s ease",
  },
};
