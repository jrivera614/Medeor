"use client";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../components";

interface ReferenceSection {
  title: string;
  desc: string;
  icon: string;
  color: string;
  path: string;
}

const sections: ReferenceSection[] = [
  {
    title: "Clinical Practice Guidelines",
    desc: "86 JTS/CoTCCC CPG direct PDF links. Searchable by category.",
    icon: "📋",
    color: "#6366f1",
    path: "/cpgs"
  },
  {
    title: "Skills Video Library",
    desc: "31 Deployed Medicine TCCC training videos organized by module.",
    icon: "🎬",
    color: "#ef4444",
    path: "/videos"
  },
  {
    title: "Table VIII Grade Sheets",
    desc: "Skills evaluation sheets with GO/NO-GO grading. Critical tasks marked.",
    icon: "📊",
    color: "#f59e0b",
    path: "/table8"
  },
  {
    title: "Ranger Medic Handbook",
    desc: "Quick reference sections from the 75th Ranger Regiment RMH.",
    icon: "📕",
    color: "#10b981",
    path: "/rmh"
  },
  {
    title: "Blog",
    desc: "TCCC articles, training guides, and clinical breakdowns.",
    icon: "📝",
    color: "#78716c",
    path: "/blog"
  },
];

export default function ReferenceClient() {
  const { ref } = useAppState();
  const router = useRouter();

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Reference Library</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 1, textTransform: "uppercase", letterSpacing: ".04em" }}>
            CPGs, Videos, Grade Sheets, RMH, Blog
          </div>
        </div>
      </div>
      <div ref={ref} style={S.body}>
        <div style={{ padding: "16px 0" }}>
          {sections.map((s) => (
            <div
              key={s.path}
              style={S.card}
              onClick={() => router.push(s.path)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{
                  fontSize: 22, width: 40, height: 40,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 11, background: `${s.color}14`
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{s.desc}</div>
                </div>
                <span style={{ color: "#444", fontSize: 14 }}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Bar active="ref" />
    </div>
  );
}
