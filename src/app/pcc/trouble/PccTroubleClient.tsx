"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, Bar } from "../../components";
import { Card, SecLabel, styles, tokens } from "../../ui";
import { ScreenHeader } from "../../ui/primitives";
import { TROUBLE_ENTRIES, DOPES, VENT_REFERENCES } from "../../data/vent";

// PCC Troubleshooting page. Vent alarm and deterioration playbook. DOPES quick
// reference up top, then one expandable card per alarm/problem with likely
// causes and the immediate action.

export default function PccTroubleClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={styles.app}>
      <ScreenHeader
        eyebrow="Prolonged Casualty Care"
        eyebrowColor={tokens.amber}
        title="Troubleshooting"
        subtitle="Alarms · deterioration · equipment"
        onBack={() => router.push("/pcc")}
      />

      <div ref={ref} style={styles.body}>
        <div style={{ padding: "14px 0 4px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            When a vented casualty deteriorates, work the problem in order. The BVM is always the fallback.
          </p>
        </div>

        <SecLabel color={tokens.red}>DOPES — First Pass</SecLabel>
        <Card>
          {DOPES.map((m) => (
            <div key={m.letter} style={{ display: "flex", gap: 11, padding: "5px 0", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 22, height: 22, borderRadius: 6, background: `${tokens.red}22`,
                  color: tokens.red, fontWeight: 700, fontSize: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                }}
              >
                {m.letter}
              </div>
              <div style={{ fontSize: 12, color: tokens.textSecondary, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: tokens.textPrimary }}>{m.term}.</span> {m.detail}
              </div>
            </div>
          ))}
        </Card>

        <SecLabel color={tokens.amber}>By Alarm / Problem</SecLabel>
        {TROUBLE_ENTRIES.map((t) => {
          const isOpen = open === t.id;
          return (
            <Card key={t.id} pad={0} hoverColor={t.color}>
              <div
                onClick={() => setOpen(isOpen ? null : t.id)}
                style={{ padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 11 }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 3, background: t.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{t.problem}</span>
                <span style={{ color: tokens.textFaint, fontSize: 13 }}>{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen && (
                <div style={{ padding: "0 14px 14px" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: t.color, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>
                    Likely causes
                  </div>
                  <div style={{ fontSize: 12, color: tokens.textSecondary, lineHeight: 1.55, marginBottom: 10 }}>{t.causes}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: tokens.green, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>
                    Action
                  </div>
                  <div style={{ fontSize: 12, color: tokens.textSecondary, lineHeight: 1.55 }}>{t.action}</div>
                </div>
              )}
            </Card>
          );
        })}

        <div style={{ fontSize: 10, color: tokens.textDim, lineHeight: 1.5, margin: "12px 0 4px" }}>
          {VENT_REFERENCES}
        </div>
      </div>

      <Bar active="pcc" />
    </div>
  );
}
