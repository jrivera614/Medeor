"use client";
import { useRouter } from "next/navigation";

export default function ModuleError({ error, reset }) {
  const router = useRouter();
  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#0a0a0f", color: "#e8e8ed", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Module Error</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
          {error?.message || "Something went wrong loading this module."}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={() => reset()} style={{ background: "#8b5cf6", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Try Again</button>
          <button onClick={() => router.push("/")} style={{ background: "#ffffff10", border: "1px solid #ffffff14", color: "#888", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Home</button>
        </div>
      </div>
    </div>
  );
}
