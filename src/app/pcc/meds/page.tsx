import PccMedsClient from "./PccMedsClient";

export const metadata = {
  title: "PCC Medications | Medeor",
  description: "Prolonged Casualty Care medications. Analgesia, sedation, vasoactives, paralytics, antibiotics, and blood products with dosing, indications, and warnings. Aligned with JTS PCC CPG.",
  alternates: { canonical: "https://medeor.app/pcc/meds" },
};

export default function PccMedsPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>PCC Medications</h1>
        <p>Medications used in Prolonged Casualty Care: analgesia and sedation (fentanyl drip, ketamine drip, propofol, dexmedetomidine), vasoactives (norepinephrine, vasopressin, push-dose epinephrine), paralytics (vecuronium), antibiotics (cefazolin, moxifloxacin, metronidazole), neuro (mannitol, hypertonic saline, insulin, D50), and blood products (LTOWB, FWB, PRBC, FFP). Dosing, indications, warnings, and administration notes aligned with JTS PCC CPG.</p>
      </div>
      <PccMedsClient />
    </>
  );
}
