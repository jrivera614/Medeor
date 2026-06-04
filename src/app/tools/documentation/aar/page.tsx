import AarClient from "./AarClient";

export const metadata = {
  title: "TCCC After-Action Report | Medeor",
  description:
    "Offline-first JTS-style TCCC After-Action Report template. Draft a medical AAR with casualty demographics, MARCH interventions, vitals, medications, evacuation, and performance improvement notes. Stores locally, exports PDF.",
  alternates: { canonical: "https://medeor.app/tools/documentation/aar" },
};

export default function AarPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>TCCC After-Action Report Template</h1>
        <p>
          Joint Trauma System style Tactical Combat Casualty Care after-action report template for medics in austere or disconnected environments. Captures event and mission data, casualty demographics, point-of-injury provider attribution, injuries and mechanism, MARCH interventions (massive hemorrhage, airway, respiration, circulation, hypothermia), vital signs with AVPU and pain scale, medications, evacuation category and platform, and performance improvement findings. Stores reports locally on device using IndexedDB and exports a PDF for transcription into the official JTS submission. This tool does not transmit data.
        </p>
      </div>
      <AarClient />
    </>
  );
}
