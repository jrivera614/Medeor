import MedsClient from "./MedsClient";

export const metadata = {
  title: "Medication Reference - TCCC, PFC & Garrison Dosing | Medeor",
  description: "Quick-reference medication guide for combat medics. TCCC battlefield meds, PFC drips and pressors, antibiotics, pain management, RSI drugs, and common garrison sick call medications with dosing, routes, indications, and warnings.",
  alternates: {
    canonical: "https://medeor.app/meds",
  },
};

export default function MedsPage() {
  return (
    <>
      <div style={{position:"absolute",left:"-9999px",width:"1px",height:"1px",overflow:"hidden"}} aria-hidden="true">
        <h1>Medication Reference for Combat Medics</h1>
        <p>Searchable medication guide covering TCCC battlefield medications, Prolonged Field Care drips and pressors, antibiotics for penetrating trauma, pain management including ketamine and OTFC, RSI drugs, and common garrison sick call medications. Includes dosing, routes, indications, timing, warnings, and clinical notes.</p>
        <h2>Categories</h2>
        <ul>
          <li>Hemorrhage and Resuscitation: TXA, calcium chloride, 3% hypertonic saline, epinephrine</li>
          <li>Pain Management: ketamine analgesic, OTFC, meloxicam, acetaminophen</li>
          <li>Sedation: ketamine procedural, ketamine drip, midazolam</li>
          <li>Antibiotics: moxifloxacin, ceftriaxone, metronidazole, ertapenem</li>
          <li>Pressors and Drips: push-dose epinephrine, norepinephrine drip</li>
          <li>Airway and RSI: ketamine induction, succinylcholine, rocuronium</li>
          <li>Neuro and Seizure: levetiracetam (Keppra)</li>
          <li>Nausea and GI: ondansetron, promethazine, loperamide</li>
          <li>Garrison and Sick Call: ibuprofen, naproxen, diphenhydramine, cetirizine, amoxicillin, azithromycin, ciprofloxacin, mupirocin, hydrocortisone, clotrimazole</li>
        </ul>
      </div>
      <MedsClient />
    </>
  );
}
