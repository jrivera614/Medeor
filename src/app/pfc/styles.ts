import type { CSSProperties } from "react";

// Shared inline style constants used across PfcClient tab components.
// Extracted from PfcClient for reuse across tab files.

export const labelStyle: CSSProperties = {
  fontSize: 11,
  color: "#666",
  display: "block",
  marginBottom: 3,
  letterSpacing: ".03em",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "#ffffff08",
  border: "1px solid #ffffff14",
  borderRadius: 10,
  color: "#e8e8ed",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

export const smallInput: CSSProperties = {
  ...inputStyle,
  padding: "5px 8px",
  fontSize: 12,
  borderRadius: 7,
};
