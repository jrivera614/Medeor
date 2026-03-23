"use client";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../components";

export default function BlogIndex({ posts }) {
  const { ref } = useAppState();
  const router = useRouter();

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <button style={S.back} onClick={() => router.push("/")}>←</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Blog</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 1 }}>TCCC Training Articles & Guides</div>
        </div>
      </div>
      <div ref={ref} style={S.body}>
        <div style={{ padding: "16px 0" }}>
          {posts.map((post) => (
            <div
              key={post.slug}
              style={S.card}
              onClick={() => router.push(`/blog/${post.slug}`)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>
                  {post.category}
                </span>
                <span style={{ fontSize: 10, color: "#555" }}>{post.readTime}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                {post.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Bar active="train" />
    </div>
  );
}
