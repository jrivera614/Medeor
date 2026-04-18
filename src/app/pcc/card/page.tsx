import PfcClient from "../../pfc/PfcClient";

// PCC Casualty Card route.
// Reuses the existing PfcClient component unchanged to avoid any risk
// to localStorage data, save-key compatibility, or the 36KB of working
// card logic. The component's internal header string still reads "PFC
// Casualty Card" in v1; a later pass will parameterize the label and
// migrate the save key.

export const metadata = {
  title: "PCC Casualty Card - Interactive | Medeor",
  description: "Interactive Prolonged Casualty Care Casualty Card with checklist, vitals tracking, and PDF export. Aligned with JTS PCC CPG. Free, no login required.",
  alternates: { canonical: "https://medeor.app/pcc/card" },
};

export default function PccCardPage() {
  return <PfcClient />;
}
