"use client";
import { useState, useEffect, useCallback, useRef, CSSProperties, RefObject } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Target, BookOpen, Stethoscope, Wrench, Pill, type LucideIcon } from "lucide-react";
import { safeStorage } from "./lib/safeStorage";

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
    const p = safeStorage.getJSON<Record<string, ProgressData>>("medeor_progress", {}) || {};
    p[key] = { ...data, ts: Date.now() };
    if (safeStorage.setJSON("medeor_progress", p)) {
      setProgress(p);
    }
  }, []);
