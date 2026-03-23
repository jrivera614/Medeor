"use client";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../../components";

function renderContent(content) {
  const lines = content.split("\n");
  const elements = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={key++} style={{ height: 12 }} />);
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} style={{
          fontSize: 16, fontWeight: 700, color: "#e8e8ed",
          margin: "20px 0 10px", lineHeight: 1.3
        }}>
          {trimmed.slice(3)}
        </h2>
      );
    } else {
      elements.push(
        <p key={key++} style={{
          fontSize: 14, color: "#bbb", lineHeight: 1.7,
          marginBottom: 8
        }}>
          {trimmed}
        </p>
      );
    }
  }
  return elements;
}

export default function BlogPost({ post }) {
  const { ref } = useAppState();
  const router = useRouter();

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <button style={S.back} onClick={() => router.push("/blog")}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Blog</div>
          <div style={{ fontSize: 9, color: "#666" }}>medeor.app</div>
        </div>
      </div>
      <div ref={ref} style={S.body}>
        <div style={{ padding: "16px 0" }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{
              fontSize: 10, color: "#8b5cf6", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: ".04em"
            }}>
              {post.category}
            </span>
            <span style={{ fontSize: 10, color: "#555", marginLeft: 12 }}>
              {post.readTime}
            </span>
          </div>

          <h1 style={{
            fontSize: 22, fontWeight: 700, color: "#e8e8ed",
            lineHeight: 1.3, marginBottom: 16
          }}>
            {post.title}
          </h1>

          <div style={{
            fontSize: 13, color: "#888", lineHeight: 1.6,
            marginBottom: 20, padding: "12px 0",
            borderTop: "1px solid #ffffff10",
            borderBottom: "1px solid #ffffff10"
          }}>
            {post.description}
          </div>

          <article>
            {renderContent(post.content)}
          </article>

          <div style={{
            marginTop: 32, padding: 16,
            background: "#8b5cf610", border: "1px solid #8b5cf625",
            borderRadius: 12
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#c7c8ff", marginBottom: 6 }}>
              Train with Medeor
            </div>
            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>
              Free interactive TCCC, CLS, and PFC training. Quizzes with rationales,
              clinical practice guidelines, videos, calculators, and the interactive
              PFC Casualty Card. No login required.
            </div>
            <button
              onClick={() => router.push("/")}
              style={{
                background: "#8b5cf6", border: "none", color: "#fff",
                padding: "10px 20px", borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
              }}
            >
              Start Training
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => router.push("/blog")}
              style={{
                background: "#ffffff08", border: "1px solid #ffffff14",
                color: "#888", padding: "10px 20px", borderRadius: 10,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit", width: "100%"
              }}
            >
              ← All Articles
            </button>
          </div>
        </div>
      </div>
      <Bar active="train" />
    </div>
  );
}
