import ToolsClient from "./ToolsClient";

export const metadata = {
  title: "Medical Calculators & Checklists - Parkland, GCS, Pediatric Dosing | Medeor",
  description: "Parkland burn calculator, GCS calculator with airway guidance, pediatric weight-based dosing for 8 drugs, and 5 interactive checklists: IFAK, pre-mission medical, HITMAN, 9-line MEDEVAC, SHEEP VOMIT.",
  openGraph: { title: "Medical Calculators & Checklists | Medeor", url: "https://medeor.app/tools" },
  alternates: { canonical: "https://medeor.app/tools" },
};

export default function ToolsPage() { return <ToolsClient />; }
