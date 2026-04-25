import SF600Client from "./SF600Client";

export const metadata = {
  title: "SF 600 - Chronological Record of Medical Care | Medeor",
  description: "Offline-first SF 600 Chronological Record of Medical Care. Patient charting with vitals, narrative entries, and PDF export. Designed for austere environments without MC4 or HAIMS access.",
  alternates: { canonical: "https://medeor.app/tools/documentation/sf600" },
};

export default function SF600Page() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>Standard Form 600 - Chronological Record of Medical Care</h1>
        <p>Interactive SF 600 form for medical providers in austere or disconnected environments. Patient demographic block, fillable vitals (HR, BP, RR, SpO2, temperature, pain), SOAP-style narrative entries, signature block, and PDF export. Patient and entry data stored locally on device using IndexedDB. JSON bundle export and import for medic-to-medic sync. Last-write-wins conflict resolution by timestamp.</p>
      </div>
      <SF600Client />
    </>
  );
}
