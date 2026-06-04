import PccVentClient from "./PccVentClient";

export const metadata = {
  title: "PCC Vent Management | Medeor",
  description:
    "Field ventilator management for prolonged casualty care. Initial transport vent settings, SOAPME setup and DOPES troubleshooting mnemonics, lung-protective targets, ARDS and blast lung strategy, and weaning readiness.",
  alternates: { canonical: "https://medeor.app/pcc/vent" },
};

export default function PccVentPage() {
  return (
    <>
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <h1>PCC Mechanical Ventilation Management</h1>
        <p>
          Mechanical ventilation reference for prolonged casualty care on transport ventilators such as the SAVe II, EMV+ 731, and Hamilton-T1. Covers initial mode, tidal volume, rate, FiO2, PEEP and I:E settings, the SOAPME pre-intubation setup mnemonic, the DOPES deterioration troubleshooting mnemonic, lung-protective ventilation targets, oxygenation strategy, ARDS and blast lung management, and weaning readiness. Aligned with the JTS Airway Management and Mechanical Ventilation CPG.
        </p>
      </div>
      <PccVentClient />
    </>
  );
}
