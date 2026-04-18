"use client";
import { NURSE_ITEMS } from "../constants";
import { secStyle } from "../components/Fields";

export default function NursingTab() {
  return (
    <>
      <div style={secStyle}>Nursing Care Reminders</div>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>
        Assessment prompts for serial evaluations.
      </div>
      {NURSE_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            padding: "10px 0",
            borderBottom: "1px solid #ffffff06",
            background: i % 2 === 0 ? "#ffffff04" : "transparent",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{item.cat}</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{item.detail}</div>
        </div>
      ))}
    </>
  );
}
