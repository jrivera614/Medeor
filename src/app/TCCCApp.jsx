"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const TOPICS = [
  {
    id: "march", title: "MARCH Protocol", icon: "🩸", color: "#ef4444", subtitle: "Systematic casualty assessment",
    steps: [
      { title: "M — Massive Hemorrhage", detail: "Control life-threatening bleeding immediately. Tourniquet high and tight on extremities. Junctional: wound packing with hemostatic gauze, direct pressure 3+ min.", instruction: "TOURNIQUET: 2-3 inches above wound, over uniform. Twist windlass until bleeding stops. Lock, mark time." },
      { title: "A — Airway", detail: "Establish patent airway. Head-tilt chin-lift or jaw thrust. Insert NPA sized nostril to earlobe. Consider cric if facial trauma.", instruction: "NPA: Lubricate, bevel toward septum, right nostril. Advance along nasal floor." },
      { title: "R — Respiration", detail: "Look, listen, feel. Check for tension pneumo. Chest seal on open wounds. Needle decompression 2nd ICS MCL if needed.", instruction: "CHEST SEAL: Wipe dry, apply on exhale. Monitor for tension pneumo development." },
      { title: "C — Circulation", detail: "Assess shock signs. IV/IO access. TXA 1g within 3 hours. Prevent hypothermia triad.", instruction: "SHOCK: Elevate legs. Hypothermia prevention. Reassess mental status frequently." },
      { title: "H — Hypothermia/Head Injury", detail: "Prevent hypothermia. Monitor LOC, pupils, GCS. Position unconscious on side.", instruction: "Ground insulation critical. Cover head. Minimize exposure. Neuro checks q15." }
    ],
    quiz: [
      { q: "What does 'M' in MARCH stand for?", options: ["Massive Hemorrhage", "Medical Assessment", "Monitor Airway", "Movement"], correct: 0 },
      { q: "Where should a tourniquet be placed?", options: ["On the wound", "2-3 inches above wound", "Below wound", "On nearest joint"], correct: 1 },
      { q: "What is the lethal triad?", options: ["Pain, shock, death", "Hypothermia, acidosis, coagulopathy", "ABC", "Hemorrhage, fracture, burn"], correct: 1 },
      { q: "TXA window?", options: ["1 hr", "2 hr", "3 hr", "6 hr"], correct: 2 },
      { q: "Needle decompression primary site?", options: ["5th ICS AAL", "2nd ICS MCL", "4th ICS MAL", "3rd ICS MCL"], correct: 1 }
    ],
    flashcards: [
      { front: "Tourniquet time limit?", back: "No arbitrary limit in TCCC. Document time. Do NOT loosen in field." },
      { front: "NPA contraindication?", back: "Suspected basilar skull fracture (raccoon eyes, Battle's sign, CSF)." },
      { front: "Vented vs non-vented seal?", back: "Vented auto-releases air. Non-vented must be burped if resp worsens." },
      { front: "Tension pneumo signs?", back: "Absent breath sounds, tracheal deviation, JVD, hypotension, cyanosis." }
    ]
  },
  {
    id: "epaws", title: "E-PAWS-B", icon: "🔄", color: "#f59e0b", subtitle: "Extended assessment after MARCH",
    steps: [
      { title: "E — Everything Else / Secondary Survey", detail: "After MARCH is complete and life threats addressed, conduct a detailed head-to-toe secondary survey. Reassess all interventions. Get vital signs to begin trending. This transitions from immediate life-saving to comprehensive care.", instruction: "HEAD-TO-TOE: Palpate skull, face, neck (C-spine), chest, abdomen, pelvis (do NOT rock), all extremities. Log roll to check back. Document everything found." },
      { title: "P — Pain Management", detail: "Assess pain using 0-10 scale. Administer pain control per TCCC guidelines. Mild/moderate: Combat Wound Medication Pack (CWMP) with acetaminophen and meloxicam. Moderate/severe: oral transmucosal fentanyl citrate (OTFC) 800mcg lozenge. Severe: ketamine IV/IM/IN.", instruction: "CWMP: Acetaminophen 650mg + Meloxicam 15mg PO. OTFC: Place between cheek and gum, do NOT chew. Monitor respiratory rate closely after any opioid." },
      { title: "A — Antibiotics", detail: "Administer antibiotics for all open combat wounds. Preferred: Moxifloxacin 400mg PO (if casualty can swallow). Alternative: Ertapenem 1g IV/IM. Penetrating abdominal/pelvic wounds or severe burns: add metronidazole.", instruction: "Give antibiotics as early as possible. Combat pill pack typically contains Moxifloxacin 400mg. For gut wounds: Ertapenem 1g IM + Metronidazole 500mg IV q8hr." },
      { title: "W — Wound Management", detail: "Inspect and dress all wounds. Irrigate when possible (clean water or saline). Apply fresh sterile dressings. Do NOT close wounds in the field (high infection risk). Pack open wounds loosely. Check for foreign bodies.", instruction: "WOUND CARE: Remove gross contamination. Irrigate. Pack loosely with moist gauze. Cover with sterile dressing. Do NOT use primary closure in the field." },
      { title: "S — Splinting", detail: "Splint all suspected fractures and dislocations. Immobilize joint above and below fracture. Check pulse, motor, sensation (PMS) before and after splinting. Use SAM splints, improvised materials, or traction splints for femur fractures.", instruction: "SPLINT: Pad all bony prominences. Immobilize in position found unless PMS is compromised. Reassess PMS after application. Traction splint for mid-shaft femur fx." },
      { title: "B — Burns", detail: "Assess burn percentage using Rule of Nines. Cover with dry sterile dressings (do NOT use wet dressings on large burns as this promotes hypothermia). Fluid resuscitation for burns >20% TBSA using modified Parkland formula. Manage pain aggressively.", instruction: "RULE OF NINES: Head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%. Fluids: 4ml x kg x %TBSA, half in first 8 hours." }
    ],
    quiz: [
      { q: "What does E-PAWS-B stand for?", options: ["Everything, Pain, Antibiotics, Wounds, Splinting, Burns", "Evacuation, Pulse, Airway, Water, Security, Breathing", "Examine, Pulse, Assessment, Wound, Shock, Blood", "Equipment, Prep, Airway, Water, Splint, Bandage"], correct: 0 },
      { q: "First-line antibiotic for open combat wounds?", options: ["Amoxicillin", "Moxifloxacin 400mg PO", "Doxycycline", "Ciprofloxacin"], correct: 1 },
      { q: "OTFC dosage for moderate/severe pain?", options: ["400mcg", "600mcg", "800mcg", "1200mcg"], correct: 2 },
      { q: "Why avoid primary closure in the field?", options: ["Lack of sutures", "High infection risk", "Not enough time", "Only surgeons can close"], correct: 1 },
      { q: "Burns >20% TBSA require:", options: ["Wet dressings only", "Oral fluids only", "IV fluid resuscitation", "Immediate skin grafting"], correct: 2 },
      { q: "Modified Parkland formula:", options: ["2ml x kg x %TBSA", "4ml x kg x %TBSA", "6ml x kg x %TBSA", "10ml x kg x %TBSA"], correct: 1 }
    ],
    flashcards: [
      { front: "Combat Wound Medication Pack contents?", back: "Acetaminophen 650mg (pain), Meloxicam 15mg (anti-inflammatory/pain). Given PO for mild-moderate pain. Give early." },
      { front: "Ketamine field dosing?", back: "IV: 20-30mg slow push (repeat q20min PRN). IM: 50-100mg. IN: 50-100mg. Dissociative dose: 1-2mg/kg IV. Monitor airway." },
      { front: "When to add Metronidazole?", back: "Penetrating abdominal/pelvic wounds, to cover anaerobic bacteria. 500mg IV q8hr in addition to Ertapenem." },
      { front: "Femur traction splint indication?", back: "Mid-shaft femur fracture. Contraindicated in: hip/pelvic fx, knee injury, ankle fx on same side. Check PMS before and after." },
      { front: "Why dry dressings on large burns?", back: "Wet dressings on large burns promote hypothermia. Only use wet dressings on small burns (<5% TBSA) for pain relief." }
    ]
  },
  {
    id: "ravines", title: "RAVINES (PFC)", icon: "🏔️", color: "#06b6d4", subtitle: "Prolonged Field Care priorities",
    steps: [
      { title: "R — Resuscitate & Reduce Tourniquets", detail: "Resuscitate with whole blood (preferred) or blood products. Reduce or convert tourniquets to hemostatic dressings/pressure dressings when tactically feasible. Prolonged tourniquet use causes ischemia and potential limb loss. Reassess all hemorrhage control.", instruction: "TOURNIQUET CONVERSION: Only when situation permits. Loosen slowly while maintaining direct pressure with hemostatic gauze. If bleeding restarts, retighten immediately. Document conversion attempt and time." },
      { title: "A — Airway & Cric Care Package", detail: "Reassess definitive airway. If intubated or cric in place: check capnography (EtCO2), tube depth, cuff pressure, sedation drip adequacy, sterile suctioning schedule, heat moisture exchanger (HME) filter in place.", instruction: "CRIC CARE: Verify tube position with capnography. Check cuff pressure (20-30 cmH2O). Suction q2-4hr with sterile technique. Ensure HME is in circuit. Reassess sedation depth continuously." },
      { title: "V — Ventilate & Oxygenate", detail: "Apply lung-protective ventilation strategies. Use PEEP (positive end-expiratory pressure) to improve oxygenation. Target SpO2 >92%. Assess using the MOVE mnemonic (Mode, Oxygenation, Ventilation, Evaluation). Avoid hyperventilation except for herniation.", instruction: "LUNG PROTECTIVE: Tidal volume 6-8ml/kg IBW. PEEP 5-10 cmH2O. Rate 12-20. Avoid plateau pressures >30 cmH2O. Monitor with pulse ox and capnography." },
      { title: "I — Initiate Telemedicine & Evacuation", detail: "Contact telemedicine support as early as possible and as often as needed. Prepare and transmit MIST report. Initiate 9-line MEDEVAC request. Communicate patient status updates. Plan for contingencies if evacuation is delayed or denied.", instruction: "TELEMEDICINE: Have vitals, exam findings, med list, and problem list ready before call. Take photos of wounds if possible. Request guidance on meds, procedures, and disposition. Document recommendations." },
      { title: "N — Nursing Care", detail: "Comprehensive nursing care for prolonged patients: monitor and trend vitals and I/Os (especially urine output), position patient head up 30 degrees, DVT prophylaxis (leg massage, passive ROM), turn patient q2hr (pressure injury prevention), oral hygiene, eye care.", instruction: "NURSING MNEMONICS: HITMAN (Head-to-toe, Infection, Tubes, Medications, Administration, Nursing care) or SHEEP VOMIT (Skin, Hypo/Hyperthermia, Elevate head, Exercises, Pad stretcher, Venous access, Oral care, Medications, I&O, Tubes)." },
      { title: "E — Environmental Considerations", detail: "Address environment-specific patient needs often overlooked in PFC: shade/sunscreen, mosquito netting in endemic areas, ear protection for transport/flight, eye drops in dry environments, chapstick, padding litter/pressure points, motion sickness prophylaxis for evacuation.", instruction: "ENVIRONMENT: Cold = aggressive warming, insulation from ground. Hot = shade, cooling, hydration. Flight = ear protection, secure all lines, motion sickness meds pre-transport." },
      { title: "S — Surgical Procedures", detail: "PFC-level surgical procedures that may be required: cricothyrotomy, finger/tube thoracostomy, escharotomy (circumferential burns), fasciotomy (compartment syndrome), lateral canthotomy (orbital compartment syndrome), wound debridement, delayed primary closure, vascular shunting.", instruction: "KEY POINT: Only perform procedures within your training and scope. Consult telemedicine before any surgical procedure if possible. Document indications, technique, and outcomes." }
    ],
    quiz: [
      { q: "What does RAVINES stand for?", options: ["Resuscitate/Reduce, Airway, Ventilate, Initiate, Nursing, Environment, Surgical", "Respond, Assess, Ventilate, IV, Neuro, Evacuate, Splint", "Rescue, Airway, Vitals, Intubate, Needle, Evacuate, Secure", "Reassess, Antibiotics, Ventilate, IV, Nursing, Equipment, Shock"], correct: 0 },
      { q: "When should telemedicine be initiated in PFC?", options: ["Only if patient deteriorates", "As early as possible", "After 6 hours", "Only for surgical procedures"], correct: 1 },
      { q: "Lung-protective tidal volume target?", options: ["4-5 ml/kg", "6-8 ml/kg", "10-12 ml/kg", "15-20 ml/kg"], correct: 1 },
      { q: "How often should PFC patients be turned?", options: ["Every hour", "Every 2 hours", "Every 4 hours", "Every 8 hours"], correct: 1 },
      { q: "Tourniquet conversion should only occur when:", options: ["Always after 2 hours", "Situation permits and hemostatics available", "Patient requests it", "Never in PFC"], correct: 1 },
      { q: "PEEP in PFC ventilation is used to:", options: ["Increase tidal volume", "Improve oxygenation", "Decrease respiratory rate", "Prevent aspiration"], correct: 1 }
    ],
    flashcards: [
      { front: "HITMAN nursing mnemonic?", back: "Head-to-toe exam, Infection (clean/irrigate wounds, change dressings q12hr), Tubes (check/clean all adjuncts, secure, replace air in cuffs with water), Medications (analgesics, antibiotics, monitor levels), Administration (documentation, replenish, plan evac), Nursing care." },
      { front: "SHEEP VOMIT nursing mnemonic?", back: "Skin protection (sun, insects), Hypo/Hyperthermia, Elevate head, Exercises (passive ROM), Pad stretcher/pressure points, Venous access (rotate IV/IO sites q24hr), Oral care, Medications, I&O (track ins and outs, urine output), Tubes (check all)." },
      { front: "MOVE ventilation assessment?", back: "Mode (what ventilation mode), Oxygenation (SpO2, FiO2), Ventilation (EtCO2, rate, tidal volume), Evaluation (reassess, trends, changes needed)." },
      { front: "When NOT to convert a tourniquet?", back: "Active combat/threat, casualty in shock, tourniquet on >6 hours (risk of reperfusion injury), amputation, or if you lack hemostatic agents/dressings." },
      { front: "Telemedicine prep checklist?", back: "Patient demographics, mechanism, injuries found, vitals (current + trends), all treatments given with times, current meds, allergies, problem list, specific questions for consultant." }
    ]
  },
  {
    id: "tourniquet", title: "Hemorrhage Control", icon: "🔴", color: "#dc2626", subtitle: "Tourniquets & wound packing",
    steps: [
      { title: "Assess the Hemorrhage", detail: "Arterial: bright red, spurting. Venous: dark red, steady. Blood sweep head to toe.", instruction: "BLOOD SWEEP: Gloved hands under casualty. Check neck, axillae, groin, extremities." },
      { title: "Tourniquet Application", detail: "CoTCCC-approved tourniquet 2-3 inches above wound. Twist windlass until distal pulse absent.", instruction: "CAT: Route band, pull tight. Twist windlass. Lock, secure strap, write time." },
      { title: "Wound Packing", detail: "Junctional hemorrhage: expose, pack with hemostatic gauze deep to superficial. Direct pressure 3 min.", instruction: "Pack firmly from deepest point outward. Use entire roll. Do not release to check." },
      { title: "Pressure Dressing", detail: "Israeli Bandage over packing. If soaking through, add more. Do NOT remove original.", instruction: "Pad over wound, wrap, hook pressure bar, reverse, wrap, secure." },
      { title: "Reassess", detail: "Check q15 min. Failed tourniquet = second proximal to first.", instruction: "If shock persists despite hemorrhage control, suspect internal bleeding." }
    ],
    quiz: [
      { q: "Bright red spurting blood is:", options: ["Venous", "Arterial", "Capillary", "Internal"], correct: 1 },
      { q: "Min pressure time after packing?", options: ["1 min", "2 min", "3 min", "5 min"], correct: 2 },
      { q: "Failed tourniquet action:", options: ["Remove/reapply", "Second proximal", "Switch to packing", "Loosen/retighten"], correct: 1 }
    ],
    flashcards: [
      { front: "CoTCCC tourniquets?", back: "CAT, SOF-T Wide, and others on the approved list." },
      { front: "Can you tourniquet a neck?", back: "No. Wound packing + direct pressure." }
    ]
  },
  {
    id: "airway", title: "Airway Management", icon: "💨", color: "#3b82f6", subtitle: "NPA, recovery position, cric",
    steps: [
      { title: "Assess Airway", detail: "Look, listen, feel. Talking = patent. Snoring/gurgling = partial. Silence = complete obstruction.", instruction: "If unconscious, assume compromised until proven otherwise." },
      { title: "Basic Maneuvers", detail: "Head-tilt chin-lift or jaw-thrust (C-spine concern). Finger sweep only if visible.", instruction: "JAW THRUST: Fingers behind mandible angle bilaterally. Push forward/upward." },
      { title: "NPA Insertion", detail: "Size nostril to earlobe. Lubricate. Bevel toward septum. Larger nostril.", instruction: "If resistance, try other nostril. Secure with safety pin. Contraindicated in basilar skull fx." },
      { title: "Recovery Position", detail: "Unconscious breathing casualty on side. Upper leg bent 90 degrees.", instruction: "Roll toward you. Extend lower arm. Bend upper knee. Tilt head for drainage." },
      { title: "Surgical Cricothyrotomy", detail: "Last resort. Cricothyroid membrane. Vertical skin, horizontal membrane. Insert tube.", instruction: "Palpate, stabilize, vertical 3cm skin, horizontal stab, insert tube, secure, confirm." }
    ],
    quiz: [
      { q: "Partial obstruction sign?", options: ["Silence", "Snoring/gurgling", "Screaming", "Normal speech"], correct: 1 },
      { q: "NPA contraindicated in:", options: ["Unconscious", "Basilar skull fx", "Nosebleed", "Breathing"], correct: 1 },
      { q: "Cricothyroid membrane location:", options: ["Hyoid/thyroid", "Thyroid/cricoid", "Cricoid/1st ring", "Mandible/hyoid"], correct: 1 }
    ],
    flashcards: [
      { front: "NPA bevel direction?", back: "Toward septum (midline)." },
      { front: "Basilar skull fx signs?", back: "Raccoon eyes, Battle's sign, CSF from ears/nose." }
    ]
  },
  {
    id: "pfc-scenarios", title: "PFC Scenarios", icon: "⏱️", color: "#8b5cf6", subtitle: "Prolonged care decision exercises",
    scenarios: [
      {
        title: "Delayed MEDEVAC — Blast Casualty",
        setup: "Your team's vehicle hit an IED 6 hours ago. One casualty: bilateral lower extremity injuries, tourniquet on left leg (applied 5.5 hours ago), right leg has deep lacerations packed and bandaged. MEDEVAC denied due to weather. You're in a patrol base with your CLS bag and aid bag. The casualty is conscious but in significant pain. Vitals: HR 110, BP 90/60, RR 22, SpO2 94%, temp 96.2F.",
        decisions: [
          {
            prompt: "The left tourniquet has been on for 5.5 hours. What's your priority?",
            options: [
              { text: "Convert the tourniquet immediately to prevent limb loss", result: "RISKY. After 6 hours, tourniquet conversion carries significant reperfusion injury risk (hyperkalemia, acidosis). You should consult telemedicine before attempting conversion. The metabolic load from releasing a 6-hour tourniquet can cause cardiac arrest.", correct: false },
              { text: "Initiate telemedicine consult before making a decision on the tourniquet", result: "CORRECT. With a tourniquet on >6 hours, the risk of reperfusion injury (hyperkalemia, metabolic acidosis, potential cardiac arrest) is significant. Telemedicine can guide the decision and help you prepare for complications (calcium chloride, bicarbonate, monitoring). They may advise leaving it in place.", correct: true },
              { text: "Leave the tourniquet and focus on other priorities", result: "PARTIALLY CORRECT. The tourniquet shouldn't be removed casually after this long, but you also need to actively address the situation, not just ignore it. Initiate telemedicine to discuss the conversion risk vs. benefit.", correct: false }
            ]
          },
          {
            prompt: "Telemedicine advises leaving the tourniquet for now. The casualty's temp is 96.2F and dropping. Pain is 8/10. What's next using RAVINES?",
            options: [
              { text: "Focus on hypothermia prevention and pain management simultaneously", result: "CORRECT. Hypothermia is actively worsening and contributes to the lethal triad. Aggressively rewarm: insulate from ground, wrap in blankets, cover head, warm IV fluids if possible. Simultaneously address pain: ketamine 20-30mg IV slow push is preferred in this hemodynamically unstable patient (avoids respiratory depression and supports BP).", correct: true },
              { text: "Give fentanyl lozenge for pain first, then address temperature", result: "SUBOPTIMAL. OTFC/fentanyl risks respiratory depression in a patient with borderline vitals (BP 90/60, SpO2 94%). Ketamine is the preferred analgesic in hemodynamically unstable patients. Also, hypothermia needs immediate attention as it worsens coagulopathy.", correct: false },
              { text: "Start IV fluid bolus to address the low blood pressure", result: "PARTIALLY CORRECT. Resuscitation is important (R in RAVINES), but crystalloids alone won't fix this patient. Whole blood or blood products are preferred. And the immediate threats of hypothermia and pain still need addressing. A balanced approach hitting multiple RAVINES priorities simultaneously is key.", correct: false }
            ]
          },
          {
            prompt: "Patient is warmer, pain controlled with ketamine. It's now hour 10. You need to plan for the night. What nursing care priorities?",
            options: [
              { text: "Position head up, monitor vitals q30min, passive ROM, turn q2hr, track urine output", result: "CORRECT. Full nursing care per RAVINES 'N': Head elevated 30 degrees (reduces ICP, aspiration risk), vitals trending q30min (catch deterioration early), passive ROM and repositioning q2hr (prevent DVT, pressure injuries), track I&Os with emphasis on urine output (>0.5ml/kg/hr target = adequate perfusion).", correct: true },
              { text: "Let the patient sleep undisturbed, check vitals every 4 hours", result: "INCORRECT. Prolonged field care requires aggressive monitoring and nursing interventions. Every 4 hours is too infrequent. You'll miss deterioration. The patient needs frequent neuro checks, vital signs trending, repositioning, and ongoing assessment.", correct: false },
              { text: "Focus only on wound checks and medication schedule", result: "INCOMPLETE. Wound care and meds are important but nursing care in PFC is comprehensive. You're missing vital signs trending, positioning, DVT prophylaxis, I&O tracking, pressure injury prevention, and oral/eye care.", correct: false }
            ]
          }
        ]
      },
      {
        title: "Mountain OP — Penetrating Chest Trauma",
        setup: "Your sniper team is on a mountain observation post at 8,000 feet. Your partner takes shrapnel to the right chest from a mortar. You've completed MARCH: chest seal applied (vented), needle decompression performed once (improved), IV established, TXA given. MEDEVAC is 18-24 hours out. He's sedated on ketamine drip. Vitals: HR 100, BP 100/70, RR 16 (assisted with BVM), SpO2 91%, EtCO2 38.",
        decisions: [
          {
            prompt: "SpO2 is 91% at 8,000 feet with BVM assist. Using RAVINES, what's your ventilation strategy?",
            options: [
              { text: "Apply PEEP valve to BVM and optimize ventilation with lung-protective strategy", result: "CORRECT. The 'V' in RAVINES. At altitude, SpO2 91% is concerning. Add PEEP (5-10 cmH2O) to improve oxygenation. Use lung-protective strategy: avoid over-ventilation, target EtCO2 35-45, gentle squeeze volumes. Monitor with capnography and pulse ox. The altitude is compounding the respiratory compromise.", correct: true },
              { text: "Increase ventilation rate to 20-24 breaths per minute", result: "INCORRECT. Hyperventilation worsens outcomes. It decreases cardiac preload, increases intrathoracic pressure, and can worsen a pneumothorax. Stick to 12-20 breaths/min. Improve oxygenation with PEEP, not rate.", correct: false },
              { text: "Perform a second needle decompression", result: "NOT YET. SpO2 of 91% at 8,000 feet could be altitude-related, not necessarily re-accumulation of pneumothorax. Reassess breath sounds first. If tension pneumo signs recur (absent sounds, JVD, tracheal deviation), then decompress again. Try PEEP first.", correct: false }
            ]
          },
          {
            prompt: "It's been 6 hours. The chest seal is getting dirty and loosening. The cric kit is in your bag but he has an intact airway with NPA + BVM. Environmental conditions: wind chill 20F, exposed position.",
            options: [
              { text: "Replace chest seal, aggressively address hypothermia, continue BVM with PEEP", result: "CORRECT. Environmental considerations ('E' in RAVINES) are critical at 8,000 feet in 20F wind chill. Replace the failing seal with a clean one. Aggressively insulate: wrap in everything available, insulate from ground, windbreak, cover head and extremities. Continue current airway management since it's working.", correct: true },
              { text: "Perform cricothyrotomy to secure a definitive airway before conditions worsen", result: "RISKY. A cric is a major procedure with complications. His current airway (NPA + BVM) is maintaining adequate ventilation. An unnecessary surgical procedure in austere conditions introduces infection risk, bleeding risk, and uses limited supplies. Reassess if airway becomes compromised.", correct: false },
              { text: "Focus on calling for faster evacuation", result: "INCOMPLETE. Evacuation was already requested and is 18-24 hours out. While you should update higher with the patient's status, you can't just wait. The patient needs active management of the failing chest seal and the life-threatening environmental conditions right now.", correct: false }
            ]
          }
        ]
      }
    ]
  }
];

// ─── CPG DATA ────────────────────────────────────────────────────────────────
const CPGS = [
  { category: "TCCC Guidelines", color: "#ef4444", items: [
    { title: "TCCC Guidelines (Current)", url: "https://deployedmedicine.com/market/31/content/40", date: "Jan 2024" },
    { title: "Prolonged Casualty Care Guidelines", url: "https://jts.health.mil/assets/docs/cpgs/Prolonged_Casualty_Care_01_Jul_2021_ID87.pdf", date: "Jul 2021" },
    { title: "Prehospital Blood Transfusion", url: "https://jts.health.mil/assets/docs/cpgs/Prehospital_Blood_Transfusion_30_Oct_2020_ID82.pdf", date: "Oct 2020" }
  ]},
  { category: "Hemorrhage & Resuscitation", color: "#dc2626", items: [
    { title: "Damage Control Resuscitation", url: "https://jts.health.mil/assets/docs/cpgs/Damage_Control_Resuscitation_12_Jul_2019_ID18.pdf", date: "Jul 2019" },
    { title: "DCR in Prolonged Field Care", url: "https://jts.health.mil/assets/docs/cpgs/Damage_Control_Resuscitation_PFC_01_Oct_2018_ID73.pdf", date: "Oct 2018" },
    { title: "Whole Blood Transfusion", url: "https://jts.health.mil/assets/docs/cpgs/Whole_Blood_Transfusion_15_May_2018_ID21.pdf", date: "May 2018" },
    { title: "REBOA for Hemorrhagic Shock", url: "https://jts.health.mil/assets/docs/cpgs/REBOA_for_Hemorrhagic_Shock_03_Dec_2025_ID66.pdf", date: "Dec 2025" },
    { title: "Emergent Resuscitative Thoracotomy", url: "https://jts.health.mil/assets/docs/cpgs/Emergent_Resuscitative_Thoracotomy_18_Jul_2018_ID30.pdf", date: "Jul 2018" },
    { title: "Vascular Injury", url: "https://jts.health.mil/assets/docs/cpgs/Vascular_Injury_07_Mar_2018_ID20.pdf", date: "Mar 2018" }
  ]},
  { category: "Airway & Respiration", color: "#3b82f6", items: [
    { title: "Airway Management in Trauma", url: "https://jts.health.mil/assets/docs/cpgs/Airway_Management_in_Trauma_28_Jan_2026_ID84.pdf", date: "Jan 2026" },
    { title: "Ventilator Management (UPAC)", url: "https://jts.health.mil/assets/docs/cpgs/UPAC_Vaporizer_and_Mechanical_Ventilation_CPG_Feb_2025_ID90.pdf", date: "Feb 2025" },
    { title: "Ventilator-Associated Pneumonia", url: "https://jts.health.mil/assets/docs/cpgs/Ventilator_Associated_Pneumonia_07_May_2020_ID80.pdf", date: "May 2020" }
  ]},
  { category: "Head, Spine & Neuro", color: "#8b5cf6", items: [
    { title: "TBI Management & Neurosurgery", url: "https://jts.health.mil/assets/docs/cpgs/TBI_Management_and_Neurosurgery_02_Mar_2024_ID14.pdf", date: "Mar 2024" },
    { title: "Acute Concussion Management", url: "https://jts.health.mil/assets/docs/cpgs/Acute_Concussion_Management_and_Return_to_Activity_Jan_2021_ID81.pdf", date: "Jan 2021" },
    { title: "Cervical & Thoracolumbar Spine", url: "https://jts.health.mil/assets/docs/cpgs/Spine_Injury_Evaluation_Transport_Surgery_19_Jun_2020_ID42.pdf", date: "Jun 2020" },
    { title: "Stroke & Cerebrovascular", url: "https://jts.health.mil/assets/docs/cpgs/Stroke_and_Cerebrovascular_Emergencies_03_Jul_2024_ID92.pdf", date: "Jul 2024" }
  ]},
  { category: "Surgical & Wound Care", color: "#f59e0b", items: [
    { title: "Blunt Abdominal Trauma", url: "https://jts.health.mil/assets/docs/cpgs/Blunt_Abdominal_Trauma_13_May_2020_ID32.pdf", date: "May 2020" },
    { title: "Compartment Syndrome & Fasciotomy", url: "https://jts.health.mil/assets/docs/cpgs/Compartment_Syndrome_and_Fasciotomy_25_Jul_2016_ID22.pdf", date: "Jul 2016" },
    { title: "Wound Care & Splinting in PCC", url: "https://jts.health.mil/assets/docs/cpgs/Nursing_Wound_Care_Splint_Mgmt_in_PCC_08_Jul_2025_ID96.pdf", date: "Jul 2025" }
  ]},
  { category: "Infections & Burns", color: "#10b981", items: [
    { title: "Burn Care", url: "https://jts.health.mil/assets/docs/cpgs/Burn_Care_CPG_10_June_2025_ID12.pdf", date: "Jun 2025" },
    { title: "Infection Prevention", url: "https://jts.health.mil/assets/docs/cpgs/Infection_Prevention_in_Combat_Related_Injuries_27_Jan_2021_ID24.pdf", date: "Jan 2021" },
    { title: "Invasive Fungal Infection", url: "https://jts.health.mil/assets/docs/cpgs/Invasive_Fungal_Infection_in_War_Wounds_17_Jul_2023_ID37.pdf", date: "Jul 2023" },
    { title: "Sepsis Management in PFC", url: "https://jts.health.mil/assets/docs/cpgs/Sepsis_Management_in_PFC_28_Oct_2020_ID76.pdf", date: "Oct 2020" }
  ]},
  { category: "Environmental & Specialty", color: "#f97316", items: [
    { title: "Exertional Heat Illness", url: "https://jts.health.mil/assets/docs/cpgs/Exertional_Heat_Illness_Jun_2024_ID88.pdf", date: "Jun 2024" },
    { title: "Altitude Emergencies", url: "https://jts.health.mil/assets/docs/cpgs/Altitude_Emergencies_Prehospital_05_Mar_2024_ID86.pdf", date: "Mar 2024" },
    { title: "CBRN Injury Part I", url: "https://jts.health.mil/assets/docs/cpgs/CBRN_Injury_Part_I_01_May_2018_ID47.pdf", date: "May 2018" },
    { title: "Aural Blast Injury", url: "https://jts.health.mil/assets/docs/cpgs/Aural_Blast_Injury_14_Aug_2025_ID94.pdf", date: "Aug 2025" },
    { title: "Ocular Trauma", url: "https://jts.health.mil/assets/docs/cpgs/Ocular_Trauma_05_May_2022_ID52.pdf", date: "May 2022" },
    { title: "Acute Mental Health", url: "https://jts.health.mil/assets/docs/cpgs/Acute_Mental_Health_Conditions_16_Jan_2024_ID85.pdf", date: "Jan 2024" },
    { title: "Exertional Rhabdomyolysis", url: "https://jts.health.mil/assets/docs/cpgs/Exertional_Rhabdomyolysis_2020_ID83.pdf", date: "2020" },
    { title: "Spider & Scorpion Envenomation", url: "https://jts.health.mil/assets/docs/cpgs/Spider_and_Scorpion_Envenomation_09_Feb_2021_ID65.pdf", date: "Feb 2021" }
  ]}
];



// ─── SKILLS VIDEOS ───────────────────────────────────────────────────────────

const VIDEOS = [
  { mod: "03", title: "Care Under Fire", color: "#ef4444", vids: ["CUF Bleeding Control", "One-Handed Windlass TQ", "One-Handed Ratchet TQ", "One-Person Drags/Carries", "Two-Person Drags/Carries"] },
  { mod: "05", title: "Tactical Trauma Assessment", color: "#f59e0b", vids: ["TTA How-To", "TTA: Firefight (Conscious)", "TTA: Explosion (Unconscious)"] },
  { mod: "06", title: "Massive Hemorrhage (TFC)", color: "#dc2626", vids: ["Two-Handed Windlass TQ", "Two-Handed Ratchet TQ", "TQ Conversion", "Wound Packing w/ Hemostatic", "Pressure Dressing", "Junctional Hemorrhage (Inguinal)", "Improvised Junctional PDD"] },
  { mod: "07", title: "Airway Management (TFC)", color: "#3b82f6", vids: ["Head-Tilt/Chin-Lift", "Jaw Thrust", "NPA Insertion", "Recovery Position", "Surgical Cric", "Suction Device"] },
  { mod: "08", title: "Respiration Management", color: "#8b5cf6", vids: ["Chest Seal (Vented)", "Chest Seal (Non-Vented)", "Needle Decompression (2nd ICS)", "Needle Decompression (5th ICS)"] },
  { mod: "09", title: "Circulation", color: "#dc2626", vids: ["IV Access", "IO Access", "Fluid Resuscitation", "TXA Administration"] },
  { mod: "11", title: "Hypothermia Prevention", color: "#06b6d4", vids: ["Hypothermia Prevention Wrap", "Hypo Prevention Kit", "Lethal Triad Overview"] },
  { mod: "13", title: "Pain Management", color: "#10b981", vids: ["CWMP Administration", "OTFC (Fentanyl Lozenge)", "Pain Assessment"] },
  { mod: "14", title: "Splinting", color: "#f97316", vids: ["SAM Splint", "Improvised Splint", "Traction Splint (Femur)"] },
  { mod: "17", title: "Documentation", color: "#6366f1", vids: ["DD 1380 (TCCC Card)", "MIST Report"] },
  { mod: "18", title: "Casualty Monitoring", color: "#f59e0b", vids: ["MARCH-PAWS Reassessment", "Pulse Checks", "LOC Assessment"] },
  { mod: "19", title: "Pre-Evac / 9-Line", color: "#10b981", vids: ["9-Line MEDEVAC", "MIST Handoff", "Casualty Prep for Evac"] },
  { mod: "20", title: "Evacuation", color: "#10b981", vids: ["Litter Carries", "Vehicle Evac", "Aircraft Loading/Handoff"] }
];

// ─── RANGER MEDIC HANDBOOK — FULL CONTENT ────────────────────────────────────

const RMH = [
  { section: "Section 1: General Overview", color: "#6366f1", topics: [
    { title: "RMED Mission & Scope of Practice", content: "The Ranger Medic (RMED) mission is to provide far-forward emergency medical care to Rangers from point of injury through tactical evacuation. The RMED operates as an Advanced Tactical Practitioner under the Regimental Surgeon's medical direction. Scope includes advanced airway management (surgical cric, supraglottic airways, endotracheal intubation), all hemorrhage control modalities, chest trauma management (needle decompression, chest tubes), vascular access (IV, IO, external jugular), fluid resuscitation and blood products, pharmacology including controlled substances and RSI medications, and orthopedic trauma management.", keyPoints: ["Operate under Regimental Surgeon direction","ATP scope for advanced interventions","Point of injury through TACEVAC responsibility","Continuous training, clinical rotations, and performance eval","Every Ranger maintains basic trauma competency"] },
    { title: "Casualty Assessment & Management", content: "The primary survey identifies and treats immediately life-threatening conditions: Massive hemorrhage, Airway with C-spine protection, Respiration, Circulation, Disability (neuro status), Exposure/Environment. Treat threats as you find them. Secondary survey is a detailed head-to-toe exam only after the patient is stabilized. Continuous reassessment is critical as status changes rapidly. Document all findings on DD Form 1380.", keyPoints: ["Primary survey: MARCH or ABCDE approach","Treat life threats as found","Secondary survey after stabilization","Head-to-toe with full exposure","Continuous reassessment mandatory","Document on DD Form 1380"] },
    { title: "TCCC Integration", content: "TCCC is the foundation of Ranger medicine. Three phases: Care Under Fire (CUF) focuses on fire superiority and tourniquet application only. Tactical Field Care (TFC) begins when no longer under effective hostile fire for full MARCH-PAWS assessment. Tactical Evacuation (TACEVAC) occurs during movement to higher capability. Phases can shift rapidly. Medical decisions always balanced against tactical requirements.", keyPoints: ["CUF: Fire superiority, tourniquet only","TFC: Full MARCH-PAWS, comprehensive care","TACEVAC: Continued care during movement","Phases shift based on threat","Tactical situation influences medical decisions"] }
  ]},
  { section: "Section 2: Trauma Protocols", color: "#ef4444", topics: [
    { title: "Tactical Trauma Assessment", content: "Rapid systematic evaluation in TFC phase. Blood sweep: run gloved hands under and around casualty checking head/neck, bilateral axillae, chest, abdomen, pelvis/groin, all extremities. Check gloves after each area. Simultaneously assess AVPU (Alert, Voice, Pain, Unresponsive). Assess airway patency, respiratory effort, and circulation. Radial pulse present indicates SBP approximately 80+ mmHg, femoral pulse SBP 70+, carotid SBP 60+.", keyPoints: ["Blood sweep: systematic hands-on hemorrhage check","AVPU for rapid neurological status","Radial pulse = SBP ~80+, Femoral = ~70+, Carotid = ~60+","Check gloves after each body region","Document findings immediately"] },
    { title: "Airway Management Protocol", content: "Stepwise approach: Basic maneuvers (head-tilt chin-lift or jaw thrust for C-spine concern). If unconscious with intact gag, place NPA (size nostril to earlobe, lubricate, bevel toward septum). If unconscious without gag, consider supraglottic airway (KingLT-D or i-gel). If trained, ETT with RSI. Final rescue: surgical cricothyrotomy. Always place unconscious breathing casualties in recovery position. Reassess continuously.", keyPoints: ["Stepwise: basic, NPA, supraglottic, ETT, surgical cric","NPA: nostril to earlobe, bevel toward septum","Jaw thrust if C-spine concern","Recovery position for unconscious breathing patients","Surgical cric is definitive rescue airway"] },
    { title: "Surgical Cricothyrotomy", content: "Performed when all other airway interventions fail or facial trauma prevents them. Identify cricothyroid membrane between thyroid and cricoid cartilages. Stabilize larynx with non-dominant hand. Vertical 3cm skin incision over membrane. Horizontal stab through membrane. Insert tracheal hook if available. Insert cuffed 6.0 cric or tracheostomy tube. Inflate cuff. Confirm with capnography (gold standard), chest rise, breath sounds. Secure with ties/tape. Monitor continuously.", keyPoints: ["Cricothyroid membrane between thyroid and cricoid","Vertical skin incision, horizontal membrane incision","Cuffed 6.0 tube preferred","Confirm with capnography (gold standard)","Also: chest rise, breath sounds, misting","Contraindicated in children under 12"] },
    { title: "Supraglottic Airway (KingLT-D / i-gel)", content: "Blind insertion devices placed without direct visualization of vocal cords. Select size based on patient height. Lubricate. Open mouth with jaw lift or cross-finger technique. Insert along hard palate, advance until resistance. Inflate cuff (KingLT-D) or confirm seating (i-gel). Confirm with capnography, chest rise, ventilation compliance. Easier to place than ETT. KingLT-D allows gastric decompression.", keyPoints: ["Size based on patient height","Blind insertion along hard palate","Easier than ETT placement","Confirm with capnography and chest rise","KingLT-D allows gastric decompression","Less aspiration protection than ETT"] },
    { title: "Endotracheal Intubation (RSI)", content: "ETT provides definitive airway with best aspiration protection. RSI typically required in tactical setting. Preparation: suction, BVM, tube (7.0-8.0 adults), stylet, laryngoscope, EtCO2 detector, medications. Pre-oxygenate. RSI: Ketamine 1-2mg/kg IV + Succinylcholine 1.5mg/kg IV or Rocuronium 1mg/kg IV. Visualize cords, pass tube, inflate cuff. Confirm with capnography (mandatory). Secure tube at 21-23cm at teeth for adults.", keyPoints: ["Definitive airway, best aspiration protection","Pre-oxygenate before attempt","Ketamine preferred induction agent","Succinylcholine 1.5mg/kg or Rocuronium 1mg/kg","Confirm with capnography (mandatory)","Always have surgical cric kit as backup"] },
    { title: "Hemorrhage Management", content: "Leading cause of preventable combat death. Extremity: CoTCCC tourniquet high and tight, 2-3 inches above wound. Junctional (axilla, groin, neck): hemostatic gauze (Combat Gauze), direct pressure 3+ minutes, pressure dressing. Truncal: wound packing where possible. If tourniquet fails, apply second proximal to first. Never remove a tourniquet in the field. Document application time.", keyPoints: ["#1 cause of preventable combat death","Extremity: tourniquet high and tight","Junctional: hemostatic gauze + pressure 3+ min","Never remove tourniquet in field","Failed TQ = second proximal to first","Document all application times"] },
    { title: "Tourniquet Application", content: "Place CoTCCC-approved tourniquet (CAT Gen 7, SOF-T Wide) 2-3 inches above wound over uniform. Route band through buckle, pull tight. Twist windlass clockwise until bleeding stops and distal pulse absent. Lock windlass into clip. Secure excess strap. Mark time on tourniquet and/or forehead. One-handed (self-aid): pre-stage high on affected limb, pull tight, twist windlass with available hand.", keyPoints: ["2-3 inches above wound, over uniform","Twist until distal pulse absent","Lock windlass, secure strap","Mark time on TQ or forehead","Pre-stage for one-handed self-application","Still bleeding = tighten more or add second"] },
    { title: "Tourniquet Conversion", content: "Replace tourniquet with hemostatic dressing and pressure bandage when: tactical situation permits, TQ on less than 6 hours, patient not in shock, hemostatics available, can monitor closely. Expose wound, prepare gauze and dressing, loosen TQ slowly while applying direct pressure, pack with hemostatic gauze, pressure 3 min, apply pressure dressing. If bleeding restarts: retighten immediately. Leave loosened TQ in place.", keyPoints: ["Only when tactical situation permits","TQ on less than 6 hours","Patient NOT in shock","Have hemostatics ready before loosening","Bleeding restarts = retighten immediately","Leave TQ in place even when converted","After 6 hours: consult telemedicine (reperfusion risk)"] },
    { title: "Thoracic Trauma Management", content: "Open pneumothorax: vented chest seal (preferred) over wound on exhale. Check for exit wound, seal both. Monitor for tension pneumo. Tension pneumothorax: needle decompression at 2nd ICS MCL (primary) or 5th ICS AAL (alternate). 14-gauge, 3.25-inch needle. Insert perpendicular, above the rib. Remove needle, leave catheter. If trained: chest tube for definitive hemothorax/persistent pneumo management.", keyPoints: ["Seal ALL open chest wounds (front AND back)","Vented seal preferred","Worsening after seal: burp first, then needle decomp","14g 3.25-inch at 2nd ICS MCL","Insert above the rib (NV bundle below)","May need to repeat if symptoms recur"] },
    { title: "Needle Chest Decompression", content: "Indications: tension pneumo (absent breath sounds, JVD, tracheal deviation, resp distress, hypotension) unresponsive to burping seal. Equipment: 14-gauge, 3.25-inch catheter-over-needle. Primary: 2nd ICS midclavicular line. Insert perpendicular above 3rd rib. Advance until rush of air. Remove needle, leave catheter. Secure with tape. Alternate site: 5th ICS anterior axillary line. Catheter may kink or clog, be prepared to repeat.", keyPoints: ["Tension pneumo unresponsive to burping seal","14g, 3.25-inch (standard 1.5 inch often fails)","Primary: 2nd ICS MCL","Alternate: 5th ICS AAL","Insert ABOVE the rib","Rush of air confirms pleural entry","Catheter may clog: ready to repeat"] },
    { title: "Chest Tube Insertion", content: "Advanced RMED procedure. Indications: hemothorax, persistent pneumo after needle decomp. Site: 4th-5th ICS anterior axillary line (safe triangle). Local anesthetic if conscious. 3-4cm horizontal incision. Blunt dissect with Kelly clamp through intercostals. Penetrate pleura (rush of air/blood). Digital sweep. Insert 28-36 French tube directed posteriorly and superiorly. Connect to Heimlich valve. Secure with suture. Confirm improved breath sounds.", keyPoints: ["4th-5th ICS, anterior axillary line","Blunt dissection (NOT trocar)","Digital sweep before tube insertion","28-36 French for adults","Direct posteriorly and superiorly","Heimlich valve for field use","Secure with suture and occlusive dressing"] },
    { title: "Hypovolemic Shock Management", content: "Hemorrhagic shock classes: I (<750ml, HR normal), II (750-1500ml, HR 100-120), III (1500-2000ml, HR 120-140, AMS), IV (>2000ml, HR >140, lethal). Control hemorrhage first. Large-bore IV/IO. Fluids in preference order: whole blood, 1:1:1, plasma:RBC 1:1, plasma alone, crystalloid (last resort). Permissive hypotension target SBP 80-90 (unless TBI). TXA 1g IV within 3 hours. Prevent hypothermia.", keyPoints: ["Control hemorrhage BEFORE resuscitation","Whole blood > 1:1:1 > plasma:RBC > crystalloid","Permissive hypotension: SBP 80-90 (unless TBI)","TXA 1g IV within 3 hours","Prevent hypothermia (lethal triad)","Reassess frequently for fluid response"] },
    { title: "IV Access & Saline Lock", content: "Peripheral IV is primary route. Largest gauge feasible (16-18g preferred). Common sites: antecubital fossa, forearm, hand, EJ. Tourniquet proximal, prep site, insert at 15-30 degrees bevel up, advance until flash, thread catheter, remove needle, connect and flush with NS, secure. Two IV attempts max before moving to IO.", keyPoints: ["16-18g preferred for trauma","Antecubital fossa primary site","15-30 degree angle, bevel up","Flash of blood confirms vein entry","Flush and secure","Two attempts max, then IO"] },
    { title: "External Jugular IV", content: "Large accessible vessel when peripheral sites unavailable (shock, burns, bilateral extremity injury). Supine, slight Trendelenburg. Turn head away. Identify EJ from behind ear to clavicle. Digital pressure above clavicle to distend. 15-20 degree entry at midpoint. Advance until flash, thread catheter, connect, flush, secure. Risks: carotid puncture, air embolism.", keyPoints: ["Use when peripheral access unavailable","Trendelenburg to distend vein","Turn head away from target side","Digital pressure above clavicle","Risk: carotid puncture, air embolism","Dislodges easily with movement"] },
    { title: "Intraosseous Access (EZ-IO / FAST1)", content: "Rapid reliable access when IV fails. EZ-IO at proximal tibia: identify tibial tuberosity, 1-2cm medial and 1cm proximal. Drill perpendicular until loss of resistance. Remove stylet, aspirate, flush 10ml NS (lidocaine 40mg IO first for conscious patients). Sternal IO (FAST1) at manubrium per manufacturer instructions. Can run all IV fluids and most medications. Rotate site after 24 hours.", keyPoints: ["After 2 failed IV attempts or immediate need","EZ-IO: proximal tibia, 1-2cm medial to tuberosity","Drill perpendicular until loss of resistance","Lidocaine 40mg IO for conscious patient pain","All IV fluids and most meds through IO","Remove/rotate after 24 hours"] },
    { title: "Head Injury Management", content: "GCS assessment (E1-4, V1-5, M1-6 = 3-15). Pupil size and reactivity. Maintain airway and SpO2 >90%. Prevent secondary injury: avoid hypotension (SBP >90), avoid hypoxia, avoid hyperventilation (EtCO2 35-45 unless herniation). Herniation signs (unilateral dilated pupil, posturing, GCS drop 2+): 3% hypertonic saline 250ml IV, hyperventilate to EtCO2 30-35, elevate head 30 degrees. Seizure prophylaxis: Keppra 1500mg IV. Trend neuro q15 min.", keyPoints: ["GCS: Eye(1-4) + Verbal(1-5) + Motor(1-6) = 3-15","Prevent secondary injury: no hypotension, no hypoxia","Do NOT hyperventilate unless herniation","Herniation: blown pupil, posturing, GCS drop 2+","3% HTS 250ml, hyperventilate to 30-35","Keppra 1500mg IV for seizure prophylaxis","Head up 30 degrees, trend neuro q15 min"] },
    { title: "Seizure Management", content: "Post-traumatic seizures indicate significant brain injury. Protect from injury, do NOT restrain, maintain airway, time the seizure. First-line: Midazolam 5mg IM/IV/IN. Repeat at 5 min if ongoing. Refractory: Keppra 1500mg IV. Post-ictal: recovery position, suction, reassess GCS, monitor for recurrence. All post-traumatic seizure patients need prophylaxis and expedited evacuation.", keyPoints: ["Protect from injury, do NOT restrain","Midazolam 5mg IM/IV/IN first-line","Repeat at 5 minutes if ongoing","Keppra 1500mg IV for prophylaxis","Post-ictal: recovery position, suction, reassess","All need expedited MEDEVAC"] },
    { title: "Orthopedic Trauma Management", content: "Check pulse, motor, sensation (PMS) distal to injury before and after intervention. Open fractures: hemorrhage control, irrigate, dress, splint, antibiotics. Closed: splint in position found unless PMS compromised (then gentle realignment). Splint joint above and below fracture. Pad bony prominences. Femur: traction splint for mid-shaft only (contra in hip, knee, ankle injury same side). One reduction attempt for dislocations if PMS compromised.", keyPoints: ["Check PMS before and after all interventions","Open fx: hemorrhage, irrigate, dress, splint, abx","Splint joint above AND below fracture","Pad all bony prominences","Traction splint for mid-shaft femur only","One reduction attempt if PMS compromised"] },
    { title: "Hypothermia Management", content: "Part of the lethal triad (hypothermia, acidosis, coagulopathy). Prevention is far more effective than treatment. Remove wet clothing. Insulate from ground (single most important step). Wrap in blankets/hypothermia kit. Cover head. Warm IV fluids if possible. Chemical heat packs to axillae and groin. Minimize exposure during assessment. Severe hypothermia (<90F/32C): handle gently to avoid cardiac dysrhythmias.", keyPoints: ["Lethal triad: hypothermia, acidosis, coagulopathy","Prevention >> treatment","INSULATE FROM GROUND (#1 most important)","Cover head (major heat loss site)","Remove wet clothing","Heat packs to axillae and groin","Handle severe hypothermia gently (dysrhythmia risk)"] }
  ]},
  { section: "Section 2B: TEMPs (Medical Emergencies)", color: "#f97316", topics: [
    { title: "Anaphylaxis", content: "Life-threatening allergic reaction. Signs: urticaria, angioedema, bronchospasm, hypotension, tachycardia. Treatment: Remove allergen. Epinephrine 0.3mg IM (anterolateral thigh) immediately. Repeat q5-15 min PRN. Diphenhydramine 50mg IV/IM. Albuterol for bronchospasm. IV NS bolus for hypotension. Monitor for biphasic reaction (4-8 hours later).", keyPoints: ["Epinephrine 0.3mg IM FIRST LINE (do not delay)","IM into anterolateral thigh","Repeat epi q5-15min PRN","Diphenhydramine 50mg IV/IM","Albuterol for bronchospasm","Monitor for biphasic reaction 4-8 hrs"] },
    { title: "Chest Pain (Cardiac)", content: "Assess for ACS: substernal pain/pressure, radiation to left arm/jaw/back, diaphoresis, nausea, dyspnea. Treatment: Aspirin 324mg PO chew. Nitroglycerin 0.4mg SL q5 min x3 (SBP must be >100; no nitro if PDE5 inhibitor within 48 hrs). O2 if SpO2 <94%. Morphine 2-4mg IV for persistent pain. Semi-Fowler's position. Expedite evacuation.", keyPoints: ["Aspirin 324mg PO chewed immediately","Nitro 0.4mg SL q5min x3 (SBP >100)","No nitro if PDE5 inhibitor in 48hrs","O2 if SpO2 <94%","Morphine 2-4mg IV for persistent pain","Expedite cardiac care evacuation"] },
    { title: "Heat Injury", content: "Heat exhaustion: temp <104F, sweating, weakness, nausea. Treat: shade, remove gear, oral fluids, rest. Heat stroke: temp >104F + altered mental status = EMERGENCY. Aggressive cooling: cold water immersion (gold standard), or wet sheets + fanning + ice to neck/axillae/groin. IV NS. Benzos for shivering. Stop cooling at 102F. All heat stroke patients need evacuation.", keyPoints: ["Heat stroke: >104F + AMS = EMERGENCY","Cold water immersion gold standard","Alt: wet sheets + fanning + ice packs","Stop cooling at 102F (prevent overshoot)","IV NS for fluid resuscitation","Benzos if shivering (it generates more heat)","All heat stroke = mandatory evacuation"] },
    { title: "Malaria", content: "Suspect in febrile patients with endemic area exposure. Cyclic fevers/chills, headache, myalgias, nausea. Severe: AMS, seizures, severe anemia, renal failure. Rapid diagnostic test if available. Uncomplicated: Malarone 4 tabs daily x3 days or Coartem. Severe: IV Artesunate + immediate evacuation. Monitor blood glucose (hypoglycemia common). Chemoprophylaxis for prevention.", keyPoints: ["Suspect with fever + endemic area travel","Cyclic fevers/chills pattern","Rapid diagnostic test when available","Uncomplicated: Malarone or Coartem","Severe: IV Artesunate + evacuate","Monitor glucose (hypoglycemia common)"] },
    { title: "Wound Infection", content: "Signs: increasing pain, spreading erythema, warmth, swelling, purulent drainage, fever, lymphangitis. Open and irrigate wound. Pack loosely with moist gauze. Mild: Moxifloxacin 400mg PO daily. Moderate/severe: Ertapenem 1g IM/IV daily. Suspect MRSA: add Bactrim DS BID or Doxycycline 100mg BID. Abscess needs I&D. Mark erythema border to track.", keyPoints: ["Increasing pain, spreading redness, purulent drainage","Open, irrigate, pack the wound","Mild: Moxi 400mg PO daily","Mod/severe: Ertapenem 1g IM/IV daily","MRSA: add Bactrim DS or Doxycycline","Abscess requires I&D","Mark border and track progression"] },
    { title: "Dental Emergencies", content: "Avulsed tooth: handle by crown only, rinse gently, reimplant within 60 min or store in Hank's solution/milk/saliva. Fractured with pulp exposure: cover with temp dental cement. Pain: ibuprofen 800mg + acetaminophen 1000mg, or dental nerve block with lidocaine. Abscess: Amoxicillin 500mg TID or Clindamycin 300mg QID, warm salt water rinses.", keyPoints: ["Avulsed: handle by crown, reimplant in 60 min","Store in Hank's solution, milk, or saliva","Pulp exposure: temporary dental cement","Pain: Ibuprofen 800 + Acetaminophen 1000","Abscess: Amoxicillin 500 TID or Clindamycin 300 QID"] },
    { title: "Urinary Tract Infection", content: "Common in field due to dehydration/limited hygiene. Symptoms: dysuria, frequency, urgency, suprapubic pain, cloudy urine. Complicated (flank pain, fever): pyelonephritis. Uncomplicated: Bactrim DS BID x3 days or Cipro 500mg BID x3 days. Pyelonephritis: Cipro x7 days or Ertapenem. Push fluids. Straight cath if unable to void with distended bladder.", keyPoints: ["Dysuria, frequency, urgency, suprapubic pain","Uncomplicated: Bactrim DS BID x3 days","Alt: Cipro 500mg BID x3 days","Pyelonephritis: Cipro x7 or Ertapenem","Push oral fluids aggressively","Flank pain + fever = pyelonephritis"] },
    { title: "Asthma / Reactive Airway", content: "Acute bronchospasm presenting with wheezing, dyspnea, chest tightness, cough. Treatment: Albuterol 2.5mg nebulized or 4-8 puffs MDI with spacer q20 min x3. If severe: Ipratropium 0.5mg nebulized with albuterol. Epinephrine 0.3mg IM if not responding. Methylprednisolone 125mg IV or Prednisone 60mg PO. Monitor SpO2 and work of breathing.", keyPoints: ["Albuterol 2.5mg neb or 4-8 puffs MDI q20 min x3","Add Ipratropium 0.5mg neb if severe","Epi 0.3mg IM if not responding","Steroids: Methylprednisolone 125mg IV or Prednisone 60mg PO","Monitor SpO2","Evacuate if not improving after 3 treatments"] },
    { title: "Skin Abscess / Cellulitis", content: "Abscess: fluctuant, painful, warm collection. Requires incision and drainage (I&D): prep area, linear incision over fluctuant area, express purulent material, break up loculations, irrigate, pack loosely with iodoform gauze, cover. Antibiotics if surrounding cellulitis present: Bactrim DS BID + Doxycycline 100mg BID for MRSA coverage, or Clindamycin 300mg QID. Cellulitis without abscess: antibiotics alone.", keyPoints: ["Abscess: I&D is definitive treatment","Linear incision, express, break loculations, irrigate, pack","Pack loosely with iodoform gauze","Antibiotics if surrounding cellulitis","MRSA coverage: Bactrim DS + Doxy 100mg BID","Recheck in 24-48 hours"] },
    { title: "Epistaxis (Nosebleed)", content: "Most are anterior bleeds. Have patient sit upright, lean forward. Pinch soft part of nose firmly for 15-20 continuous minutes (do not release to check). If persistent, insert nasal tampon or pack anterior nose with petroleum gauze. Posterior bleeds (blood flowing down throat despite anterior pressure) may need posterior packing or Foley catheter balloon tamponade. Monitor for signs of significant blood loss.", keyPoints: ["Sit upright, lean forward","Pinch soft part of nose 15-20 min continuous","Do not release to check","Anterior pack if persistent","Posterior bleed: Foley balloon tamponade","Monitor for significant blood loss"] }
  ]},
  { section: "Section 3: RMED Pharmacology", color: "#10b981", topics: [
    { title: "Proficient & Always Carried", content: "Always in RMED aid bag: Acetaminophen 650-1000mg PO q6h (max 4g/day). Meloxicam 15mg PO daily (NSAID). Moxifloxacin 400mg PO daily (combat antibiotic). TXA 1g IV over 10 min within 3 hours. Epinephrine 0.3mg IM (anaphylaxis). Ketamine 20-30mg IV or 50-100mg IM/IN (analgesia), 1-2mg/kg IV (sedation). Ondansetron 4mg IV/ODT (nausea). Ertapenem 1g IM/IV (penetrating wounds). Combat Gauze, chest seals, NPA.", keyPoints: ["Acetaminophen 650-1000mg q6h (max 4g/day)","Meloxicam 15mg PO daily","Moxifloxacin 400mg PO daily","TXA 1g IV within 3 hours","Epinephrine 0.3mg IM","Ketamine: 20-30mg IV analgesic, 1-2mg/kg sedation","Ondansetron 4mg IV/ODT"] },
    { title: "Controlled Substances", content: "Strict two-person accountability. Fentanyl OTFC 800mcg lozenge between cheek and gum for moderate-severe pain (monitor resp rate). Midazolam 5mg IM/IV/IN for seizures or procedural sedation. Ketamine: controlled in some settings. RSI paralytics: Succinylcholine 1.5mg/kg IV (onset 30-60 sec, duration 5-10 min), Rocuronium 1mg/kg IV (onset 60-90 sec, duration 30-45 min). Document all usage.", keyPoints: ["OTFC 800mcg: cheek/gum, monitor resp rate","Midazolam 5mg IM/IV/IN: seizures, sedation","Succinylcholine 1.5mg/kg: rapid onset RSI","Rocuronium 1mg/kg: longer duration RSI","Two-person inventory required","Document every use with time and dose"] },
    { title: "Drug Reference Quick Card", content: "Key field dosing: Antibiotics: Moxi 400mg PO daily, Ertapenem 1g IM/IV daily, Metronidazole 500mg IV q8h. Analgesics: Ketamine 20-30mg IV q20min, OTFC 800mcg, Acetaminophen 1g q6h, Meloxicam 15mg daily. Resuscitation: TXA 1g IV in 100ml NS over 10 min, Epi 0.3mg IM. RSI: Ketamine 1-2mg/kg + Succinylcholine 1.5mg/kg or Rocuronium 1mg/kg. Seizures: Midazolam 5mg, Keppra 1500mg IV. TBI: 3% HTS 250ml. Burns: Parkland 4ml x kg x %TBSA.", keyPoints: ["Keep laminated dosing card in aid bag","Weight-based drugs: know patient weight","TXA: give early, do not delay","RSI requires team coordination","Parkland: half in first 8 hours","Always document drug, dose, route, time"] }
  ]},
  { section: "Section 4: Medical Ops & Planning", color: "#f59e0b", topics: [
    { title: "Medical Planning", content: "Medical plan integrated into every mission phase. Considerations: casualty estimate from threat assessment, MEDEVAC plan (primary/alternate routes, LZs, frequencies, call signs), blood product availability and cold chain, resupply plan, telemedicine capability and procedures, Role 1/2/3 locations and capabilities, movement timeline estimates. Briefed to all team members. Contingency for MASCAL, PFC, and MEDEVAC denial is mandatory.", keyPoints: ["Integrated into mission planning","Primary and alternate MEDEVAC plans","Blood product cold chain","Telemedicine contact procedures","All team members briefed","Contingency for MASCAL, PFC, MEDEVAC denial"] },
    { title: "CASEVAC / MEDEVAC", content: "CASEVAC: non-medical platform evacuation. MEDEVAC: dedicated medical with medical crew. Plan: primary and alternate HLZs with 8-digit grids. Pre-position VS-17 panels, smoke, IR strobes. Calculate flight times from each phase. Ground evacuation routes as backup. All team members can call a 9-line. Coordinate with aviation during rehearsals.", keyPoints: ["CASEVAC = non-medical, MEDEVAC = dedicated medical","Primary and alternate HLZ with 8-digit grids","Pre-position marking materials","Calculate flight times per phase","Ground evac routes as backup","ALL personnel trained on 9-line"] },
    { title: "Casualty Collection Point (CCP)", content: "Designated location for gathering, triaging, treating, and staging casualties for evacuation. Requirements: cover and concealment, accessible to evac platforms, adequate space, lighting, overhead cover. Zones: triage area, treatment area, expectant area (MASCAL), staging for evac. Security maintained. Supplies pre-positioned. Comms established. All personnel know CCP location.", keyPoints: ["Cover/concealment from enemy","Accessible to evac platforms","Triage, treatment, expectant, staging areas","Security always maintained","Pre-position medical supplies","All personnel know CCP location"] },
    { title: "Mass Casualty (MASCAL)", content: "Casualties exceed medical resources. TCCC triage: Immediate (T1, life-threatening but salvageable), Delayed (T2, serious but can wait), Minimal (T3, walking wounded), Expectant (T4, incompatible with survival given resources). Triage is dynamic and continuous. Do the most good for the most people. Tourniquets and airways first across all patients. Request additional assets. Activate contingency plans.", keyPoints: ["Triage: Immediate, Delayed, Minimal, Expectant","Most good for most people","Triage is dynamic and ongoing","TQ and airways first across all patients","Request additional assets immediately","Expectant still receive comfort care"] }
  ]},
  { section: "Section 5: Packing Lists & Reference", color: "#8b5cf6", topics: [
    { title: "Ranger Aid Bag Essentials", content: "Mission-tailored core items: Airway: NPA (multiple sizes), surgical cric kit, KingLT-D/i-gel, suction, BVM, capnography. Hemorrhage: CAT tourniquets (4+), Combat Gauze (4+), pressure dressings, junctional TQ. Chest: chest seals (4+), 14g 3.25-inch needles (4+), chest tube kit. Circulation: IV kits (6+), IO kit, fluid sets, TXA, blood tubing. Meds: CWMP, ketamine, OTFC, midazolam, epi, antibiotics, ondansetron. Monitoring: pulse ox, capnography, BP cuff, stethoscope, thermometer.", keyPoints: ["4+ tourniquets, 4+ hemostatic gauze, 4+ chest seals","Surgical cric kit and supraglottic airway","EZ-IO for failed IV","Capnography for airway confirmation","Laminated dosing card","Tailor to mission duration, threat, environment"] },
    { title: "JFAK Contents", content: "Every Ranger carries: 1x CoTCCC tourniquet (pre-staged), 1x Combat Gauze, 1x emergency trauma dressing (pressure bandage), 1x vented chest seal, 1x NPA with lubricant, 1x 14g 3.25-inch decompression needle, 1x Combat Wound Medication Pack (acetaminophen + meloxicam), 1x DD Form 1380, 1x permanent marker, gloves. Every Ranger must know location and use of every item.", keyPoints: ["1x tourniquet (pre-staged, ready)","1x Combat Gauze","1x pressure bandage","1x vented chest seal","1x NPA + lube","1x decomp needle (14g, 3.25 in)","1x CWMP, DD 1380, marker, gloves"] },
    { title: "Vital Signs Reference", content: "Normal adults: HR 60-100, RR 12-20, SBP 90-140, SpO2 95-100% (>90% acceptable tactical), Temp 97.8-99.1F, EtCO2 35-45 mmHg, Cap refill <2 sec, Urine output >0.5 ml/kg/hr (30ml/hr for 70kg adult). Pulse pressure (SBP-DBP) normally 30-40 (narrowing = shock). Trending is more important than any single reading.", keyPoints: ["HR 60-100, RR 12-20, SBP 90-140, SpO2 >90%","EtCO2 35-45 mmHg","Cap refill <2 sec = normal","Urine >0.5 ml/kg/hr = adequate perfusion","Narrowing pulse pressure = shock","TREND vitals: direction > single value"] },
    { title: "Glasgow Coma Scale (GCS)", content: "Eye Opening: 4 spontaneous, 3 to voice, 2 to pain, 1 none. Verbal: 5 oriented, 4 confused, 3 inappropriate words, 2 incomprehensible, 1 none. Motor: 6 obeys commands, 5 localizes pain, 4 withdrawal, 3 abnormal flexion, 2 extension, 1 none. Total 3-15. Severe TBI: 3-8. Moderate: 9-12. Mild: 13-15. Report as component scores (E3V4M5=12). GCS 8 or less generally requires definitive airway. Motor is most prognostic.", keyPoints: ["Eye(1-4) + Verbal(1-5) + Motor(1-6) = 3-15","Severe: 3-8, Moderate: 9-12, Mild: 13-15","Report as E_V_M_ = total","GCS ≤8 generally needs definitive airway","Motor component most prognostic","AVPU faster for tactical use"] },
    { title: "Burn Calculation (Rule of Nines)", content: "Adult TBSA: Head/neck 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%. Patient's palm with fingers = ~1% (scattered burns). Fluid resuscitation for >20% TBSA: Parkland formula 4ml x kg x %TBSA. Half in first 8 hours from TIME OF BURN. Remaining half over next 16 hours. LR or NS. Monitor urine output: target 0.5-1.0 ml/kg/hr adult.", keyPoints: ["Head 9%, arms 9% each, trunk 18% front/back","Legs 18% each, perineum 1%","Palm + fingers = ~1%","Parkland: 4ml x kg x %TBSA","Half in first 8 hours FROM BURN TIME","Target urine 0.5-1.0 ml/kg/hr"] }
  ]}
];

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════

export default function TCCCApp() {
  const [tab, setTab] = useState("train");
  const [view, setView] = useState("home");
  const [selTopic, setSelTopic] = useState(null);
  const [quiz, setQuiz] = useState({ i: 0, ans: [], done: false, sel: null });
  const [flash, setFlash] = useState({ i: 0, flip: false });
  const [step, setStep] = useState({ i: 0 });
  const [scen, setScen] = useState({ si: 0, di: 0, sel: null, hist: [], done: false });
  const [fade, setFade] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [rmhTopic, setRmhTopic] = useState(null);
  const ref = useRef(null);

  const tr = useCallback(fn => { setFade(false); setTimeout(() => { fn(); setFade(true); }, 160); }, []);
  const nav = useCallback((v, fn) => { tr(() => { fn && fn(); setView(v); }); }, [tr]);
  const topic = selTopic ? TOPICS.find(t => t.id === selTopic) : null;

  useEffect(() => { ref.current && (ref.current.scrollTop = 0); }, [view, quiz.i, flash.i, step.i, tab, scen.di]);

  const S = {
    app: { fontFamily: "'DM Sans',system-ui,sans-serif", background: "#0a0a0f", color: "#e8e8ed", height: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", overflow: "hidden" },
    hdr: { padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #ffffff0f", background: "rgba(10,10,15,.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 },
    back: { background: "#ffffff0f", border: "none", color: "#888", fontSize: 16, width: 32, height: 32, borderRadius: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
    body: { flex: 1, padding: "0 16px 110px", overflowY: "auto", opacity: fade ? 1 : 0, transform: fade ? "none" : "translateY(5px)", transition: "all .18s ease" },
    card: { background: "#ffffff08", border: "1px solid #ffffff0f", borderRadius: 13, padding: 14, cursor: "pointer", transition: "all .2s", marginBottom: 8 },
    btn: (c, f) => ({ background: f ? c : "transparent", border: `1.5px solid ${c}50`, color: f ? "#fff" : c, padding: "12px 18px", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }),
    opt: (sel, ok, rev) => {
      let bg = "#ffffff08", bd = "#ffffff14", cl = "#e8e8ed";
      if (rev && ok) { bg = "#10b98120"; bd = "#10b981"; cl = "#10b981"; }
      else if (rev && sel && !ok) { bg = "#ef444420"; bd = "#ef4444"; cl = "#ef4444"; }
      else if (sel && !rev) { bg = "#6366f120"; bd = "#6366f1"; cl = "#c7c8ff"; }
      return { background: bg, border: `1.5px solid ${bd}`, color: cl, padding: "12px 13px", borderRadius: 10, fontSize: 13, cursor: rev ? "default" : "pointer", width: "100%", textAlign: "left", fontFamily: "inherit", lineHeight: 1.5 };
    },
    tabBar: { display: "flex", position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(10,10,15,.97)", borderTop: "1px solid #ffffff0f", zIndex: 20 },
    tabBtn: a => ({ flex: 1, padding: "10px 0 8px", background: "none", border: "none", color: a ? "#8b5cf6" : "#555", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "inherit" })
  };

  const Bar = () => (
    <div style={S.tabBar}>
      {[["train","🎯","Train"],["cpg","📋","CPGs"],["videos","🎬","Videos"],["rmh","📕","RMH"]].map(([k,ic,lb]) => (
        <button key={k} style={S.tabBtn(tab===k)} onClick={() => { setTab(k); setView("home"); setExpanded(null); setSearch(""); setRmhTopic(null); }}><span style={{fontSize:16}}>{ic}</span>{lb}</button>
      ))}
    </div>
  );

  const Prog = ({ c, t }) => <div style={{width:"100%",height:3,background:"#ffffff14",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(c/t)*100}%`,height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:2,transition:"width .4s ease"}}/></div>;

  const Acc = ({ items, renderItem, color }) => items.map((it, i) => (
    <div key={i} style={{ marginBottom: 8 }}>
      <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ width: "100%", textAlign: "left", background: expanded === i ? "#ffffff0a" : "#ffffff05", border: "1px solid #ffffff0f", borderRadius: 11, padding: "12px 14px", cursor: "pointer", fontFamily: "inherit", color: "#e8e8ed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>{renderItem(it, i)}</div>
        <span style={{ color: color || "#666", fontSize: 14, transform: expanded === i ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</span>
      </button>
      {expanded === i && it._content}
    </div>
  ));

  // ═══════════════════════════════════════════════════════════════════════════
  // CPG TAB
  // ═══════════════════════════════════════════════════════════════════════════
  if (tab === "cpg") {
    const f = search ? CPGS.map(c => ({...c, items: c.items.filter(x => x.title.toLowerCase().includes(search.toLowerCase()))})).filter(c => c.items.length) : CPGS;
    return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>📋 Clinical Practice Guidelines</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>JTS / CoTCCC / Deployed Medicine</div></div></div>
      <div ref={ref} style={S.body}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search CPGs..." style={{width:"100%",padding:"10px 14px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:11,color:"#e8e8ed",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginTop:14,marginBottom:12}}/>
        <a href="https://jts.health.mil/index.cfm/CPGs/cpgs" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",marginBottom:10}}><div style={{background:"#6366f114",border:"1px solid #6366f130",borderRadius:12,padding:14}}><div style={{fontSize:13,fontWeight:600,color:"#8b5cf6"}}>Full JTS CPG Library ↗</div><div style={{fontSize:11,color:"#777",marginTop:3}}>jts.health.mil</div></div></a>
        <a href="https://prolongedfieldcare.org" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",marginBottom:14}}><div style={{background:"#06b6d414",border:"1px solid #06b6d430",borderRadius:12,padding:14}}><div style={{fontSize:13,fontWeight:600,color:"#06b6d4"}}>ProlongedFieldCare.org ↗</div><div style={{fontSize:11,color:"#777",marginTop:3}}>PFC Collective resources, CPGs, and mnemonics</div></div></a>
        {f.map((cat, ci) => (
          <div key={ci} style={{marginBottom:8}}>
            <button onClick={()=>setExpanded(expanded===ci?null:ci)} style={{width:"100%",textAlign:"left",background:expanded===ci?"#ffffff0a":"#ffffff05",border:"1px solid #ffffff0f",borderRadius:11,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",color:"#e8e8ed",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:14,fontWeight:600}}>{cat.category}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{cat.items.length} guidelines</div></div>
              <span style={{color:cat.color,fontSize:14,transform:expanded===ci?"rotate(90deg)":"none",transition:"transform .2s"}}>›</span>
            </button>
            {expanded===ci && <div style={{paddingLeft:6,paddingTop:4}}>{cat.items.map((it,ii)=>(<a key={ii} href={it.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{background:"#ffffff05",border:"1px solid #ffffff0a",borderRadius:9,padding:"10px 12px",marginBottom:4}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600,color:"#d4d4dc"}}>{it.title} ↗</span><span style={{fontSize:10,color:"#555"}}>{it.date}</span></div></div></a>))}</div>}
          </div>
        ))}
      </div><Bar/></div>);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VIDEOS TAB
  // ═══════════════════════════════════════════════════════════════════════════
  if (tab === "videos") {
    const f = search ? VIDEOS.map(m=>({...m,vids:m.vids.filter(v=>v.toLowerCase().includes(search.toLowerCase()))})).filter(m=>m.vids.length) : VIDEOS;
    return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>🎬 Skills Video Library</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>TCCC CLS — Deployed Medicine</div></div></div>
      <div ref={ref} style={S.body}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search skills..." style={{width:"100%",padding:"10px 14px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:11,color:"#e8e8ed",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginTop:14,marginBottom:12}}/>
        <a href="https://deployedmedicine.com" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",marginBottom:14}}><div style={{background:"#6366f114",border:"1px solid #6366f130",borderRadius:12,padding:14}}><div style={{fontSize:13,fontWeight:600,color:"#8b5cf6"}}>Open Deployed Medicine ↗</div><div style={{fontSize:11,color:"#777",marginTop:3}}>Sign in for full video access & skill cards</div></div></a>
        {f.map((mod,mi)=>(
          <div key={mi} style={{marginBottom:8}}>
            <button onClick={()=>setExpanded(expanded===mi?null:mi)} style={{width:"100%",textAlign:"left",background:expanded===mi?`${mod.color}0a`:"#ffffff05",border:`1px solid ${expanded===mi?`${mod.color}30`:"#ffffff0f"}`,borderRadius:11,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",color:"#e8e8ed",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:10,color:mod.color,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Module {mod.mod}</div><div style={{fontSize:13,fontWeight:600,marginTop:2}}>{mod.title}</div><div style={{fontSize:11,color:"#555",marginTop:1}}>{mod.vids.length} videos</div></div>
              <span style={{color:mod.color,fontSize:14,transform:expanded===mi?"rotate(90deg)":"none",transition:"transform .2s"}}>›</span>
            </button>
            {expanded===mi && <div style={{paddingLeft:6,paddingTop:4}}>{mod.vids.map((v,vi)=>(<a key={vi} href="https://deployedmedicine.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{background:"#ffffff05",border:"1px solid #ffffff0a",borderRadius:9,padding:"10px 12px",marginBottom:4,display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:`${mod.color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>▶</div>
              <div style={{fontSize:12,fontWeight:600,color:"#ccc"}}>{v}</div><span style={{fontSize:12,color:"#555",marginLeft:"auto"}}>↗</span>
            </div></a>))}</div>}
          </div>
        ))}
      </div><Bar/></div>);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RANGER MEDIC HANDBOOK TAB
  // ═══════════════════════════════════════════════════════════════════════════
  if (tab === "rmh") {
    // TOPIC DETAIL VIEW
    if (rmhTopic) {
      const t = rmhTopic;
      return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>setRmhTopic(null)}>←</button><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.title}</div></div></div>
        <div ref={ref} style={S.body}><div style={{padding:"20px 0 10px"}}>
          <div style={{fontSize:14,color:"#ccc",lineHeight:1.8,margin:"0 0 20px"}}>{t.content}</div>
          {t.keyPoints && t.keyPoints.length > 0 && (
            <div style={{background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:13,padding:16}}>
              <div style={{fontSize:10,fontWeight:700,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Key Points</div>
              {t.keyPoints.map((kp,ki)=>(
                <div key={ki} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                  <div style={{width:5,height:5,borderRadius:5,background:"#8b5cf6",marginTop:7,flexShrink:0}}/>
                  <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>{kp}</div>
                </div>
              ))}
            </div>
          )}
        </div></div><Bar/></div>);
    }
    // SECTION LIST VIEW
    const allTopics = RMH.flatMap(s => s.topics.map(t => ({...t, secColor: s.color})));
    const f = search ? RMH.map(s=>({...s,topics:s.topics.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())||t.content.toLowerCase().includes(search.toLowerCase()))})).filter(s=>s.topics.length) : RMH;
    return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>📕 Ranger Medic Handbook</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>75th Ranger Regiment — Field Reference</div></div></div>
      <div ref={ref} style={S.body}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search handbook..." style={{width:"100%",padding:"10px 14px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:11,color:"#e8e8ed",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginTop:14,marginBottom:12}}/>
        <a href="https://jsomonline.org/product/2025-ranger-medic-handbook/" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",marginBottom:14}}><div style={{background:"#ef444414",border:"1px solid #ef444430",borderRadius:12,padding:14}}><div style={{fontSize:13,fontWeight:600,color:"#ef4444"}}>2025 Ranger Medic Handbook (Print/Digital) ↗</div><div style={{fontSize:11,color:"#777",marginTop:3}}>Latest edition via JSOM. Waterproof, pocket-sized.</div></div></a>
        {f.map((sec,si)=>(
          <div key={si} style={{marginBottom:8}}>
            <button onClick={()=>setExpanded(expanded===si?null:si)} style={{width:"100%",textAlign:"left",background:expanded===si?`${sec.color}0a`:"#ffffff05",border:`1px solid ${expanded===si?`${sec.color}30`:"#ffffff0f"}`,borderRadius:11,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",color:"#e8e8ed",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:14,fontWeight:600}}>{sec.section}</div><div style={{fontSize:11,color:"#555",marginTop:2}}>{sec.topics.length} topics</div></div>
              <span style={{color:sec.color,fontSize:14,transform:expanded===si?"rotate(90deg)":"none",transition:"transform .2s"}}>›</span>
            </button>
            {expanded===si && <div style={{paddingLeft:6,paddingTop:4}}>{sec.topics.map((t,ti)=>(<div key={ti} style={{background:"#ffffff05",border:"1px solid #ffffff0a",borderRadius:9,padding:"10px 12px",marginBottom:4,cursor:"pointer",transition:"background .15s"}} onClick={()=>{setRmhTopic(t);}} onMouseEnter={e=>e.currentTarget.style.background="#ffffff0f"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff05"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,fontWeight:600,color:"#ccc"}}>{t.title}</div>
                <span style={{fontSize:12,color:sec.color}}>›</span>
              </div>
              <div style={{fontSize:11,color:"#666",marginTop:3,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{t.content}</div>
            </div>))}</div>}
          </div>
        ))}
        <div style={{textAlign:"center",padding:"20px 0",fontSize:10,color:"#444",lineHeight:1.6}}>Based on publicly available TCCC/75th Ranger Regiment doctrine.<br/>Obtain the full RMH for complete protocols and procedures.</div>
      </div><Bar/></div>);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRAINING TAB
  // ═══════════════════════════════════════════════════════════════════════════

  if (tab === "train" && view === "home") {
    return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>TCCC / CLS / PFC Training</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>Interactive Modules</div></div></div>
      <div ref={ref} style={S.body}>
        <div style={{padding:"16px 0 8px"}}><p style={{fontSize:12,color:"#666",lineHeight:1.6,margin:0}}>MARCH, E-PAWS-B, RAVINES, hemorrhage control, airway management, and PFC scenarios.</p></div>
        {TOPICS.map(t=>(<div key={t.id} style={S.card} onMouseEnter={e=>{e.currentTarget.style.background="#ffffff0f";e.currentTarget.style.borderColor=`${t.color}30`}} onMouseLeave={e=>{e.currentTarget.style.background="#ffffff08";e.currentTarget.style.borderColor="#ffffff0f"}} onClick={()=>nav("topic",()=>setSelTopic(t.id))}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{fontSize:22,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:11,background:`${t.color}14`}}>{t.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{t.title}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{t.subtitle}</div></div>
            <span style={{color:"#444",fontSize:14}}>›</span>
          </div>
        </div>))}
      </div><Bar/></div>);
  }

  // TOPIC MENU
  if (view === "topic" && topic) {
    const isScen = !!topic.scenarios;
    const modes = isScen ? [{ key:"scenarios",label:"PFC Scenarios",desc:`${topic.scenarios.length} scenarios`,icon:"⏱️" }]
      : [{ key:"steps",label:"Step-by-Step",desc:`${topic.steps.length} steps`,icon:"📖" },{ key:"quiz",label:"Quiz",desc:`${topic.quiz.length} questions`,icon:"✅" },{ key:"flashcards",label:"Flashcards",desc:`${topic.flashcards.length} cards`,icon:"🃏" }];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("home")}>←</button><div><div style={{fontSize:15,fontWeight:700}}>{topic.icon} {topic.title}</div><div style={{fontSize:11,color:"#666"}}>{topic.subtitle}</div></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"16px 0"}}>
        {modes.map(m=>(<div key={m.key} style={{...S.card,display:"flex",alignItems:"center",gap:11}} onMouseEnter={e=>e.currentTarget.style.background="#ffffff0f"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff08"} onClick={()=>{
          if(m.key==="steps") nav("steps",()=>setStep({i:0}));
          else if(m.key==="quiz") nav("quiz",()=>setQuiz({i:0,ans:[],done:false,sel:null}));
          else if(m.key==="flashcards") nav("flashcards",()=>setFlash({i:0,flip:false}));
          else if(m.key==="scenarios") nav("scenarios");
        }}><span style={{fontSize:20}}>{m.icon}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{m.label}</div><div style={{fontSize:11,color:"#666",marginTop:1}}>{m.desc}</div></div><span style={{color:"#444"}}>›</span></div>))}
      </div></div><Bar/></div>);
  }

  // STEPS
  if (view === "steps" && topic) {
    const st = topic.steps[step.i];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("topic")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>Step {step.i+1}/{topic.steps.length}</div><Prog c={step.i+1} t={topic.steps.length}/></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"20px 0 10px"}}>
        <span style={{fontSize:10,fontWeight:700,color:topic.color,textTransform:"uppercase",letterSpacing:".06em",background:`${topic.color}18`,padding:"2px 8px",borderRadius:6}}>{topic.title}</span>
        <h2 style={{fontSize:18,fontWeight:700,marginTop:12,marginBottom:8,lineHeight:1.3}}>{st.title}</h2>
        <p style={{fontSize:13,color:"#aaa",lineHeight:1.7,margin:"0 0 16px"}}>{st.detail}</p>
        <div style={{background:`${topic.color}0a`,border:`1px solid ${topic.color}25`,borderRadius:11,padding:14}}>
          <div style={{fontSize:9,fontWeight:700,color:topic.color,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Field Instruction</div>
          <p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{st.instruction}</p>
        </div>
      </div>
      <div style={{display:"flex",gap:8,paddingTop:10}}>
        <button style={{...S.btn("#555",false),opacity:step.i===0?.3:1}} disabled={step.i===0} onClick={()=>tr(()=>setStep({i:step.i-1}))}>Prev</button>
        <button style={S.btn(topic.color,true)} onClick={()=>step.i<topic.steps.length-1?tr(()=>setStep({i:step.i+1})):nav("topic")}>{step.i<topic.steps.length-1?"Next":"Done"}</button>
      </div></div><Bar/></div>);
  }

  // QUIZ
  if (view === "quiz" && topic) {
    if (quiz.done) { const c=quiz.ans.filter((a,i)=>a===topic.quiz[i].correct).length; const p=Math.round(c/topic.quiz.length*100);
      return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("topic")}>←</button><div style={{fontSize:14,fontWeight:600}}>Results</div></div>
        <div ref={ref} style={S.body}><div style={{textAlign:"center",padding:"36px 0 20px"}}>
          <div style={{fontSize:50,fontWeight:800,background:p>=80?"linear-gradient(135deg,#10b981,#6ee7b7)":p>=60?"linear-gradient(135deg,#f59e0b,#fcd34d)":"linear-gradient(135deg,#ef4444,#fca5a5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{p}%</div>
          <div style={{fontSize:13,color:"#888",marginTop:4}}>{c}/{topic.quiz.length} correct</div>
          <div style={{fontSize:12,color:"#555",marginTop:12,lineHeight:1.6}}>{p>=80?"Strong.":p>=60?"Good foundation. Review missed areas.":"Needs more review."}</div>
        </div>
        <div style={{display:"flex",gap:8}}><button style={S.btn("#555",false)} onClick={()=>nav("quiz",()=>setQuiz({i:0,ans:[],done:false,sel:null}))}>Retry</button><button style={S.btn(topic.color,true)} onClick={()=>nav("topic")}>Back</button></div>
        </div><Bar/></div>);
    }
    const q=topic.quiz[quiz.i], a=quiz.sel!==null;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("topic")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>Q {quiz.i+1}/{topic.quiz.length}</div><Prog c={quiz.i+1} t={topic.quiz.length}/></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"20px 0 14px"}}><h3 style={{fontSize:16,fontWeight:600,lineHeight:1.5,margin:0}}>{q.q}</h3></div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{q.options.map((o,i)=>(<button key={i} style={S.opt(quiz.sel===i,q.correct===i,a)} onClick={()=>!a&&setQuiz(p=>({...p,sel:i}))}><span style={{fontWeight:600,marginRight:7,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}</button>))}</div>
        {a&&<div style={{marginTop:14}}><button style={S.btn(topic.color,true)} onClick={()=>{const na=[...quiz.ans,quiz.sel];quiz.i<topic.quiz.length-1?tr(()=>setQuiz({i:quiz.i+1,ans:na,done:false,sel:null})):tr(()=>setQuiz({...quiz,ans:na,done:true}))}}>{quiz.i<topic.quiz.length-1?"Next":"Results"}</button></div>}
      </div><Bar/></div>);
  }

  // FLASHCARDS
  if (view === "flashcards" && topic) {
    const c=topic.flashcards[flash.i];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("topic")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>Card {flash.i+1}/{topic.flashcards.length}</div><Prog c={flash.i+1} t={topic.flashcards.length}/></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"24px 0"}}>
        <div onClick={()=>setFlash(p=>({...p,flip:!p.flip}))} style={{background:flash.flip?`${topic.color}0a`:"#ffffff08",border:`1.5px solid ${flash.flip?`${topic.color}30`:"#ffffff14"}`,borderRadius:16,padding:24,minHeight:160,display:"flex",flexDirection:"column",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:9,fontWeight:700,color:flash.flip?topic.color:"#555",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>{flash.flip?"Answer":"Question"}</div>
          <div style={{fontSize:flash.flip?13:17,fontWeight:flash.flip?400:600,lineHeight:1.6,color:flash.flip?"#ccc":"#e8e8ed"}}>{flash.flip?c.back:c.front}</div>
          {!flash.flip&&<div style={{fontSize:10,color:"#444",marginTop:16,textAlign:"center"}}>Tap to reveal</div>}
        </div>
      </div>
      <div style={{display:"flex",gap:8}}><button style={{...S.btn("#555",false),opacity:flash.i===0?.3:1}} disabled={flash.i===0} onClick={()=>tr(()=>setFlash({i:flash.i-1,flip:false}))}>Prev</button><button style={S.btn(topic.color,true)} onClick={()=>flash.i<topic.flashcards.length-1?tr(()=>setFlash({i:flash.i+1,flip:false})):nav("topic")}>{flash.i<topic.flashcards.length-1?"Next":"Done"}</button></div>
      </div><Bar/></div>);
  }

  // SCENARIOS
  if (view === "scenarios" && topic?.scenarios) {
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("topic")}>←</button><div style={{fontSize:14,fontWeight:600}}>PFC Scenarios</div></div>
      <div ref={ref} style={S.body}><div style={{padding:"16px 0"}}>
        <p style={{fontSize:12,color:"#777",lineHeight:1.6,margin:"0 0 14px"}}>Make prolonged field care decisions with delayed evacuation, limited resources, and evolving patients.</p>
        {topic.scenarios.map((sc,i)=>(<div key={i} style={S.card} onMouseEnter={e=>e.currentTarget.style.background="#ffffff0f"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff08"} onClick={()=>nav("scen-play",()=>setScen({si:i,di:0,sel:null,hist:[],done:false}))}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{sc.title}</div><div style={{fontSize:11,color:"#777"}}>{sc.decisions.length} decisions</div>
        </div>))}
      </div></div><Bar/></div>);
  }

  // SCENARIO PLAY
  if (view === "scen-play" && topic?.scenarios) {
    const sc = topic.scenarios[scen.si];
    if (scen.done) { const cc=scen.hist.filter(h=>h.ok).length;
      return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("scenarios")}>←</button><div style={{fontSize:14,fontWeight:600}}>Complete</div></div>
        <div ref={ref} style={S.body}><div style={{textAlign:"center",padding:"32px 0 20px"}}><div style={{fontSize:40}}>{cc===sc.decisions.length?"🏆":"📋"}</div><div style={{fontSize:18,fontWeight:700,marginTop:10}}>{sc.title}</div><div style={{fontSize:13,color:"#888",marginTop:6}}>{cc}/{sc.decisions.length} optimal</div></div>
          {scen.hist.map((h,i)=>(<div key={i} style={{background:h.ok?"#10b9810f":"#ef44440f",border:`1px solid ${h.ok?"#10b98120":"#ef444420"}`,borderRadius:10,padding:12,marginBottom:8}}><div style={{fontSize:12,fontWeight:600,color:h.ok?"#10b981":"#ef4444",marginBottom:4}}>Decision {i+1}: {h.ok?"Correct":"Suboptimal"}</div><div style={{fontSize:11,color:"#aaa",lineHeight:1.5}}>{h.result}</div></div>))}
          <div style={{display:"flex",gap:8,marginTop:12}}><button style={S.btn("#555",false)} onClick={()=>nav("scen-play",()=>setScen({si:scen.si,di:0,sel:null,hist:[],done:false}))}>Retry</button><button style={S.btn(topic.color,true)} onClick={()=>nav("scenarios")}>All Scenarios</button></div>
        </div><Bar/></div>);
    }
    const d=sc.decisions[scen.di];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("scenarios")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{sc.title}</div><Prog c={scen.di+1} t={sc.decisions.length}/></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"16px 0"}}>
        {scen.di===0&&<div style={{background:"#f9731510",border:"1px solid #f9731525",borderRadius:12,padding:14,marginBottom:14}}><div style={{fontSize:9,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Situation</div><p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{sc.setup}</p></div>}
        <h3 style={{fontSize:15,fontWeight:600,lineHeight:1.5,margin:"0 0 12px"}}>{d.prompt}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{d.options.map((o,i)=>(<button key={i} style={S.opt(scen.sel===i,o.correct,scen.sel!==null)} onClick={()=>scen.sel===null&&setScen(p=>({...p,sel:i}))}>{o.text}</button>))}</div>
        {scen.sel!==null&&<div style={{marginTop:12}}>
          <div style={{background:d.options[scen.sel].correct?"#10b9810f":"#ef44440f",border:`1px solid ${d.options[scen.sel].correct?"#10b98120":"#ef444420"}`,borderRadius:12,padding:14,marginBottom:12}}><p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{d.options[scen.sel].result}</p></div>
          <button style={S.btn(topic.color,true)} onClick={()=>{const nh=[...scen.hist,{ok:d.options[scen.sel].correct,result:d.options[scen.sel].result}];scen.di<sc.decisions.length-1?tr(()=>setScen(p=>({...p,di:p.di+1,sel:null,hist:nh}))):tr(()=>setScen(p=>({...p,done:true,hist:nh})))}}>{scen.di<sc.decisions.length-1?"Next Decision":"Results"}</button>
        </div>}
      </div></div><Bar/></div>);
  }

  return <div style={S.app}><Bar/></div>;
}
