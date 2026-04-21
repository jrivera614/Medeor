import PccSkillsClient from "./PccSkillsClient";

export const metadata = {
  title: "PCC Skills & Procedures | Medeor",
  description: "Prolonged Casualty Care procedures reference. Foley catheter, NG/OG tube, whole blood transfusion, IV and IO access, cric maintenance, chest tube management, suturing, and arterial blood draw. JTS CPG aligned.",
  alternates: { canonical: "https://medeor.app/pcc/skills" },
};

export default function PccSkillsPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>PCC Skills and Procedures</h1>
        <p>Reference for day-to-day procedures in prolonged casualty care. Covers Foley catheter insertion, nasogastric and orogastric tube placement, whole blood transfusion, peripheral IV placement, intraosseous access extended use, cricothyrotomy tube maintenance, chest tube ongoing management, suturing and wound closure, and arterial blood draw. Aligned with current JTS Clinical Practice Guidelines.</p>
      </div>
      <PccSkillsClient />
    </>
  );
}
