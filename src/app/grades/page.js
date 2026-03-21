import GradesClient from "./GradesClient";

export const metadata = {
  title: "TCCC Skills Grade Sheets - GO/NO-GO Evaluation | Medeor",
  description: "Interactive TCCC skills grade sheets with GO/NO-GO evaluation. CAT tourniquet, wound packing, NPA, chest seal, needle decompression, cricothyrotomy, tactical trauma assessment, and EZ-IO. Practice to the official evaluation standard.",
  openGraph: { title: "TCCC Skills Grade Sheets | Medeor", url: "https://medeor.app/grades" },
  alternates: { canonical: "https://medeor.app/grades" },
};

export default function GradesPage() { return <GradesClient />; }
