import PccHubClient from "./PccHubClient";

export const metadata = {
  title: "PCC - Prolonged Casualty Care | Medeor",
  description: "Prolonged Casualty Care reference for LSCO. Medications, skills, nursing checklist, vent management, troubleshooting, JTS CPGs, and fillable casualty card with PDF export.",
  alternates: { canonical: "https://medeor.app/pcc" },
};

export default function PccPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>Prolonged Casualty Care (PCC)</h1>
        <p>LSCO-aligned PCC reference section. Topics: medications, skills and procedures, nursing checklist, vent management, troubleshooting, JTS PCC clinical practice guidelines, and a fillable casualty card with PDF export.</p>
        <ul>
          <li><a href="/pcc/card">PCC Casualty Card with PDF export</a></li>
        </ul>
      </div>
      <PccHubClient />
    </>
  );
}
