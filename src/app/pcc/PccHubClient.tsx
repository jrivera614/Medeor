"use client";
import { useState, type ReactNode } from "react";
import { Pill, Scissors, Cross, ListChecks, AirVent, AlertTriangle, Files, ClipboardPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppState, Bar } from "../components";
import { Tile, styles, tokens } from "../ui";
import { ScreenHeader } from "../ui/primitives";

// PCC Hub
// Tile pattern matches HomeClient exactly via the shared <Tile> primitive.
// Content tiles show inline "coming soon" until populated. Card tile routes
// to /pcc/card which re-exports the existing PFC card component.

interface PccTopic {
  id: string;
  icon: ReactNode;
  title: string;
  sub: string;
  color: string;
  ready: boolean;
  route?: string;
}

const TOPICS: PccTopic[] = [
  { id: "meds",    icon: <Pill size={22} strokeWidth={1.75} color={tokens.brand} />,  title: "Medications",        sub: "Analgesia, vasoactives, abx, paralytics, blood", color: tokens.brand,  ready: true,  route: "/pcc/meds" },
  { id: "skills",  icon: <Scissors size={22} strokeWidth={1.75} color={tokens.indigo} />, title: "Skills & Procedures", sub: "Foley, NG/OG, whole blood, lines, cric care",      color: tokens.indigo, ready: true,  route: "/pcc/skills" },
  { id: "wound",   icon: <Cross size={22} strokeWidth={1.75} color={tokens.pink} />,   title: "Wound Care",           sub: "Debridement, infection, burns, dressings, closure", color: tokens.pink,   ready: true,  route: "/pcc/wound" },
  { id: "nursing", icon: <ListChecks size={22} strokeWidth={1.75} color={tokens.green} />, title: "Nursing Checklist",   sub: "q1h / q4h / q8h / prn care tasks",              color: tokens.green,  ready: true,  route: "/pcc/nursing" },
  { id: "vent",    icon: <AirVent size={22} strokeWidth={1.75} color={tokens.cyan} />, title: "Vent Management",     sub: "SAVe II, EMV+ 731, ARDS strategies",            color: tokens.cyan,   ready: true,  route: "/pcc/vent" },
  { id: "trouble", icon: <AlertTriangle size={22} strokeWidth={1.75} color={tokens.amber} />, title: "Troubleshooting",     sub: "Alarms, deterioration, equipment failure",      color: tokens.amber,  ready: true,  route: "/pcc/trouble" },
  { id: "cpgs",    icon: <Files size={22} strokeWidth={1.75} color={tokens.blue} />,   title: "JTS CPGs",            sub: "Curated PCC-relevant clinical practice guidelines", color: tokens.blue,   ready: true,  route: "/pcc/cpgs" },
  { id: "card",    icon: <ClipboardPlus size={22} strokeWidth={1.75} color={tokens.red} />, title: "PCC Casualty Card",   sub: "Fillable card, PDF export",                     color: tokens.red,    ready: true,  route: "/pcc/card" },
];

export default function PccHubClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  const openTopic = (t: PccTopic) => {
    if (t.ready && t.route) {
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
