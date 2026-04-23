import PccCpgsClient from "./PccCpgsClient";

export const metadata = {
  title: "PCC JTS CPGs | Medeor",
  description: "Curated JTS Clinical Practice Guidelines for Prolonged Casualty Care. Each CPG paired with why it matters in PCC. Links direct to official PDF sources.",
  alternates: { canonical: "https://medeor.app/pcc/cpgs" },
};

export default function PccCpgsPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>PCC JTS Clinical Practice Guidelines</h1>
        <p>Curated Joint Trauma System Clinical Practice Guidelines most relevant to Prolonged Casualty Care. Covers resuscitation, airway and ventilator management, wound care, neurologic injury, burns and infection, environmental injury, and operational documentation. Each CPG paired with a short explanation of why it matters in the PCC context.</p>
      </div>
      <PccCpgsClient />
    </>
  );
}
