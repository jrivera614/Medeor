import CpgClient from "./CpgClient";

export const metadata = {
  title: "JTS Clinical Practice Guidelines - 86 Direct PDF Links | Medeor",
  description: "All 86 JTS Clinical Practice Guidelines with verified direct PDF links. TCCC, hemorrhage, airway, TBI, burns, infections, PFC, environmental, surgical, and forms. No more digging through jts.health.mil.",
  openGraph: { title: "JTS CPGs - Direct PDF Links | Medeor", url: "https://medeor.app/cpgs" },
  alternates: { canonical: "https://medeor.app/cpgs" },
};

export default function CpgPage() { return <CpgClient />; }
