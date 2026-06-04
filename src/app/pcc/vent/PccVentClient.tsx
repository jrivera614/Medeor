"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, Bar } from "../../components";
import { Card, SecLabel, styles, tokens } from "../../ui";
import { ScreenHeader } from "../../ui/primitives";
import {
  VENT_SETTINGS,
  SOAPME,
  DOPES,
  VENT_TOPICS,
  VENT_REFERENCES,
} from "../../data/vent";

// PCC Vent Management page. Initial settings reference, SOAPME setup and DOPES
// troubleshooting mnemonics, and lung-protective / oxygenation / ARDS / weaning
// reference cards. Reference layer, not a calculator.

export default function PccVentClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={styles.app}>
      <ScreenHeader
        eyebrow="Prolonged Casualty Care"
        eyebrowColor={tokens.cyan}
        title="Vent Management"
        subtitle="SAVe II · EMV+ 731 · Hamilton-T1"
        onBack={() => router.push("/pcc")}
      />

      <div ref={ref} style={styles.body}>
        <div style={{ padding: "14px 0 4px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            Managing a casualty already on a transport ventilator. Intubation and surgical airway are in the PFC Procedures module.
          </p>
        </div>

        <SecLabel color={tokens.cyan}>Initial Settings</SecLabel>
        <Card>
          {VENT_SETTINGS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "8px 0",
                borderBottom: i === VENT_SETTINGS.length - 1 ? "none" : `1px solid ${tokens.borderHair}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 13, color: tokens.textSecondary }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: tokens.cyan, textAlign: "right" }}>{s.value}</span>
              </div>
              <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.5, marginTop: 3 }}>{s.note}</div>
            </div>
          ))}
        </Card>

        <SecLabel color={tokens.indigo}>SOAPME — Setup Before You Tube</SecLabel>
        <Card>
          {SOAPME.map((m) => (
            <div key={m.letter} style={{ display: "flex", gap: 11, padding: "6px 0", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24, height: 24, borderRadius: 6, background: `${tokens.indigo}22`,
                  color: tokens.indigo, fontWeight: 700, fontSize: 13, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                }}
              >
                {m.letter}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: tokens.textPrimary }}>{m.term}</div>
                <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.5 }}>{m.detail}</div>
              </div>
            </div>
          ))}
        </Card>

        <SecLabel color={tokens.red}>DOPES — Deterioration on the Vent</SecLabel>
        <Card>
          {DOPES.map((m) => (
            <div key={m.letter} style={{ display: "flex", gap: 11, padding: "6px 0", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24, height: 24, borderRadius: 6, background: `${tokens.red}22`,
                  color: tokens.red, fontWeight: 700, fontSize: 13, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                }}
              >
                {m.letter}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: tokens.textPrimary }}>{m.term}</div>
                <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.5 }}>{m.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: tokens.amber, lineHeight: 1.5, marginTop: 8, fontWeight: 600 }}>
            When the cause is not obvious, take them off the vent and bag by hand.
          </div>
        </Card>

        <SecLabel color={tokens.brand}>Reference</SecLabel>
        {VENT_TOPICS.map((t) => {
          const isOpen = open === t.id;
          return (
            <Card key={t.id} pad={0} hoverColor={t.color}>
              <div
                onClick={() => setOpen(isOpen ? null : t.id)}
                style={{ padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 11 }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 3, background: t.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>{t.title}</span>
                <span style={{ color: tokens.textFaint, fontSize: 13 }}>{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen && (
                <div style={{ padding: "0 14px 14px", fontSize: 12, color: tokens.textSecondary, lineHeight: 1.6 }}>
                  {t.body}
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
