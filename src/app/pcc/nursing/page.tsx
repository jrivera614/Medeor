import PccNursingClient from "./PccNursingClient";

export const metadata = {
  title: "PCC Nursing Checklist | Medeor",
  description:
    "Prolonged casualty care nursing checklist. Shift-cadence care tasks grouped by frequency: hourly vitals and urine output, repositioning and skin care, dressing and line care, oral and eye care, and as-needed interventions.",
  alternates: { canonical: "https://medeor.app/pcc/nursing" },
};

export default function PccNursingPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>PCC Nursing Checklist</h1>
        <p>
          Nursing care checklist for prolonged casualty care, organized by cadence. Hourly tasks cover vitals, mental status, urine output, pain and sedation, bleeding checks, and line patency. Recurring tasks cover repositioning, range of motion, pressure-point and skin care, cuff pressure checks, intake and output, wound and dressing care, line rotation, oral and eye care, DVT prophylaxis, and documentation. Aligned with JTS prolonged casualty care nursing guidance.
        </p>
      </div>
      <PccNursingClient />
    </>
  );
}
