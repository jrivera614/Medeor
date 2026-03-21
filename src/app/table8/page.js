import GradesClient from "./GradesClient";

export const metadata = {
  title: "Table VIII - TCCC Skills Grade Sheets | Medeor",
  description: "Interactive TCCC skills grade sheets with GO/NO-GO evaluation. CAT tourniquet, wound packing, NPA, chest seal, needle decompression, cricothyrotomy, tactical trauma assessment, and EZ-IO.",
  openGraph: { title: "Table VIII - TCCC Grade Sheets | Medeor", url: "https://medeor.app/table8" },
  alternates: { canonical: "https://medeor.app/table8" },
};

export default function GradesPage() { return <GradesClient />; }
