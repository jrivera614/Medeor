"use client";
import { useRouter } from "next/navigation";
import { useAppState, Bar } from "./components";
import { TOPICS } from "./data";
import { Tile, styles, tokens } from "./ui";
import type { TileBadge } from "./ui";

export default function HomeClient() {
  const { progress, ref } = useAppState();
  const router = useRouter();

  return (
    <div style={styles.app}>
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: `1px solid ${tokens.borderHair}`,
          background: tokens.bgHeader,
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: tokens.green, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>
            MEDEOR
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>TCCC / CLS / PFC Training</div>
          <div style={{ fontSize: 10, color: tokens.textDim, marginTop: 1, textTransform: "uppercase", letterSpacing: ".04em" }}>
            Interactive Modules
          </div>
        </div>
      </div>

      <div ref={ref} style={styles.body}>
        <div style={{ padding: "16px 0 8px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            MARCH, E-PAWS-B, RAVINES, hemorrhage control, airway management, walking blood bank, and tactical scenarios.
          </p>
        </div>

        {TOPICS.map((topic) => {
          const stepsDone = progress[`steps_${topic.id}`];
          const quizProgress = progress[`quiz_${topic.id}`];
          const flashDone = progress[`flash_${topic.id}`];
          const hasProgress = stepsDone || quizProgress || flashDone;

          const badges: TileBadge[] = [];
          if (stepsDone) badges.push({ text: "Steps", color: tokens.green });
          if (quizProgress) badges.push({ text: `Quiz ${quizProgress.score}%`, color: tokens.green });
          if (flashDone) badges.push({ text: "Cards", color: tokens.green });

          return (
            <Tile
              key={topic.id}
              icon={topic.icon}
              title={topic.title}
              subtitle={topic.subtitle}
              color={topic.color}
              checkmark={Boolean(hasProgress)}
              badges={badges}
              onClick={() => router.push(`/${topic.id}`)}
            />
          );
        })}
      </div>

      <Bar active="train" />
    </div>
  );
}
