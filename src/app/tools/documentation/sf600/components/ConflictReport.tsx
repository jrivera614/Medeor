"use client";
import { tokens } from "@/app/ui";
import type { MergeReport } from "@/app/lib/sf600/types";

// ConflictReport: modal-style sheet that shows the result of a bundle import
// merge. "X added, Y updated, Z conflicts" with a list of each conflicting
// record so the medic can sanity-check what got overwritten and what got
// rejected as stale.

export interface ConflictReportProps {
  report: MergeReport;
  onClose: () => void;
}

export function ConflictReport({ report, onClose }: ConflictReportProps) {
  const hasConflicts = report.conflicts.length > 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 100,
        display: "flex", alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: tokens.maxWidth,
          margin: "0 auto",
          background: tokens.bgApp,
          borderTop: `1px solid ${tokens.borderSoft}`,
          borderTopLeftRadius: tokens.radiusLg,
          borderTopRightRadius: tokens.radiusLg,
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "16px 16px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: tokens.brand,
            textTransform: "uppercase", letterSpacing: ".06em",
          }}>
            Import Complete
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none",
              color: tokens.textMuted, fontSize: 18,
              cursor: "pointer", padding: 0, fontFamily: "inherit",
              width: 28, height: 28, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <SummaryCell label="Added" value={report.added} color={tokens.green} />
          <SummaryCell label="Updated" value={report.updated} color={tokens.amber} />
          <SummaryCell label="Unchanged" value={report.unchanged} color={tokens.textMuted} />
          <SummaryCell label="Conflicts" value={report.conflicts.length} color={hasConflicts ? tokens.red : tokens.textMuted} />
        </div>

        {!hasConflicts ? (
          <div style={{
            padding: "20px 16px", textAlign: "center",
            fontSize: 12, color: tokens.textDim,
            border: `1px dashed ${tokens.borderSoft}`,
            borderRadius: tokens.radiusMd,
          }}>
            No conflicts. All incoming records were either new or older than what you already had.
          </div>
        ) : (
          <>
            <div style={{
              fontSize: 11, color: tokens.textSecondary, lineHeight: 1.5,
              marginBottom: 10,
            }}>
              These records existed on both devices with different timestamps. Last-write-wins resolved each one. Verify the winning side has the correct data.
            </div>
            <div style={{
              border: `1px solid ${tokens.borderSoft}`,
              borderRadius: tokens.radiusMd,
              overflow: "hidden",
            }}>
              {report.conflicts.map((c, i) => (
                <div
                  key={`${c.kind}-${c.id}`}
                  style={{
                    padding: "10px 12px",
                    borderBottom: i < report.conflicts.length - 1
                      ? `1px solid ${tokens.borderHair}` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontSize: 12, color: tokens.textPrimary, fontWeight: 600, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.label}
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: c.winner === "incoming" ? tokens.amber : tokens.green,
                      background: c.winner === "incoming" ? `${tokens.amber}18` : `${tokens.green}18`,
                      padding: "1px 6px", borderRadius: 4,
                      textTransform: "uppercase", letterSpacing: ".04em",
                      flexShrink: 0,
                    }}>
                      {c.winner === "incoming" ? "Replaced" : "Kept Local"}
                    </span>
                  </div>
                  <div style={{ fontSize: 9, color: tokens.textFaint, marginTop: 4, fontFamily: "monospace" }}>
                    {`${c.kind.toUpperCase()} \u00b7 local ${fmtTs(c.localUpdatedAt)} \u00b7 incoming ${fmtTs(c.incomingUpdatedAt)}`}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%", marginTop: 14, padding: "10px",
            background: tokens.brand, border: "none", color: "#fff",
            fontSize: 12, fontWeight: 700,
            borderRadius: tokens.radiusMd,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: ".04em",
          }}
        >
          DONE
        </button>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      flex: 1,
      padding: "8px 6px",
      background: `${color}10`,
      border: `1px solid ${color}25`,
      borderRadius: tokens.radiusSm + 1,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{
        fontSize: 8, color, marginTop: 3,
        textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700,
      }}>
        {label}
      </div>
    </div>
  );
}

function fmtTs(ms: number): string {
  if (!ms) return "?";
  const d = new Date(ms);
  if (isNaN(d.getTime())) return "?";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
