"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tile, ScreenHeader, styles, tokens } from "@/app/ui";

// Documentation Hub
// Mirrors PccHubClient's tile pattern (Tile + ScreenHeader). SF 600 is the
// first form to land here. DD 1380 and the JTS After-Action template followed.
// New forms go in as new entries in the TOPICS array as they're built.

interface DocTopic {
  id: string;
  icon: string;
  title: string;
  sub: string;
  color: string;
  ready: boolean;
  route?: string;
}

const TOPICS: DocTopic[] = [
  { id: "sf600",   icon: "\u{1F4DD}", title: "SF 600",          sub: "Chronological Record of Medical Care", color: tokens.brand,  ready: true, route: "/tools/documentation/sf600" },
  { id: "dd1380",  icon: "\u{1F525}", title: "DD 1380 TCCC",    sub: "Tactical Combat Casualty Care card",   color: tokens.red,    ready: true, route: "/tools/documentation/dd1380" },
  { id: "afterax", icon: "\u{1F9EA}", title: "After-Action",    sub: "JTS medical AAR template",             color: tokens.indigo, ready: true, route: "/tools/documentation/aar" },
];

export default function DocumentationHubClient() {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  const openTopic = (t: DocTopic) => {
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
        eyebrow="Tools"
        title="Documentation"
        subtitle="Patient charting forms, offline-first"
        onBack={() => router.push("/tools")}
      />

      <div style={styles.body}>
        <div style={{ padding: "16px 0 8px" }}>
          <p style={{ fontSize: 12, color: tokens.textDim, lineHeight: 1.6, margin: 0 }}>
            Standard medical documentation forms for use in the field. Stores locally on device, exports JSON for medic-to-medic sync, exports PDF for upload to MC4 / HAIMS once back in connectivity.
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
                    <span style={{
                      marginLeft: 8, fontSize: 9,
                      color: tokens.textDim, background: tokens.bgCard,
                      padding: "1px 6px", borderRadius: 4,
                      fontWeight: 600, letterSpacing: ".04em",
                    }}>
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
              <div style={{
                fontSize: 10, color: tokens.amber,
                marginTop: -4, marginBottom: 8,
                paddingLeft: 64, fontWeight: 600,
              }}>
                Coming soon. SF 600 is live now.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
