import PccWoundClient from "./PccWoundClient";

export const metadata = {
  title: "PCC Wound Care | Medeor",
  description: "Prolonged Casualty Care wound management reference. Acute debridement and irrigation, wound infection recognition, burn daily care, dressing selection, amputation stump care, and suturing for delayed primary closure. JTS CPG aligned.",
  alternates: { canonical: "https://medeor.app/pcc/wound" },
};

export default function PccWoundPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>PCC Wound Care</h1>
        <p>Reference for ongoing wound management in prolonged casualty care. Covers acute debridement and irrigation, wound infection recognition and escalation, daily burn wound care, dressing selection and change protocols, amputation stump care, and suturing for delayed primary closure. Aligned with current JTS Clinical Practice Guidelines.</p>
      </div>
      <PccWoundClient />
    </>
  );
}
