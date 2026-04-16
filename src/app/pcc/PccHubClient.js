"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../components";

// PCC Hub
// Pattern matches HomeClient.js tile structure exactly: S.card shell,
// 40x40 tinted icon, title/subtitle, chevron. Keeps nav on "pcc" tab.
// Content tiles show inline "coming soon" until populated. Card tile
// routes to /pcc/card which re-exports the existing PFC card component.

const TOPICS = [
  { id: "meds",     icon: "💊", title: "Medications",       sub: "Analgesia, vasoactives, abx, paralytics, blood", color: "#8b5cf6", ready: true,  route: "/pcc/meds" },
  { id: "skills",   icon: "🔧", title: "Skills & Procedures", sub: "Cric maintenance, chest tube, lines, foley",     color: "#6366f1", ready: false },
  { id: "nursing",  icon: "📋", title: "Nursing Checklist", sub: "q1h / q4h / q8h / prn care tasks",              color: "#10b981", ready: false },
  { id: "vent",     icon: "🫁", title: "Vent Management",   sub: "SAVe II, EMV+ 731, ARDS strategies",            color: "#06b6d4", ready: false },
  { id: "trouble",  icon: "⚠️", title: "Troubleshooting",   sub: "Alarms, deterioration, equipment failure",      color: "#f59e0b", ready: false },
  { id: "cpgs",     icon: "📑", title: "JTS CPGs",          sub: "PCC-specific clinical practice guidelines",     color: "#ec4899", ready: false },
  { id: "card",     icon: "🩺", title: "PCC Casualty Card", sub: "Fillable card, PDF export",                     color: "#ef4444", ready: true,  route: "/pcc/card" },
];

export default function PccHubClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [pending, setPending] = useState(null);

  const openTopic = (t) => {
    if (t.ready) {
      router.push(t.route);
      return;
    }
    setPending(t.id);
    setTimeout(() => setPending((curr) => (curr === t.id ? null : curr)), 2200);
  };

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>PROLONGED CASUALTY CARE</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>PCC Hub</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 1, textTransform: "uppercase", letterSpacing: ".04em" }}>LSCO Doctrine · JTS Aligned</div>
        </div>
      </div>

      <div ref={ref} style={S.body}>
        <div style={{ padding: "16px 0 8px" }}>
          <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>
            Medications, skills, nursing, vent management, troubleshooting, and the fillable casualty card for prolonged casualty care under LSCO conditions.
          </p>
        </div>

        {TOPICS.map((t) => (
          <div
            key={t.id}
            style={S.card}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ffffff0f"; e.currentTarget.style.borderColor = `${t.color}30`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff08"; e.currentTarget.style.borderColor = "#ffffff0f"; }}
            onClick={() => openTopic(t)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ fontSize: 22, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 11, background: `${t.color}14` }}>
                {t.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {t.title}
                  {!t.ready && <span style={{ marginLeft: 8, fontSize: 9, color: "#666", background: "#ffffff08", padding: "1px 6px", borderRadius: 4, fontWeight: 600, letterSpacing: ".04em" }}>SOON</span>}
                </div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{t.sub}</div>
                {pending === t.id && (
                  <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 4, fontWeight: 600 }}>Coming soon. Casualty Card is live now.</div>
                )}
              </div>
              <span style={{ color: "#444", fontSize: 14 }}>›</span>
            </div>
          </div>
        ))}
      </div>

      <Bar active="pcc" />
    </div>
  );
}
