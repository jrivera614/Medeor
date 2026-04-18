import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Medeor - Free TCCC/CLS/PFC Training | Quizzes, CPGs, Videos',
  description: 'Free interactive TCCC, CLS, and Prolonged Field Care training app. MARCH protocol quizzes, flashcards, 86 JTS CPG direct PDF links, Deployed Medicine videos, Walking Blood Bank module, Parkland burn calculator, GCS calculator, and Ranger Medic Handbook reference. Built for combat medics, corpsmen, PJs, and 18Ds.',
  alternates: {
    canonical: 'https://medeor.app',
  },
};

export default function HomePage() {
  return (
    <>
      {/* SSR content for crawlers */}
      <div style={{position:"absolute",left:"-9999px",width:"1px",height:"1px",overflow:"hidden"}} aria-hidden="true">
        <h1>Medeor - Free TCCC, CLS, and Prolonged Field Care Training</h1>
        <p>Interactive military medical training app with quizzes, flashcards, and clinical decision scenarios. No login required. Works offline.</p>

        <h2>Training Modules</h2>
        <ul>
          <li><a href="/march">MARCH Protocol - Systematic casualty assessment covering massive hemorrhage, airway, respiration, circulation, and hypothermia. 14 steps, 15 quiz questions, 15 flashcards.</a></li>
          <li><a href="/epaws">E-PAWS-B Secondary Survey - Pain management, antibiotics, wound care, splinting, and burns. 9 steps, 12 quiz questions, 12 flashcards.</a></li>
          <li><a href="/ravines">RAVINES Prolonged Field Care - Resuscitation, airway care, ventilation, telemedicine, HITMAN nursing, environmental, and surgical procedures. 8 steps, 12 quiz questions, 12 flashcards.</a></li>
          <li><a href="/hemorrhage">Hemorrhage Control - Tourniquets, wound packing with hemostatic gauze, junctional hemorrhage devices, blood products. 8 steps, 10 quiz questions, 10 flashcards.</a></li>
          <li><a href="/airway">Airway Management - NPA insertion, surgical cricothyrotomy, supraglottic airways, RSI protocols. 8 steps, 10 quiz questions, 10 flashcards.</a></li>
          <li><a href="/wbb">Walking Blood Bank - ROLO program, donor screening, Eldon cards, CPDA collection, transfusion reactions. 10 steps, 15 quiz questions, 12 flashcards.</a></li>
          <li><a href="/pfc-scenarios">Tactical Scenarios - Branching clinical decision scenarios for delayed MEDEVAC, chest trauma, MASCAL triage, and 24-hour PFC.</a></li>
          <li><a href="/pfc-meds">PFC Medications - Ketamine drip titration, push-dose pressors, antibiotic scheduling, analgesic ladder, RASS sedation scale.</a></li>
          <li><a href="/shock">Shock Recognition - Hemorrhagic shock classes, field assessment, septic shock protocol, obstructive shock, reassessment endpoints.</a></li>
          <li><a href="/longitudinal">Longitudinal PFC - Hour-by-hour management from stabilization through MEDEVAC handoff over 24+ hours.</a></li>
          <li><a href="/pfc-procedures">PFC Procedures - Finger thoracostomy, chest tube, escharotomy, fasciotomy, lateral canthotomy, wound debridement.</a></li>
        </ul>

        <h2>Reference Library</h2>
        <ul>
          <li><a href="/meds">Medication Reference: TCCC, PFC, and garrison medications with dosing, routes, and warnings</a></li>
          <li><a href="/cpgs">86 JTS Clinical Practice Guidelines with direct PDF links</a></li>
          <li><a href="/videos">31 Deployed Medicine training videos</a></li>
          <li><a href="/rmh">Ranger Medic Handbook digital reference</a></li>
          <li><a href="/table8">Table 8 skills evaluation grade sheets</a></li>
        </ul>

        <h2>Clinical Tools</h2>
        <ul>
          <li><a href="/tools">Parkland Burn Calculator, GCS Calculator, Pediatric Dosing Calculator</a></li>
          <li><a href="/pcc/card">PCC Casualty Card with PDF export (formerly PFC Casualty Card)</a></li>
        </ul>

        <h2>Blog</h2>
        <ul>
          <li><a href="/blog/free-tccc-practice-quiz">Free TCCC Practice Quiz</a></li>
          <li><a href="/blog/march-protocol-steps">MARCH Protocol Steps Guide</a></li>
          <li><a href="/blog/how-to-apply-tourniquet-cat-gen7">How to Apply a CAT Gen 7 Tourniquet</a></li>
          <li><a href="/blog/needle-chest-decompression-guide">Needle Chest Decompression Guide</a></li>
          <li><a href="/blog/prolonged-field-care-guide">Prolonged Field Care Guide</a></li>
        </ul>

        <p>Built by a combat medic with 17 years of service. Content aligned with current Committee on TCCC guidelines and Joint Trauma System clinical practice guidelines. Free, no account required.</p>
      </div>

      <HomeClient />
    </>
  );
}
