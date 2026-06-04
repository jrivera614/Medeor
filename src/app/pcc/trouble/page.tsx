import PccTroubleClient from "./PccTroubleClient";

export const metadata = {
  title: "PCC Troubleshooting | Medeor",
  description:
    "Ventilator alarm and deterioration troubleshooting for prolonged casualty care. DOPES quick reference plus action playbooks for high and low pressure alarms, apnea, falling SpO2, and ventilator or power failure.",
  alternates: { canonical: "https://medeor.app/pcc/trouble" },
};

export default function PccTroublePage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>PCC Ventilator Troubleshooting</h1>
        <p>
          Ventilator alarm and patient deterioration troubleshooting for prolonged casualty care. Includes the DOPES mnemonic (displacement, obstruction, pneumothorax, equipment, stacked breaths) and action-oriented playbooks for high peak pressure, low pressure and disconnect, apnea, falling oxygen saturation, and ventilator or power failure. Bag-valve-mask is the universal fallback. Aligned with the JTS Airway Management and Mechanical Ventilation CPG.
        </p>
      </div>
      <PccTroubleClient />
    </>
  );
}
