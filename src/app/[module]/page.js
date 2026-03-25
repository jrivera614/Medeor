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

const CONTENT = {
  march: {
    heading: "MARCH Protocol Training",
    intro: "Master the MARCH protocol — the systematic framework for Tactical Combat Casualty Care (TCCC). This module covers all five phases: Massive Hemorrhage control, Airway management, Respiration assessment, Circulation and shock management, and Hypothermia prevention.",
    topics: [
      "Massive hemorrhage: tourniquet application, wound packing with hemostatic gauze, junctional hemorrhage control",
      "Airway: NPA insertion, jaw-thrust, recovery position, surgical cricothyrotomy",
      "Respiration: tension pneumothorax recognition, vented chest seal application, needle decompression",
      "Circulation: IV/IO access, permissive hypotension, TXA administration, fluid resuscitation priority",
      "Hypothermia prevention: lethal triad, HPMK, ground insulation, heat packs",
    ],
    keywords: "MARCH protocol, TCCC training, tourniquet application, hemorrhage control, needle decompression, combat medic, 68W, CLS training"
  },
  epaws: {
    heading: "E-PAWS-B Secondary Survey Training",
    intro: "E-PAWS-B is the systematic secondary survey conducted after MARCH life threats are addressed. This module trains Examine, Pain management, Antibiotics, Wound care, Splinting, and Burns.",
    topics: [
      "Secondary survey: head-to-toe palpation, log roll, baseline vitals documentation",
      "Pain management: CWMP, OTFC 800mcg, ketamine analgesic and procedural dosing",
      "Antibiotics: moxifloxacin, ceftriaxone, metronidazole for penetrating wounds",
      "Wound care: irrigation, hemostatic gauze management, dressing changes",
      "Splinting: PMS checks, traction splints, pelvic binders",
      "Burns: Rule of Nines, Parkland formula, fluid resuscitation targets"
    ],
    keywords: "E-PAWS-B, combat casualty care, ketamine dosing, wound packing, Parkland formula, burn assessment, tactical medicine"
  },
  ravines: {
    heading: "RAVINES Prolonged Field Care Training",
    intro: "RAVINES is the Prolonged Field Care (PFC) priority framework for casualties requiring extended care beyond the golden hour. Train the full spectrum from resuscitation through surgical procedures.",
    topics: [
      "Resuscitate with blood products: whole blood, walking blood bank, permissive hypotension",
      "Reduce/convert tourniquets: reperfusion injury, conversion criteria, >6 hour protocol",
      "Airway care: cric/ETT management, capnography, cuff pressure, sedation management",
      "Ventilate: lung-protective strategy, MOVE mnemonic, PEEP, altitude considerations",
      "Initiate telemedicine: MIST format, 9-line MEDEVAC, problem list preparation",
      "Nursing care: HITMAN framework, vitals trending, DVT prophylaxis, wound care schedule",
      "Environmental: cold/heat/altitude/flight considerations",
      "Surgical procedures: thoracostomy, escharotomy, fasciotomy, lateral canthotomy"
    ],
    keywords: "prolonged field care, PFC, RAVINES, HITMAN nursing, telemedicine TCCC, walking blood bank, combat casualty management"
  },
  hemorrhage: {
    heading: "Hemorrhage Control Training",
    intro: "Hemorrhage is the number one cause of preventable combat death. This module covers the full spectrum of hemorrhage control from extremity tourniquets through junctional hemorrhage devices and blood product resuscitation.",
    topics: [
      "Tourniquet application: CAT Gen 7, SOF-T Wide, hasty vs deliberate, conversion criteria",
      "Wound packing: hemostatic gauze technique, 3-minute pressure, pressure dressings",
      "Junctional hemorrhage: CRoC, SAM-JT, JETT devices, groin and axillary wounds",
      "Blood products: whole blood preference, 1:1:1 resuscitation, TXA within 3 hours",
      "Permissive hypotension: SBP 80-90, TBI exception, endpoints of resuscitation",
      "Tourniquet conversion: criteria, technique, reperfusion injury after 6 hours"
    ],
    keywords: "hemorrhage control, tourniquet application, CAT Gen 7, wound packing, hemostatic gauze, junctional hemorrhage, TXA, blood resuscitation"
  },
  airway: {
    heading: "Airway Management Training",
    intro: "Airway obstruction is the second leading cause of preventable combat death. This module trains airway assessment and management from basic maneuvers through surgical cricothyrotomy and RSI.",
    topics: [
      "Airway assessment: patent vs partial vs complete obstruction, inhalation injury signs",
      "Basic maneuvers: head-tilt chin-lift, jaw-thrust for C-spine, suction technique",
      "NPA insertion: sizing nostril to earlobe, bevel toward septum, contraindications",
      "Recovery position: unconscious breathing casualties, aspiration prevention",
      "Supraglottic airways: KingLT-D, i-gel insertion and confirmation",
      "RSI: ketamine induction, succinylcholine vs rocuronium, laryngoscopy technique",
      "Surgical cricothyrotomy: landmarks, vertical skin incision, cuffed 6.0 tube, confirmation",
      "Capnography: EtCO2 normal range 35-45, waveform interpretation, tube confirmation"
    ],
    keywords: "airway management, NPA insertion, cricothyrotomy, RSI intubation, capnography, TCCC airway, combat medic airway, jaw thrust"
  },
  wbb: {
    heading: "Walking Blood Bank Training",
    intro: "The Walking Blood Bank (WBB) and ROLO program train military medics to establish pre-screened donor capability for fresh whole blood transfusion when stored products are unavailable.",
    topics: [
      "ROLO program: Ranger O Low Titer, anti-A/anti-B titer <256, Type O universal donors",
      "Pre-deployment screening: ABO/Rh confirmation, transmissible disease testing, donor roster",
      "Eldon card typing: on-site ABO confirmation, agglutination interpretation",
      "Collection procedure: CPDA-1 bags, 16g needle, 450ml unit, 8-minute collection",
      "Storage: room temperature 8 hours, refrigerated 35 days in CPDA-1, cold chain",
      "Transfusion: Y-set with 170-micron filter, calcium 1g per 4 units, reaction monitoring",
      "Transfusion reactions: acute hemolytic, febrile, allergic, anaphylactic, TACO management"
    ],
    keywords: "walking blood bank, ROLO program, whole blood transfusion, CPDA blood collection, military blood bank, combat transfusion, Eldon card typing"
  },
  "pfc-scenarios": {
    heading: "Tactical Medical Decision Scenarios",
    intro: "Decision-based tactical scenarios that train clinical judgment under pressure. Work through branching scenarios covering delayed MEDEVAC, penetrating chest trauma, mass casualty triage, and 24-hour prolonged field care.",
    topics: [
      "Delayed MEDEVAC: blast casualty with bilateral lower extremity injuries, tourniquet decisions at 6 hours",
      "Mountain OP: penetrating chest trauma at altitude, ventilation strategy, tension pneumo re-accumulation",
      "MASCAL triage: three simultaneous casualties, priority assignment, force multiplication",
      "24-hour PFC: isolated patrol base, two units whole blood, deterioration recognition, MEDEVAC handoff"
    ],
    keywords: "tactical medical scenarios, MASCAL triage, MEDEVAC planning, prolonged field care scenarios, combat medic training, TCCC decision making"
  }
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

export default async function ModulePage({ params }) {
  const p = await params;
  const content = CONTENT[p.module];

  return (
    <>
      {content && (
        <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }} aria-hidden="true">
          <h1>{content.heading}</h1>
          <p>{content.intro}</p>
          <ul>
            {content.topics.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
          <p>{content.keywords}</p>
        </div>
      )}
      <ModuleClient />
    </>
  );
}
