"use client";
import { tokens } from "./tokens";

// Card: the reusable surface primitive.
// Replaces ~50+ inline copies of { background: #ffffff08, border: 1px solid #ffffff0f, borderRadius: 13, padding: 14 }
//
// Props:
//   children   - node
//   pad        - padding (number or string). Default 14.
//   onClick    - if provided, card becomes clickable with hover state
//   hoverColor - hex color for border on hover (e.g. topic.color)
//   className  - optional passthrough
//   style      - optional style override merged last
//   as         - element tag, default "div". Use "button" when clickable for accessibility.

export function Card({ children, pad = 14, onClick, hoverColor, style, as = "div" }) {
  const base = {
    background: tokens.bgCard,
    border: `1px solid ${tokens.borderHair}`,
    borderRadius: tokens.radiusLg,
    padding: pad,
    marginBottom: 8,
    transition: "all .2s",
    cursor: onClick ? "pointer" : "default",
    // Reset defaults when rendered as button
    ...(as === "button" ? { width: "100%", textAlign: "left", fontFamily: "inherit", color: "inherit" } : {}),
  };

  const hover = onClick
    ? {
        onMouseEnter: (e) => {
          e.currentTarget.style.background = tokens.bgHover;
          if (hoverColor) e.currentTarget.style.borderColor = `${hoverColor}30`;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = tokens.bgCard;
          e.currentTarget.style.borderColor = tokens.borderHair;
        },
      }
    : {};

  const Element = as;
  return (
    <Element onClick={onClick} style={{ ...base, ...style }} {...hover}>
      {children}
    </Element>
  );
}
