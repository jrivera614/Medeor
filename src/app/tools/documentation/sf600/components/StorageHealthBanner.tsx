"use client";
import { useEffect, useState } from "react";
import { tokens } from "@/app/ui";
import { getStorageHealth } from "@/app/lib/sf600/db";
import { STORAGE_WARN_RATIO, STORAGE_CRITICAL_RATIO } from "@/app/lib/sf600/constants";

// StorageHealthBanner: appears at the top of the SF 600 main view when the
// device is running low on IndexedDB storage. Silent below the warn threshold.
//
// Two states above silent:
// - WARN (>= 80%): amber, recommends export
// - CRITICAL (>= 95%): red, blocks new entries until user acks
//
// We re-check on mount and on visibility change (medic tabs back in after
// dealing with something else - storage may have changed).

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function StorageHealthBanner() {
  const [health, setHealth] = useState<{ usage: number; quota: number; ratio: number } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const h = await getStorageHealth();
      if (mounted) setHealth(h);
    };
    check();
    const onVis = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (!health) return null;
  if (health.ratio < STORAGE_WARN_RATIO) return null;
  if (dismissed && health.ratio < STORAGE_CRITICAL_RATIO) return null;

  const critical = health.ratio >= STORAGE_CRITICAL_RATIO;
  const color = critical ? tokens.red : tokens.amber;
  const pct = Math.round(health.ratio * 100);

  return (
    <div style={{
      background: `${color}10`,
      border: `1px solid ${color}30`,
      borderRadius: 10,
      padding: "10px 14px",
      margin: "12px 0 8px",
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color,
        textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4,
      }}>
        {critical ? "Storage Critical" : "Storage Low"}
      </div>
      <div style={{ fontSize: 11, color: tokens.textSecondary, lineHeight: 1.5 }}>
        Device storage at {pct}% ({fmtBytes(health.usage)} / {fmtBytes(health.quota)}).
        {critical
          ? " Export and clear old patients before adding more entries."
          : " Consider exporting a backup soon."}
      </div>
      {!critical && (
        <button
          onClick={() => setDismissed(true)}
          style={{
            marginTop: 6,
            background: "transparent",
            border: "none",
            color: tokens.textMuted,
            fontSize: 10,
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
            letterSpacing: ".04em",
          }}
        >
          DISMISS
        </button>
      )}
    </div>
  );
}
