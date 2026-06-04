import Dd1380Client from "./Dd1380Client";

export const metadata = {
  title: "DD 1380 TCCC Card | Medeor",
  description:
    "Offline-first DD 1380 Tactical Combat Casualty Care card. Document casualty ID, mechanism of injury, tourniquets, MIST signs and symptoms, C-A-B treatments, and medications. Stores locally, exports PDF.",
  alternates: { canonical: "https://medeor.app/tools/documentation/dd1380" },
};

export default function Dd1380Page() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>DD Form 1380 Tactical Combat Casualty Care Card</h1>
        <p>
          Interactive DD 1380 TCCC casualty card for first responders and combat medics in austere or disconnected environments. Follows the MIST format: mechanism of injury, injuries, signs and symptoms, and treatments. Captures battle roster number, evacuation priority, casualty demographics, allergies, mechanism of injury, tourniquet type and time by limb, up to four timed vital sign sets with AVPU and pain scale, C-A-B treatments, fluids and blood products, medications, and first responder notes. Stores cards locally on device using IndexedDB and exports a PDF for transcription onto the official DD Form 1380. This tool does not transmit data.
        </p>
      </div>
      <Dd1380Client />
    </>
  );
}
