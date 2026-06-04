"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, Bar } from "../../components";
import { Card, SecLabel, styles, tokens } from "../../ui";
import { ScreenHeader } from "../../ui/primitives";
import { NURSING_GROUPS, NURSING_NOTE } from "../../data/nursing";

// PCC Nursing Checklist page. Shift-cadence care tasks (q1h / q2h / q4h / q8h / prn)
// for a prolonged casualty. Local check state only, resets on reload (training aid).

export default function PccNursingClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  return (
    <div style={styles.app}>
      <ScreenHeader
        eyebrow="Prolonged Casualty Care"
        eyebrowColor={tokens.green}
        title="Nursing Checklist"
        subtitle="Shift-cadence care tasks"
        onBack={() => router.push("/pcc")}
      />

      <div ref={ref} style={styles.body}>
        <div style={{ padding: "14px 0 4px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            Round-the-clock care for a prolonged casualty, grouped by how often each task is due.
          </p>
        </div>

        {NURSING_GROUPS.map((g) => {
          const done = g.items.filter((_, i) => checked[`${g.id}_${i}`]).length;
          return (
            <div key={g.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 6px" }}>
                <SecLabel color={g.color}>{g.title}</SecLabel>
                <span style={{ fontSize: 9, fontWeight: 700, color: g.color, background: `${g.color}1a`, padding: "1px 6px", borderRadius: 4, letterSpacing: ".04em" }}>
                  {g.cadence}
                </span>
                <span style={{ fontSize: 10, color: tokens.textDim, marginLeft: "auto" }}>{done}/{g.items.length}</span>
              </div>
              <Card>
                {g.items.map((item, i) => {
                  const key = `${g.id}_${i}`;
                  const on = !!checked[key];
                  return (
                    <div
                      key={key}
                      onClick={() => toggle(key)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        padding: "8px 0", cursor: "pointer",
                        borderBottom: i === g.items.length - 1 ? "none" : `1px solid ${tokens.borderHair}`,
                      }}
                    >
                      <div
                        style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                          border: `2px solid ${on ? g.color : tokens.borderSoft}`,
                          background: on ? g.color : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all .2s",
                        }}
                      >
                        {on && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.5, color: on ? tokens.textDim : tokens.textSecondary, textDecoration: on ? "line-through" : "none", transition: "all .2s" }}>
                        {item}
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          );
        })}

        <div style={{ fontSize: 11, color: tokens.textDim, lineHeight: 1.6, margin: "8px 0 4px" }}>
          {NURSING_NOTE}
        </div>
        <button
          style={{ width: "100%", marginTop: 8, padding: "12px 16px", background: tokens.bgCard, border: `1px solid ${tokens.borderHair}`, borderRadius: 10, color: tokens.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          onClick={() => setChecked({})}
        >
          Reset All
        </button>
      </div>

      <Bar active="pcc" />
    </div>
  );
}
