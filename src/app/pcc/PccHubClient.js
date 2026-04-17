"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, Bar } from "../components";
import { Tile, ScreenHeader, styles, tokens } from "../ui";

// PCC Hub
// Tile pattern matches HomeClient exactly via the shared <Tile> primitive.
// Content tiles show inline "coming soon" until populated. Card tile routes
// to /pcc/card which re-exports the existing PFC card component.

const TOPICS = [
  { id: "meds",    icon: "💊", title: "Medications",        sub: "Analgesia, vasoactives, abx, paralytics, blood", color: tokens.brand,  ready: true,  route: "/pcc/meds" },
  { id: "skills",  icon: "🔧", title: "Skills & Procedures", sub: "Cric maintenance, chest tube, lines, foley",     color: tokens.indigo, ready: false },
  { id: "nursing", icon: "📋", title: "Nursing Checklist",   sub: "q1h / q4h / q8h / prn care tasks",              color: tokens.green,  ready: false },
  { id: "vent",    icon: "🫁", title: "Vent Management",     sub: "SAVe II, EMV+ 731, ARDS strategies",            color: tokens.cyan,   ready: false },
  { id: "trouble", icon: "⚠️", title: "Troubleshooting",     sub: "Alarms, deterioration, equipment failure",      color: tokens.amber,  ready: false },
  { id: "cpgs",    icon: "📑", title: "JTS CPGs",            sub: "PCC-specific clinical practice guidelines",     color: tokens.pink,   ready: false },
  { id: "card",    icon: "🩺", title: "PCC Casualty Card",   sub: "Fillable card, PDF export",                     color: tokens.red,    ready: true,  route: "/pcc/card" },
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
    <div style={styles.app}>
      <ScreenHeader
        eyebrow="Prolonged Casualty Care"
        title="PCC Hub"
        subtitle="LSCO Doctrine · JTS Aligned"
      />

      <div ref={ref} style={styles.body}>
        <div style={{ padding: "16px 0 8px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            Medications, skills, nursing, vent management, troubleshooting, and the fillable casualty card for prolonged casualty care under LSCO conditions.
          </p>
        </div>

        {TOPICS.map((t) => (
          <div key={t.id}>
            <Tile
              icon={t.icon}
              title={
                <>
                  {t.title}
                  {!t.ready && (
                    <span style={{ marginLeft: 8, fontSize: 9, color: tokens.textDim, background: tokens.bgCard, padding: "1px 6px", borderRadius: 4, fontWeight: 600, letterSpacing: ".04em" }}>
                      SOON
                    </span>
                  )}
                </>
              }
              subtitle={t.sub}
              color={t.color}
              onClick={() => openTopic(t)}
            />
            {pending === t.id && (
              <div style={{ fontSize: 10, color: tokens.amber, marginTop: -4, marginBottom: 8, paddingLeft: 64, fontWeight: 600 }}>
                Coming soon. Casualty Card is live now.
              </div>
            )}
          </div>
        ))}
      </div>

      <Bar active="pcc" />
    </div>
  );
}
