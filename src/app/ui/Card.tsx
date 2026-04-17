"use client";
import { CSSProperties, ReactNode, MouseEvent } from "react";
import { tokens } from "./tokens";

// Card: reusable surface primitive used across hub tiles, drug cards,
// nursing checklists, vent settings, CPG links. Renders as a <div> by
// default or <button> when clickable (for accessibility).

export interface CardProps {
  children: ReactNode;
  pad?: number | string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  hoverColor?: string;
  style?: CSSProperties;
  as?: "div" | "button";
}

export function Card({ children, pad = 14, onClick, hoverColor, style, as = "div" }: CardProps) {
  const base: CSSProperties = {
    background: tokens.bgCard,
    border: `1px solid ${tokens.borderHair}`,
    borderRadius: tokens.radiusLg,
    padding: pad,
    marginBottom: 8,
    transition: "all .2s",
    cursor: onClick ? "pointer" : "default",
    // Reset button defaults when rendered as button
    ...(as === "button" ? { width: "100%", textAlign: "left", fontFamily: "inherit", color: "inherit" } : {}),
  };

  const hoverHandlers = onClick
    ? {
        onMouseEnter: (e: MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = tokens.bgHover;
          if (hoverColor) e.currentTarget.style.borderColor = `${hoverColor}30`;
        },
        onMouseLeave: (e: MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = tokens.bgCard;
          e.currentTarget.style.borderColor = tokens.borderHair;
        },
      }
    : {};

  if (as === "button") {
    return (
      <button onClick={onClick} style={{ ...base, ...style }} {...hoverHandlers}>
        {children}
      </button>
    );
  }
  return (
    <div onClick={onClick} style={{ ...base, ...style }} {...hoverHandlers}>
      {children}
    </div>
  );
}
