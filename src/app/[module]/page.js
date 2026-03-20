import ModuleClient from "./ModuleClient";

const META = {
  march: { t: "MARCH Protocol Training - Free TCCC Quiz & Flashcards | Medeor", d: "Interactive MARCH protocol training with step-by-step walkthrough, 15 quiz questions with rationale, and spaced repetition flashcards. Hemorrhage, airway, respiration, circulation, hypothermia." },
  epaws: { t: "E-PAWS-B Training - Pain, Antibiotics, Wounds, Burns | Medeor", d: "E-PAWS-B secondary survey training. Pain management with ketamine, OTFC, CWMP. Antibiotics, wound care, splinting, and burn management with Parkland formula." },
  ravines: { t: "RAVINES PFC Training - Prolonged Field Care | Medeor", d: "RAVINES prolonged field care training. Resuscitation, airway care, ventilation MOVE, telemedicine, HITMAN nursing, environmental, and surgical procedures." },
  hemorrhage: { t: "Hemorrhage Control Training - Tourniquets & Packing | Medeor", d: "Hemorrhage control: tourniquet application, wound packing with hemostatic gauze, junctional devices CRoC SAM-JT JETT, conversion, blood products." },
  airway: { t: "Airway Management Training - NPA, Cric, RSI | Medeor", d: "Airway management from basic maneuvers through surgical cricothyrotomy. NPA, supraglottic airways, RSI protocols, capnography interpretation." },
  wbb: { t: "Walking Blood Bank Training - ROLO & Transfusion | Medeor", d: "Walking Blood Bank WBB training. ROLO program, donor screening, Eldon cards, CPDA collection, transfusion reactions, cold chain." },
  "pfc-scenarios": { t: "Tactical Medical Scenarios - Decision Training | Medeor", d: "Branching tactical scenarios: delayed MEDEVAC, chest trauma, MASCAL triage, 24-hour PFC. Test clinical decision-making under pressure." }
};

export async function generateMetadata({ params }) {
  const p = await params;
  const m = META[p.module];
  if (!m) return { title: "Training Module | Medeor" };
  return {
    title: m.t,
    description: m.d,
    openGraph: { title: m.t, description: m.d, url: `https://medeor.app/${p.module}` },
    alternates: { canonical: `https://medeor.app/${p.module}` },
  };
}

export default function ModulePage() {
  return <ModuleClient />;
}
