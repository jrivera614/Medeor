"use client";
import { usePfcState } from "./hooks/usePfcState";
import { usePdfExport } from "./hooks/usePdfExport";
import PfcLayout from "./components/Layout";
import PatientTab from "./tabs/PatientTab";
import MistTab from "./tabs/MistTab";
import HistoryTab from "./tabs/HistoryTab";
import InterventionsTab from "./tabs/InterventionsTab";
import LabsTab from "./tabs/LabsTab";
import BurnsTab from "./tabs/BurnsTab";
import TreatmentTab from "./tabs/TreatmentTab";
import VitalsTab from "./tabs/VitalsTab";
import VentTab from "./tabs/VentTab";
import NursingTab from "./tabs/NursingTab";
import PpgcTab from "./tabs/PpgcTab";

export default function PfcClient() {
  const s = usePfcState();

  const exportPDF = usePdfExport({
    patient: s.patient,
    mist: s.mist,
    history: s.history,
    tourniquets: s.tourniquets,
    meds: s.meds,
    labResults: s.labResults,
    burns: s.burns,
    burnDepth: s.burnDepth,
    checks: s.checks,
    checkTimes: s.checkTimes,
    priorities: s.priorities,
    vitals: s.vitals,
    vent: s.vent,
    carePlan: s.carePlan,
    treatmentsDone: s.treatmentsDone,
    prioritiesDone: s.prioritiesDone,
    tbsa: s.tbsa,
  });

  const renderTab = () => {
    switch (s.tab) {
      case 0:
        return <PatientTab patient={s.patient} setPatient={s.setPatient} updatePatient={s.updatePatient} />;
      case 1:
        return <MistTab mist={s.mist} updateMist={s.updateMist} />;
      case 2:
        return <HistoryTab history={s.history} updateHistory={s.updateHistory} />;
      case 3:
        return (
          <InterventionsTab
            tourniquets={s.tourniquets}
            updateTourniquets={s.updateTourniquets}
            meds={s.meds}
            setMeds={s.setMeds}
            addMed={s.addMed}
            updateMed={s.updateMed}
          />
        );
      case 4:
        return <LabsTab labResults={s.labResults} setLabResults={s.setLabResults} />;
      case 5:
        return (
          <BurnsTab
            patient={s.patient}
            burns={s.burns}
            setBurns={s.setBurns}
            burnDepth={s.burnDepth}
            setBurnDepth={s.setBurnDepth}
            tbsa={s.tbsa}
          />
        );
      case 6:
        return (
          <TreatmentTab
            checks={s.checks}
            checkTimes={s.checkTimes}
            toggleTreatment={s.toggleTreatment}
            priorities={s.priorities}
            setPriorities={s.setPriorities}
            treatmentsDone={s.treatmentsDone}
            prioritiesDone={s.prioritiesDone}
          />
        );
      case 7:
        return (
          <VitalsTab
            vitals={s.vitals}
            setVitals={s.setVitals}
            addVital={s.addVital}
            updateVital={s.updateVital}
          />
        );
      case 8:
        return <VentTab vent={s.vent} setVent={s.setVent} />;
      case 9:
        return <NursingTab />;
      case 10:
        return <PpgcTab carePlan={s.carePlan} updateCarePlan={s.updateCarePlan} />;
      default:
        return null;
    }
  };

  return (
    <PfcLayout
      tab={s.tab}
      setTab={s.setTab}
      treatmentsDone={s.treatmentsDone}
      tbsa={s.tbsa}
      exportPDF={exportPDF}
    >
      {renderTab()}
    </PfcLayout>
  );
}
