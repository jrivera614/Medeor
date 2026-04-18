import ReferenceClient from "./ReferenceClient";

export const metadata = {
  title: "Reference Library - CPGs, Videos, Grade Sheets | Medeor",
  description: "Clinical Practice Guidelines, TCCC training videos, and Table VIII skills evaluation grade sheets. All in one place.",
  alternates: { canonical: "https://medeor.app/reference" },
};

export default function ReferencePage() {
  return <ReferenceClient />;
}
