"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { TABS } from "../constants";

interface PfcLayoutProps {
  tab: number;
  setTab: (tab: number) => void;
  treatmentsDone: number;
  tbsa: number;
  exportPDF: () => void;
  children: ReactNode;
}

export default function PfcLayout({
  tab, setTab, treatmentsDone, tbsa, exportPDF, children,
}: PfcLayoutProps) {
  const router = useRouter();

  return (
    <div
      style={{
        fontFamily: "'DM Sans',system-ui,sans-serif",
        background: "#0a0a0f",
        color: "#e8e8ed",
        minHeight: "100dvh",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `.pfc-tabs::-webkit-scrollbar{display:none}` }} />

      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          zIndex: 20,
          background: "rgba(10,10,15,.97)",
          borderBottom: "1px solid #ffffff0f",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          backdropFilter: "blur(20px)",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "#ffffff0f",
            border: "none",
            color: "#888",
            fontSize: 16,
            width: 32,
            height: 32,
            borderRadius: 9,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &#8592;
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>PCC Casualty Card</div>
          <div style={{ fontSize: 9, color: "#555" }}>JTS PCC CPG | All data stored locally | Use BR# only</div>
          <div style={{ fontSize: 8, color: "#f59e0b", marginTop: 1 }}>
            Training tool only. Not a substitute for clinical judgment.
          </div>
        </div>
        <button
          onClick={exportPDF}
          style={{
            background: "#8b5cf6",
            border: "none",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: ".04em",
            fontFamily: "inherit",
          }}
        >
          EXPORT
        </button>
      </div>

      {/* Tab bar */}
      <div
        className="pfc-tabs"
        style={{
          position: "fixed",
          top: 53,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          zIndex: 19,
          display: "flex",
          overflowX: "auto",
          borderBottom: "1px solid #ffffff0f",
          background: "rgba(10,10,15,.97)",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {TABS.map((tabName, i) => (
          <button
            key={tabName}
            onClick={() => setTab(i)}
            style={{
              padding: "8px 12px",
              fontSize: 10,
              fontWeight: tab === i ? 700 : 400,
              color: tab === i ? "#8b5cf6" : "#555",
              background: tab === i ? "#8b5cf618" : "transparent",
              border: "none",
              borderBottom: tab === i ? "2px solid #8b5cf6" : "2px solid transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {tabName}
            {i === 6 && treatmentsDone > 0 && (
              <span
                style={{
                  marginLeft: 3,
                  fontSize: 8,
                  background: "#10b981",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "1px 4px",
                }}
              >
                {treatmentsDone}
              </span>
            )}
            {i === 5 && tbsa > 0 && (
              <span
                style={{
                  marginLeft: 3,
                  fontSize: 8,
                  background: "#ef4444",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "1px 4px",
                }}
              >
                {tbsa}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ paddingTop: 90, paddingBottom: 70, paddingLeft: 16, paddingRight: 16 }}>
        {children}
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
          background: "rgba(10,10,15,.97)",
          borderTop: "1px solid #ffffff08",
          zIndex: 15,
        }}
      >
        <button
          onClick={() => setTab(Math.max(0, tab - 1))}
          disabled={tab === 0}
          style={{
            padding: "7px 18px",
            background: tab === 0 ? "#ffffff06" : "#ffffff10",
            border: "none",
            borderRadius: 8,
            color: tab === 0 ? "#333" : "#aaa",
            fontSize: 12,
            fontWeight: 600,
            cursor: tab === 0 ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          &#8592; Back
        </button>
        <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>
          {tab + 1}/{TABS.length}
        </span>
        <button
          onClick={() => setTab(Math.min(TABS.length - 1, tab + 1))}
          disabled={tab === TABS.length - 1}
          style={{
            padding: "7px 18px",
            background: tab === TABS.length - 1 ? "#ffffff06" : "#8b5cf6",
            border: "none",
            borderRadius: 8,
            color: tab === TABS.length - 1 ? "#333" : "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: tab === TABS.length - 1 ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
