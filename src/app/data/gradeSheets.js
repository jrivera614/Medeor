export const GRADE_SHEETS = [
  {
    title: "CAT Tourniquet Application",
    tier: "ASM / CLS",
    color: "#ef4444",
    steps: [
      { text: "Verbalized scene safety and addressed immediate threats", critical: false },
      { text: "Assessed casualty for responsiveness", critical: false },
      { text: "Performed blood sweep to identify life-threatening bleeding", critical: true },
      { text: "Verbalized MARCH sequence for casualty assessment", critical: true },
      { text: "Slid injured extremity through loop of self-adhering band OR wrapped band around extremity and routed through buckle", critical: true },
      { text: "Positioned tourniquet 2-3 inches above wound OR high and tight", critical: true },
      { text: "Pulled self-adhering band TIGHT removing ALL slack", critical: true },
      { text: "Twisted windlass rod until bleeding stopped and distal pulse absent", critical: true },
      { text: "Locked windlass rod into windlass clip", critical: true },
      { text: "Secured windlass strap over windlass rod and clip", critical: false },
      { text: "Marked time of tourniquet application on TQ and casualty", critical: true },
      { text: "Applied second TQ proximal to first if bleeding not controlled", critical: true },
      { text: "Checked for additional wounds (complete blood sweep)", critical: false },
      { text: "Documented treatment on DD 1380 TCCC Casualty Card", critical: false }
    ]
  },
  {
    title: "Wound Packing with Hemostatic Gauze",
    tier: "CLS",
    color: "#dc2626",
    steps: [
      { text: "Identified junctional or non-tourniquet-amenable hemorrhage", critical: true },
      { text: "Exposed the wound completely", critical: true },
      { text: "Identified the bleeding source within the wound", critical: true },
      { text: "Opened hemostatic gauze (Combat Gauze / ChitoGauze / Celox)", critical: false },
      { text: "Packed gauze directly into wound starting at deepest point of bleeding", critical: true },
      { text: "Maintained constant pressure while packing from bottom to top", critical: true },
      { text: "Used ENTIRE roll of gauze to fill wound cavity", critical: true },
      { text: "Applied direct pressure for minimum 3 minutes (timed)", critical: true },
      { text: "Did NOT release pressure to check during 3-minute hold", critical: true },
      { text: "Applied pressure dressing over packed wound", critical: false },
      { text: "Reassessed for continued bleeding after pressure dressing", critical: false },
      { text: "Documented treatment on DD 1380 TCCC Casualty Card", critical: false }
    ]
  },
  {
    title: "NPA Insertion",
    tier: "CLS",
    color: "#3b82f6",
    steps: [
      { text: "Assessed airway: identified snoring, gurgling, or obstruction", critical: true },
      { text: "Assessed for contraindications (basilar skull fracture signs)", critical: true },
      { text: "Sized NPA: measured from nostril to earlobe", critical: true },
      { text: "Lubricated NPA with water-based lubricant", critical: false },
      { text: "Positioned bevel toward nasal septum", critical: true },
      { text: "Inserted into RIGHT nostril (preferred)", critical: false },
      { text: "Advanced NPA along floor of nasal passage (NOT angled upward)", critical: true },
      { text: "Used gentle rotation if resistance encountered", critical: false },
      { text: "Advanced until flange rests against nostril", critical: true },
      { text: "Secured NPA with safety pin through flange", critical: false },
      { text: "Reassessed airway patency after insertion", critical: true },
      { text: "Placed unconscious breathing casualty in recovery position", critical: true },
      { text: "Documented treatment on DD 1380 TCCC Casualty Card", critical: false }
    ]
  },
  {
    title: "Chest Seal Application",
    tier: "CLS",
    color: "#8b5cf6",
    steps: [
      { text: "Identified penetrating chest wound (nipple line to waist, front or back)", critical: true },
      { text: "Exposed chest completely", critical: true },
      { text: "Checked for BOTH entry AND exit wounds", critical: true },
      { text: "Wiped area around wound as dry as possible for adhesion", critical: true },
      { text: "Applied vented chest seal over wound during EXHALATION", critical: true },
      { text: "Pressed firmly on all edges ensuring complete seal", critical: true },
      { text: "Applied chest seal to exit wound if present", critical: true },
      { text: "Monitored casualty for signs of tension pneumothorax", critical: true },
      { text: "If worsening: burped seal (lifted corner, released air, resealed)", critical: true },
      { text: "If no improvement after burping: prepared for needle decompression", critical: false },
      { text: "Documented treatment on DD 1380 TCCC Casualty Card", critical: false }
    ]
  },
  {
    title: "Needle Chest Decompression",
    tier: "CLS / CMC",
    color: "#f59e0b",
    steps: [
      { text: "Identified signs of tension pneumothorax (absent breath sounds, JVD, respiratory distress, tracheal deviation)", critical: true },
      { text: "Confirmed chest seal burping was ineffective or not applicable", critical: false },
      { text: "Selected correct equipment: 14-gauge, 3.25-inch catheter-over-needle", critical: true },
      { text: "Identified primary site: 2nd ICS midclavicular line (affected side)", critical: true },
      { text: "Prepped insertion site if tactically feasible", critical: false },
      { text: "Inserted needle perpendicular to chest wall", critical: true },
      { text: "Inserted ABOVE the 3rd rib (avoiding NV bundle on inferior border)", critical: true },
      { text: "Advanced until rush or hiss of air felt/heard", critical: true },
      { text: "Removed needle, left catheter in place", critical: true },
      { text: "Secured catheter with tape", critical: false },
      { text: "Reassessed breath sounds, respiratory status, and vitals", critical: true },
      { text: "If first NDC unsuccessful: performed second at alternate site (5th ICS AAL)", critical: true },
      { text: "Documented treatment on DD 1380 TCCC Casualty Card", critical: false }
    ]
  },
  {
    title: "Surgical Cricothyrotomy",
    tier: "CMC",
    color: "#06b6d4",
    steps: [
      { text: "Confirmed inability to secure airway with NPA/supraglottic/ETT", critical: true },
      { text: "Positioned casualty supine with neck slightly extended if possible", critical: false },
      { text: "Identified cricothyroid membrane between thyroid and cricoid cartilages", critical: true },
      { text: "Stabilized larynx with non-dominant hand", critical: true },
      { text: "Made vertical 3cm skin incision over cricothyroid membrane", critical: true },
      { text: "Made horizontal stab incision through cricothyroid membrane", critical: true },
      { text: "Inserted tracheal hook or finger to maintain opening", critical: true },
      { text: "Inserted cuffed 6.0 cric/trach tube through membrane into trachea", critical: true },
      { text: "Inflated cuff", critical: true },
      { text: "Confirmed placement with capnography (EtCO2 waveform present)", critical: true },
      { text: "Confirmed bilateral chest rise", critical: true },
      { text: "Confirmed bilateral breath sounds", critical: false },
      { text: "Secured tube with suture or tape/ties", critical: true },
      { text: "Monitored capnography continuously", critical: true },
      { text: "Documented treatment on DD 1380 TCCC Casualty Card", critical: false }
    ]
  },
  {
    title: "Tactical Trauma Assessment (Full CLS)",
    tier: "CLS",
    color: "#10b981",
    steps: [
      { text: "Formed initial impression and verbalized scene safety", critical: false },
      { text: "Assessed casualty responsiveness (AVPU)", critical: true },
      { text: "M: Performed complete blood sweep (head, neck, axillae, chest, abdomen, pelvis, groin, extremities)", critical: true },
      { text: "M: Controlled life-threatening hemorrhage with tourniquet or packing", critical: true },
      { text: "A: Assessed airway patency", critical: true },
      { text: "A: Opened airway with head-tilt chin-lift or jaw thrust", critical: true },
      { text: "A: Inserted NPA if unconscious with intact gag reflex", critical: true },
      { text: "A: Placed unconscious breathing casualty in recovery position", critical: true },
      { text: "R: Assessed breathing rate and chest rise (bilateral, symmetric)", critical: true },
      { text: "R: Exposed chest and checked for penetrating wounds front AND back", critical: true },
      { text: "R: Applied chest seal to all open chest wounds", critical: true },
      { text: "R: Performed needle decompression if tension pneumothorax suspected", critical: true },
      { text: "C: Assessed circulation (pulse quality, skin color, cap refill)", critical: true },
      { text: "C: Established IV/IO access if indicated", critical: false },
      { text: "C: Administered fluids per permissive hypotension protocol", critical: false },
      { text: "H: Prevented hypothermia (insulated from ground, covered, minimized exposure)", critical: true },
      { text: "H: Assessed head injury (AVPU/GCS, pupils)", critical: true },
      { text: "Assessed and treated pain (CWMP for mild-mod, ketamine for severe)", critical: false },
      { text: "Administered antibiotics for open combat wounds", critical: false },
      { text: "Performed secondary survey (head-to-toe) after MARCH complete", critical: false },
      { text: "Documented ALL treatments on DD 1380 TCCC Casualty Card", critical: true },
      { text: "Prepared 9-line MEDEVAC request", critical: false }
    ]
  },
  {
    title: "EZ-IO Intraosseous Access",
    tier: "CMC",
    color: "#f97316",
    steps: [
      { text: "Confirmed need for IO (2 failed IV attempts or immediate need)", critical: true },
      { text: "Identified proximal tibia site: 1-2cm medial, 1cm proximal to tibial tuberosity", critical: true },
      { text: "Prepped insertion site with antiseptic", critical: false },
      { text: "Selected appropriate needle size (adult: 25mm blue or 45mm yellow)", critical: false },
      { text: "Attached needle set to EZ-IO driver", critical: false },
      { text: "Stabilized leg and inserted needle perpendicular to bone surface", critical: true },
      { text: "Drilled until loss of resistance felt (entered marrow cavity)", critical: true },
      { text: "Removed stylet from catheter", critical: true },
      { text: "Attempted aspiration to confirm marrow placement", critical: false },
      { text: "For CONSCIOUS patient: administered Lidocaine 40mg IO FIRST", critical: true },
      { text: "Flushed with 10ml normal saline", critical: true },
      { text: "Connected IV tubing and confirmed flow", critical: true },
      { text: "Secured with EZ-Stabilizer and tape", critical: false },
      { text: "Documented treatment on DD 1380 TCCC Casualty Card", critical: false }
    ]
  }
];

// ─── RANGER MEDIC HANDBOOK (same as v1, already has full content) ─────────
// Keeping the existing RMH data from v1 as-is since it already has
// full clickable content for all topics. No changes needed.

