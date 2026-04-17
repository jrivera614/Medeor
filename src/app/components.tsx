"use client";
import { useState, useEffect, useCallback, useRef, CSSProperties, RefObject } from "react";
import { useRouter, usePathname } from "next/navigation";

// ─── Shared app state hook ───

export interface ProgressData {
  [key: string]: any;
  ts?: number;
}

export interface AppState {
  fade: boolean;
  setFade: (v: boolean) => void;
  expanded: string | number | null;
  setExpanded: (v: string | number | null) => void;
  search: string;
  setSearch: (v: string) => void;
  progress: Record<string, ProgressData>;
  setProgress: (v: Record<string, ProgressData>) => void;
  checkStates: Record<string, boolean>;
  setCheckStates: (v: Record<string, boolean>) => void;
  ref: RefObject<HTMLDivElement>;
  router: ReturnType<typeof useRouter>;
  pathname: string;
  tr: (fn: () => void) => void;
  saveProgress: (key: string, data: Record<string, any>) => void;
}

export function useAppState(): AppState {
  const [fade, setFade] = useState(true);
  const [expanded, setExpanded] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState<Record<string, ProgressData>>({});
  const [checkStates, setCheckStates] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const tr = useCallback((fn: () => void) => {
    setFade(false);
    setTimeout(() => { fn(); setFade(true); }, 160);
  }, []);

  const saveProgress = useCallback((key: string, data: Record<string, any>) => {
    try {
      const p = JSON.parse(localStorage.getItem("medeor_progress") || "{}");
      p[key] = { ...data, ts: Date.now() };
      localStorage.setItem("medeor_progress", JSON.stringify(p));
      setProgress(p);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("medeor_progress") || "{}");
      setProgress(p);
    } catch (e) {}
  }, []);

  return { fade, setFade, expanded, setExpanded, search, setSearch, progress, setProgress, checkStates, setCheckStates, ref, router, pathname, tr, saveProgress };
}

// ─── Shared style bag ───
// The S export contains both static CSSProperties entries (app, hdr, back, body, card, input)
// and dynamic style builder functions (btn, opt, tabBtn). Consumers import subsets via
// destructuring, so the shape must be preserved exactly.

export interface StyleBag {
  app: CSSProperties;
  hdr: CSSProperties;
  back: CSSProperties;
  body: CSSProperties;
  card: CSSProperties;
  input: CSSProperties;
  btn: (color: string, filled?: boolean) => CSSProperties;
  opt: (selected: boolean, correct?: boolean, revealed?: boolean) => CSSProperties;
  tabBtn: (active: boolean) => CSSProperties;
}

export const S: StyleBag = {
  app: { fontFamily: "'DM Sans',system-ui,sans-serif", background: "#0a0a0f", color: "#e8e8ed", height: "100dvh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", overflow: "hidden" },
  hdr: { padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #ffffff0f", background: "rgba(10,10,15,.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 },
  back: { background: "#ffffff0f", border: "none", color: "#888", fontSize: 16, width: 32, height: 32, borderRadius: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  body: { flex: 1, padding: "0 16px 130px", overflowY: "auto", transition: "all .18s ease" },
  card: { background: "#ffffff08", border: "1px solid #ffffff0f", borderRadius: 13, padding: 14, cursor: "pointer", transition: "all .2s", marginBottom: 8 },
  input: { width: "100%", padding: "10px 14px", background: "#ffffff08", border: "1px solid #ffffff14", borderRadius: 11, color: "#e8e8ed", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  btn: (c, f) => ({ background: f ? c : "transparent", border: `1.5px solid ${c}50`, color: f ? "#fff" : c, padding: "12px 18px", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }),
  opt: (sel, ok, rev) => {
    let bg = "#ffffff08", bd = "#ffffff14", cl = "#e8e8ed";
    if (rev && ok) { bg = "#10b98120"; bd = "#10b981"; cl = "#10b981"; }
    else if (rev && sel && !ok) { bg = "#ef444420"; bd = "#ef4444"; cl = "#ef4444"; }
    else if (sel && !rev) { bg = "#6366f120"; bd = "#6366f1"; cl = "#c7c8ff"; }
    return { background: bg, border: `1.5px solid ${bd}`, color: cl, padding: "12px 13px", borderRadius: 10, fontSize: 13, cursor: rev ? "default" : "pointer", width: "100%", textAlign: "left", fontFamily: "inherit", lineHeight: 1.5 };
  },
  tabBtn: a => ({ flex: 1, padding: "10px 0 8px", background: "none", border: "none", color: a ? "#8b5cf6" : "#555", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "inherit" })
};

// ─── Shared components ───

export interface ProgProps {
  c: number;
  t: number;
}

export function Prog({ c, t }: ProgProps) {
  return (
    <div style={{ width: "100%", height: 3, background: "#ffffff14", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ width: `${(c / t) * 100}%`, height: "100%", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 2, transition: "width .4s ease" }} />
    </div>
  );
}

export type BarTab = "train" | "ref" | "pcc" | "tools" | "meds" | "";

export interface BarProps {
  active: BarTab;
}

export function Bar({ active }: BarProps) {
  const router = useRouter();
  const tabs: Array<[BarTab, string, string, string]> = [
    ["train", "/", "🎯", "Train"],
    ["ref", "/reference", "📋", "Reference"],
    ["pcc", "/pcc", "🩺", "PCC"],
    ["tools", "/tools", "🔧", "Tools"],
    ["meds", "/meds", "💊", "Meds"]
  ];

  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 20 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, padding: "6px 0", background: "rgba(10,10,15,.95)", borderTop: "1px solid #ffffff08", flexWrap: "wrap" }}>
        <button onClick={() => router.push("/contact")} style={{ background: "none", border: "none", color: "#555", fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: "2px 6px" }}>Feedback</button>
        <span style={{ color: "#ffffff10", fontSize: 10 }}>·</span>
        <button onClick={() => router.push("/privacy")} style={{ background: "none", border: "none", color: "#555", fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: "2px 6px" }}>Privacy</button>
        <span style={{ color: "#ffffff10", fontSize: 10 }}>·</span>
        <button onClick={() => router.push("/terms")} style={{ background: "none", border: "none", color: "#555", fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: "2px 6px" }}>Terms</button>
        <span style={{ color: "#ffffff10", fontSize: 10 }}>·</span>
        <span style={{ fontSize: 10, color: "#333", padding: "2px 6px" }}>© 2026 Medeor</span>
      </div>
      <div style={{ display: "flex", background: "rgba(10,10,15,.97)", borderTop: "1px solid #ffffff0f" }}>
        {tabs.map(([k, path, ic, lb]) => (
          <button key={k} style={S.tabBtn(active === k)} onClick={() => router.push(path)}>
            <span style={{ fontSize: 14 }}>{ic}</span>{lb}
          </button>
        ))}
      </div>
    </div>
  );
}
