import RmhClient from "./RmhClient";

export const metadata = {
  title: "Ranger Medic Handbook - Interactive Field Reference | Medeor",
  description: "Full Ranger Medic Handbook field reference. Trauma protocols, TEMPs, pharmacology, medical operations, and packing lists. Searchable and mobile-friendly for 68W, RMED, and combat medics.",
  openGraph: { title: "Ranger Medic Handbook | Medeor", url: "https://medeor.app/rmh" },
  alternates: { canonical: "https://medeor.app/rmh" },
};

export default function RmhPage() { return <RmhClient />; }
