"use client";
import { useEffect, useRef, useState } from "react";
import { tokens } from "@/app/ui";
import type { Entry } from "@/app/lib/sf600/types";
import { fmtDate } from "@/app/lib/sf600/format";

// AddendumForm: modal for adding a signed amendment to an entry.
//
// Opens from PatientDetail's "Add Addendum" button on each entry. Submits
// back through onSubmit, which the parent wires to the addAddendum handler
// on SF600Client.
//
// Design notes:
// - Slides up from bottom on mobile (sheet-style), centered on desktop.
// - Default signedBy is the active provider, but editable so a second medic
//   on the same device can co-sign without first changing the global
//   provider. (Single-tap workflow for paired-medic stations.)
// - No self-block: the original author can legitimately add late entries to
//   their own notes. The clinical correctness of that is on the medic, not
//   the form.
// - Trims whitespace before submit. Empty text or empty signature disables
//   the submit button.
// - Autosave NOT used here. An addendum is a deliberate signed action,
//   unlike narrative dictation. Background-saving a half-typed addendum
//   would be misleading.

export interface AddendumDraft {
  text: string;
  signedBy: string;
  signedUnit?: string;
}

export interface AddendumFormProps {
  // The entry being amended. Used only for the modal subtitle ("To entry from
  // RIVERA, J. SGT - 26 MAY 2026 1342"). Null is tolerated so the parent can
  // pass `find(...) ?? null` without an explicit guard.
  parentEntry: Entry | null;

  defaultSignedBy: string;
  defaultSignedUnit?: string;

  // Resolved or thrown by the caller's persistence layer. Errors surface as
  // a toast from SF600Client; this component just keeps the modal open so
  // the medic can retry.
  onSubmit: (draft: AddendumDraft) => Promise<void> | void;
  onCancel: () => void;
}

export function AddendumForm({
  parentEntry,
  defaultSignedBy,
  defaultSignedUnit,
  onSubmit,
  onCancel,
}: AddendumFormProps) {
  const [text, setText] = useState("");
  const [signedBy, setSignedBy] = useState(defaultSignedBy);
  const [signedUnit, setSignedUnit] = useState(defaultSignedUnit ?? "");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus the text area on open. iOS won't focus automatically because the
  // tap that opened the modal isn't the user's tap inside the modal, so we
  // do it after a short delay to clear the open transition.
  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const canSubmit = text.trim().length > 0 && signedBy.trim().length > 0 && !busy;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      await onSubmit({
        text: text.trim(),
        signedBy: signedBy.trim(),
        signedUnit: signedUnit.trim() || undefined,
      });
      // On success the parent unmounts us. No state cleanup needed.
    } catch (e) {
      setErrorMsg((e as Error).message || "Could not save addendum.");
      setBusy(false);
    }
  };

  const parentLabel = parentEntry
    ? `${parentEntry.signedBy} \u00b7 ${fmtDate(parentEntry.date)}`
    : "this entry";

  return (
    <div
      // Tap on the backdrop (but not the modal) closes the form. Confirms
      // any text loss implicitly - if you tapped outside, you intended to
      // dismiss. Submit button is the persistent path.
      onClick={(e) => { if (e.target === e.currentTarget && !busy) onCancel(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 16,
        zIndex: 60,
      }}
    >
      <div
        style={{
          background: tokens.bgApp,
          border: `1px solid ${tokens.borderSoft}`,
          borderRadius: "14px 14px 8px 8px",
          width: "100%",
          maxWidth: 460,
          padding: "16px 16px 20px",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <div style={{
          width: 36, height: 4,
          background: tokens.borderSoft,
          borderRadius: 2,
          margin: "0 auto 14px",
        }} />
        <div style={{
          fontSize: 13, fontWeight: 700,
          color: tokens.brand,
          textTransform: "uppercase", letterSpacing: ".06em",
          marginBottom: 4,
        }}>
          Add Addendum
        </div>
        <div style={{
          fontSize: 11, color: tokens.textMuted,
          marginBottom: 14, lineHeight: 1.5,
        }}>
          To entry from {parentLabel}
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={lblStyle}>Addendum text</label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={busy}
            placeholder="e.g. Reviewed entry. Concur with plan. Recheck in 24 hr."
            spellCheck
            style={{
              ...inputBase,
              minHeight: 120,
              fontFamily: "'Menlo', ui-monospace, monospace",
              fontSize: 12,
              lineHeight: 1.5,
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={lblStyle}>Signed by (typed signature)</label>
          <input
            value={signedBy}
            onChange={(e) => setSignedBy(e.target.value)}
            disabled={busy}
            autoCapitalize="characters"
            style={inputBase}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lblStyle}>Unit / Clinic (optional)</label>
          <input
            value={signedUnit}
            onChange={(e) => setSignedUnit(e.target.value)}
            disabled={busy}
            style={inputBase}
          />
        </div>

        {errorMsg && (
          <div style={{
            background: `${tokens.red}10`,
            border: `1px solid ${tokens.red}30`,
            borderRadius: tokens.radiusSm,
            padding: "8px 12px",
            marginBottom: 10,
            fontSize: 11,
            color: tokens.red,
          }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              flex: 1,
              padding: "10px 14px",
              background: canSubmit ? tokens.green : tokens.bgMuted,
              border: "none",
              color: canSubmit ? "#fff" : tokens.textGhost,
              borderRadius: tokens.radiusMd,
              fontSize: 12, fontWeight: 700,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              cursor: canSubmit ? "pointer" : "default",
              fontFamily: "inherit",
            }}
          >
            {busy ? "Signing..." : "Sign Addendum"}
          </button>
          <button
            onClick={onCancel}
            disabled={busy}
            style={{
              flex: 1,
              padding: "10px 14px",
              background: "transparent",
              border: `1px solid ${tokens.borderSoft}`,
              color: tokens.textSecondary,
              borderRadius: tokens.radiusMd,
              fontSize: 12, fontWeight: 700,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              cursor: busy ? "default" : "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const lblStyle = {
  fontSize: 10, color: tokens.textDim,
  display: "block" as const, marginBottom: 3,
  letterSpacing: ".03em", textTransform: "uppercase" as const,
  fontWeight: 600,
};

const inputBase = {
  width: "100%",
  padding: "9px 12px",
  background: tokens.bgCard,
  border: `1px solid ${tokens.borderSoft}`,
  borderRadius: tokens.radiusMd,
  color: tokens.textPrimary,
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box" as const,
};
