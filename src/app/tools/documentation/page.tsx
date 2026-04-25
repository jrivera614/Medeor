import DocumentationHubClient from "./DocumentationHubClient";

export const metadata = {
  title: "Documentation - Forms | Medeor",
  description: "Offline-first medical documentation forms for field use. SF 600 Chronological Record, DD 1380 TCCC card, and others. Stores locally, exports JSON for medic sync and PDF for upload to MC4 / HAIMS.",
  alternates: { canonical: "https://medeor.app/tools/documentation" },
};

export default function DocumentationPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>Medical Documentation Forms</h1>
        <p>Offline-first medical documentation tools for field use. Forms include SF 600 Chronological Record of Medical Care, DD 1380 TCCC card, AF 3899 patient movement, and after-action templates. Stores patient data locally on device, exports JSON for device-to-device sync, exports PDF for upload to medical record systems.</p>
        <ul>
          <li><a href="/tools/documentation/sf600">SF 600 Chronological Record of Medical Care</a></li>
        </ul>
      </div>
      <DocumentationHubClient />
    </>
  );
}
