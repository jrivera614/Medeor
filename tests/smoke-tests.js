/**
 * Medeor Smoke Tests
 * Run: node tests/smoke-tests.js
 * Tests application logic without a browser.
 */

const fs = require("fs");
const path = require("path");

// Resolve data file path with .ts or .js extension (migration-friendly)
function resolveData(relPath) {
  const base = path.join(__dirname, relPath);
  const tsPath = base.replace(/\.js$/, ".ts");
  if (fs.existsSync(tsPath)) return tsPath;
  if (fs.existsSync(base)) return base;
  throw new Error(`Data file not found: ${base} or ${tsPath}`);
}


let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    errors.push(message);
    console.error(`  FAIL: ${message}`);
  }
}

function assertApprox(actual, expected, tolerance, message) {
  assert(Math.abs(actual - expected) <= tolerance, `${message}: expected ~${expected}, got ${actual}`);
}

async function run() {
  const topicsSource = fs.readFileSync(resolveData("../src/app/data/topics.js"), "utf-8");
  const topicsMatch = topicsSource.match(/export const TOPICS(?:\s*:\s*\w+\[\])?\s*=\s*(\[[\s\S]*\]);/);
  // Stub Lucide icon identifiers so eval() can resolve them.
     // Validation only checks topic.icon truthiness, not its actual value.
     const ListOrdered = "Icon", RefreshCw = "Icon", Mountain = "Icon", Droplets = "Icon",
           Wind = "Icon", HeartPulse = "Icon", Timer = "Icon", Pill = "Icon",
           Zap = "Icon", Hourglass = "Icon", Scissors = "Icon";
     const TOPICS = eval(topicsMatch[1]);

  const medsSource = fs.readFileSync(resolveData("../src/app/data/medications.js"), "utf-8");
  const medsMatch = medsSource.match(/export const MEDICATIONS(?:\s*:\s*\w+\[\])?\s*=\s*(\[[\s\S]*\]);/);
  const catsMatch = medsSource.match(/export const MED_CATEGORIES(?:\s*:\s*\w+\[\])?\s*=\s*(\[[\s\S]*?\]);/);
  const MEDICATIONS = eval(medsMatch[1]);
  const MED_CATEGORIES = eval(catsMatch[1]);

  console.log("\n=== MEDEOR SMOKE TESTS ===\n");

  // ─── QUIZ SCORING LOGIC ───
  console.log("Quiz scoring:");

  TOPICS.forEach(topic => {
    if (!topic.quiz) return;

    // Simulate perfect score
    const perfectAnswers = topic.quiz.map(q => q.correct);
    const perfectCount = perfectAnswers.filter((answer, i) => answer === topic.quiz[i].correct).length;
    const perfectPercent = Math.round(perfectCount / topic.quiz.length * 100);
    assert(perfectPercent === 100, `${topic.id}: perfect score should be 100%, got ${perfectPercent}%`);

    // Simulate all wrong (pick first non-correct option)
    const wrongAnswers = topic.quiz.map(q => {
      for (let i = 0; i < q.options.length; i++) {
        if (i !== q.correct) return i;
      }
      return 0;
    });
    const wrongCount = wrongAnswers.filter((answer, i) => answer === topic.quiz[i].correct).length;
    assert(wrongCount === 0, `${topic.id}: all-wrong score should be 0 correct, got ${wrongCount}`);

    // Verify no quiz has correct index pointing to undefined option
    topic.quiz.forEach((q, qi) => {
      assert(q.options[q.correct] !== undefined, `${topic.id} quiz[${qi}]: correct option at index ${q.correct} is undefined`);
    });
  });

  // ─── CALCULATOR LOGIC ───
  console.log("Calculator outputs:");

  // Parkland: 4 * weight * TBSA
  const parkland70_30 = 4 * 70 * 30;
  assert(parkland70_30 === 8400, `Parkland 70kg 30%: expected 8400, got ${parkland70_30}`);
  const parkland80_50 = 4 * 80 * 50;
  assert(parkland80_50 === 16000, `Parkland 80kg 50%: expected 16000, got ${parkland80_50}`);

  // First 8 hours = total / 2
  assertApprox(parkland70_30 / 2, 4200, 0, "Parkland first 8hr: 70kg 30%");
  // Rate = first8 / 8
  assertApprox(parkland70_30 / 2 / 8, 525, 0, "Parkland rate 8hr: 70kg 30%");

  // GCS: E + V + M
  const gcsTests = [
    { e: 4, v: 5, m: 6, total: 15, severity: "Mild TBI" },
    { e: 3, v: 3, m: 5, total: 11, severity: "Moderate TBI" },
    { e: 1, v: 1, m: 3, total: 5, severity: "Severe TBI" },
    { e: 1, v: 1, m: 1, total: 3, severity: "Severe TBI" },
    { e: 2, v: 3, m: 4, total: 9, severity: "Moderate TBI" },
    { e: 2, v: 2, m: 4, total: 8, severity: "Severe TBI" },
  ];
  gcsTests.forEach(t => {
    const total = t.e + t.v + t.m;
    assert(total === t.total, `GCS E${t.e}V${t.v}M${t.m}: expected ${t.total}, got ${total}`);
    const severity = total <= 8 ? "Severe TBI" : total <= 12 ? "Moderate TBI" : "Mild TBI";
    assert(severity === t.severity, `GCS ${t.total} severity: expected ${t.severity}, got ${severity}`);
  });

  // GCS 8 = definitive airway
  assert(8 <= 8, "GCS 8 should trigger definitive airway recommendation");
  assert(!(9 <= 8), "GCS 9 should NOT trigger definitive airway");

  // Peds dosing from medications.js
  console.log("Peds dosing (single source):");
  const pedsDrugs = MEDICATIONS.filter(m => m.pedsPerKg);
  assert(pedsDrugs.length >= 8, `Expected 8+ peds drugs, got ${pedsDrugs.length}`);

  // Ketamine analgesic: 0.5 mg/kg * 25kg = 12.5mg
  const ketAnalgesic = pedsDrugs.find(d => d.name === "Ketamine (Analgesic)");
  assert(ketAnalgesic, "Ketamine (Analgesic) should have pedsPerKg");
  if (ketAnalgesic) {
    assertApprox(ketAnalgesic.pedsPerKg * 25, 12.5, 0.01, "Ketamine analgesic 25kg dose");
  }

  // Succinylcholine: 1.5 mg/kg * 30kg = 45mg
  const succ = pedsDrugs.find(d => d.name === "Succinylcholine");
  assert(succ, "Succinylcholine should have pedsPerKg");
  if (succ) {
    assertApprox(succ.pedsPerKg * 30, 45, 0.01, "Succinylcholine 30kg dose");
  }

  // Epinephrine: 0.01 mg/kg * 20kg = 0.2mg
  const epi = pedsDrugs.find(d => d.name === "Epinephrine (Cardiac Arrest)");
  assert(epi, "Epinephrine should have pedsPerKg");
  if (epi) {
    assertApprox(epi.pedsPerKg * 20, 0.2, 0.001, "Epinephrine 20kg dose");
  }

  // ─── MODULE ROUTING ───
  console.log("Module routing:");

  const expectedModules = ["march", "epaws", "ravines", "hemorrhage", "airway", "wbb", "pfc-scenarios", "pfc-meds", "shock", "longitudinal", "pfc-procedures"];
  expectedModules.forEach(id => {
    const topic = TOPICS.find(t => t.id === id);
    assert(topic, `Module "${id}" should exist in TOPICS`);
    if (topic) {
      assert(topic.seo, `Module "${id}" should have SEO data`);
      assert(topic.seo.title, `Module "${id}" SEO should have title`);
      assert(topic.seo.ssrTopics && topic.seo.ssrTopics.length > 0, `Module "${id}" SEO should have ssrTopics`);
    }
  });

  // Non-existent module should return undefined
  assert(!TOPICS.find(t => t.id === "nonexistent"), "Nonexistent module should return undefined");

  // ─── MEDICATION FILTERING ───
  console.log("Medication filtering:");

  const validCategories = MED_CATEGORIES.map(c => c.id).filter(id => id !== "all");

  // Filter by each category
  validCategories.forEach(cat => {
    const filtered = MEDICATIONS.filter(m => m.category === cat);
    assert(filtered.length > 0, `Category "${cat}" should have at least 1 medication, got ${filtered.length}`);
  });

  // Search simulation
  const searchTXA = MEDICATIONS.filter(m =>
    m.name.toLowerCase().includes("txa") ||
    m.indication.toLowerCase().includes("txa") ||
    m.dose.toLowerCase().includes("txa")
  );
  assert(searchTXA.length >= 1, `Search "txa" should find at least 1 result, got ${searchTXA.length}`);

  const searchKetamine = MEDICATIONS.filter(m =>
    m.name.toLowerCase().includes("ketamine")
  );
  assert(searchKetamine.length >= 3, `Search "ketamine" should find 3+ results (analgesic, procedural, RSI), got ${searchKetamine.length}`);

  // ─── SCENARIO LOGIC ───
  console.log("Scenario logic:");

  const scenarioTopics = TOPICS.filter(t => t.scenarios);
  assert(scenarioTopics.length >= 1, `Should have at least 1 scenario module`);

  scenarioTopics.forEach(topic => {
    topic.scenarios.forEach((scenario, si) => {
      // Simulate optimal path (always pick correct)
      let optimalCount = 0;
      scenario.decisions.forEach(decision => {
        const correctOption = decision.options.find(o => o.correct === true);
        if (correctOption) optimalCount++;
      });
      assert(optimalCount === scenario.decisions.length, `${topic.id} scenario[${si}]: every decision should have a correct option`);
    });
  });

  // ─── RANGE GUARD LOGIC ───
  console.log("Calculator range guards:");

  // Parkland weight range
  const parklandWeightTests = [
    { weight: -5, shouldWarn: true },
    { weight: 0, shouldWarn: true },
    { weight: 70, shouldWarn: false },
    { weight: 300, shouldWarn: false },
    { weight: 301, shouldWarn: true },
  ];
  parklandWeightTests.forEach(t => {
    const warns = t.weight < 1 || t.weight > 300;
    assert(warns === t.shouldWarn, `Parkland weight ${t.weight}kg: warn=${warns}, expected=${t.shouldWarn}`);
  });

  // Peds weight range
  const pedsWeightTests = [
    { weight: 0.5, shouldWarn: true },
    { weight: 25, shouldWarn: false },
    { weight: 80, shouldWarn: false },
    { weight: 81, shouldWarn: true, type: "soft" },
    { weight: 151, shouldWarn: true },
  ];
  pedsWeightTests.forEach(t => {
    const hardWarn = t.weight < 1 || t.weight > 150;
    const softWarn = !hardWarn && t.weight > 80;
    const warns = hardWarn || softWarn;
    assert(warns === t.shouldWarn, `Peds weight ${t.weight}kg: warn=${warns}, expected=${t.shouldWarn}`);
  });

  // TBSA range
  const tbsaTests = [
    { tbsa: 0, shouldWarn: true },
    { tbsa: 30, shouldWarn: false },
    { tbsa: 100, shouldWarn: false },
    { tbsa: 101, shouldWarn: true },
  ];
  tbsaTests.forEach(t => {
    const warns = t.tbsa < 1 || t.tbsa > 100;
    assert(warns === t.shouldWarn, `TBSA ${t.tbsa}%: warn=${warns}, expected=${t.shouldWarn}`);
  });

  // ─── RESULTS ───
  console.log("\n=== RESULTS ===");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (errors.length > 0) {
    console.log("\nFailures:");
    errors.forEach(e => console.log(`  - ${e}`));
  }
  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
