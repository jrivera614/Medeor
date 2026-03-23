import PfcClient from "./PfcClient";
export const metadata = {
  title: "PFC Casualty Card - Interactive | Medeor",
  description: "Interactive Prolonged Field Care Casualty Card with checklist, vitals tracking, and PDF export. Based on PFC CC v25. Free, no login required.",
};
export default function PfcPage() { return <PfcClient />; }
