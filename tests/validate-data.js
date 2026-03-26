/**
 * Medeor Data Validation Tests
 * Run: node tests/validate-data.js
 * Verifies clinical content data integrity before deploy.
 */

const fs = require("fs");
const path = require("path");

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

// Dynamic import workaround for ES modules
async function run() {
  // Load data files by evaluating them
  const topicsPath = path.join(__dirname, "../src/app/data/topics.js");
  const medsPath = path.join(__dirname, "../src/app/data/medications.js");
  const diagramsDir = path.join(__dirname, "../public/diagrams");

  // Parse TOPICS from file
  const topicsSource = fs.readFileSync(topicsPath, "utf-8");
  const topicsMatch = topicsSource.match(/export const TOPICS = (\[[\s\S]*\]);/);
  if (!topicsMatch) {
    console.error("FAIL: Could not parse TOPICS from topics.js");
    process.exit(1);
  }
  const TOPICS = eval(topicsMatch[1]);

  // Parse MEDICATIONS from file
  const medsSource = fs.readFileSync(medsPath, "utf-8");
  const medsMatch = medsSource.match(/export const MEDICATIONS = (\[[\s\S]*\]);/);
  const catsMatch = medsSource.match(/export const MED_CATEGORIES = (\[[\s\S]*?\]);/);
  if (!medsMatch || !catsMatch) {
    console.error("FAIL: Could not parse MEDICATIONS from medications.js");
    process.exit(1);
  }
  const MEDICATIONS = eval(medsMatch[1]);
  const MED_CATEGORIES = eval(catsMatch[1]);

  console.log("\n=== MEDEOR DATA VALIDATION ===\n");

  // ─── TOPICS STRUCTURE ───
  console.log("Topics structure:");
  const topicIds = new Set();
  TOPICS.forEach((topic, ti) => {
    const label = `topics[${ti}] (${topic.id || "NO ID"})`;

    assert(topic.id && typeof topic.id === "string", `${label}: missing or invalid id`);
    assert(topic.title && typeof topic.title === "string", `${label}: missing title`);
    assert(topic.icon, `${label}: missing icon`);
    assert(topic.color && topic.color.startsWith("#"), `${label}: missing or invalid color`);
    assert(topic.subtitle, `${label}: missing subtitle`);

    // No duplicate IDs
    assert(!topicIds.has(topic.id), `${label}: duplicate topic id "${topic.id}"`);
    topicIds.add(topic.id);

    // Must have either steps+quiz+flashcards OR scenarios
    const isScenario = !!topic.scenarios;
    if (isScenario) {
      assert(Array.isArray(topic.scenarios) && topic.scenarios.length > 0, `${label}: scenarios must be non-empty array`);
      topic.scenarios.forEach((scenario, si) => {
        assert(scenario.title, `${label} scenario[${si}]: missing title`);
        assert(scenario.setup, `${label} scenario[${si}]: missing setup`);
        assert(Array.isArray(scenario.decisions) && scenario.decisions.length > 0, `${label} scenario[${si}]: missing decisions`);
        scenario.decisions.forEach((decision, di) => {
          assert(decision.prompt, `${label} scenario[${si}] decision[${di}]: missing prompt`);
          assert(Array.isArray(decision.options) && decision.options.length >= 2, `${label} scenario[${si}] decision[${di}]: needs 2+ options`);
          const hasCorrect = decision.options.some(o => o.correct === true);
          assert(hasCorrect, `${label} scenario[${si}] decision[${di}]: no option marked correct`);
          decision.options.forEach((opt, oi) => {
            assert(opt.text, `${label} scenario[${si}] decision[${di}] option[${oi}]: missing text`);
            assert(opt.result, `${label} scenario[${si}] decision[${di}] option[${oi}]: missing result`);
          });
        });
      });
    } else {
      assert(Array.isArray(topic.steps) && topic.steps.length > 0, `${label}: missing steps`);
      assert(Array.isArray(topic.quiz) && topic.quiz.length > 0, `${label}: missing quiz`);
      assert(Array.isArray(topic.flashcards) && topic.flashcards.length > 0, `${label}: missing flashcards`);
    }
  });

  // ─── QUIZ VALIDATION ───
  console.log("Quiz questions:");
  TOPICS.forEach((topic) => {
    if (!topic.quiz) return;
    topic.quiz.forEach((q, qi) => {
      const label = `${topic.id} quiz[${qi}]`;
      assert(q.q && typeof q.q === "string", `${label}: missing question text`);
      assert(Array.isArray(q.options) && q.options.length >= 2, `${label}: needs 2+ options`);
      assert(typeof q.correct === "number", `${label}: correct must be a number`);
      assert(q.correct >= 0 && q.correct < q.options.length, `${label}: correct index ${q.correct} out of bounds (${q.options.length} options)`);
      assert(q.why && typeof q.why === "string", `${label}: missing rationale (why)`);
    });
  });

  // ─── FLASHCARD VALIDATION ───
  console.log("Flashcards:");
  TOPICS.forEach((topic) => {
    if (!topic.flashcards) return;
    topic.flashcards.forEach((fc, fi) => {
      const label = `${topic.id} flashcard[${fi}]`;
      assert(fc.front && typeof fc.front === "string", `${label}: missing front`);
      assert(fc.back && typeof fc.back === "string", `${label}: missing back`);
    });
  });

  // ─── STEP VALIDATION ───
  console.log("Steps:");
  TOPICS.forEach((topic) => {
    if (!topic.steps) return;
    topic.steps.forEach((step, si) => {
      const label = `${topic.id} step[${si}]`;
      assert(step.title && typeof step.title === "string", `${label}: missing title`);
      assert(step.detail && typeof step.detail === "string", `${label}: missing detail`);
      assert(step.instruction && typeof step.instruction === "string", `${label}: missing instruction`);
    });
  });

  // ─── DIAGRAM PATHS ───
  console.log("Diagram paths:");
  TOPICS.forEach((topic) => {
    if (!topic.steps) return;
    topic.steps.forEach((step, si) => {
      if (step.diagram) {
        const diagramFile = path.join(__dirname, "../public", step.diagram);
        assert(fs.existsSync(diagramFile), `${topic.id} step[${si}]: diagram file not found: ${step.diagram}`);
      }
    });
  });

  // ─── SEO DATA ───
  console.log("SEO data:");
  TOPICS.forEach((topic) => {
    const label = `${topic.id} seo`;
    if (topic.seo) {
      assert(topic.seo.title && typeof topic.seo.title === "string", `${label}: missing title`);
      assert(topic.seo.description && typeof topic.seo.description === "string", `${label}: missing description`);
      assert(topic.seo.heading && typeof topic.seo.heading === "string", `${label}: missing heading`);
      assert(topic.seo.intro && typeof topic.seo.intro === "string", `${label}: missing intro`);
      assert(Array.isArray(topic.seo.ssrTopics) && topic.seo.ssrTopics.length > 0, `${label}: missing ssrTopics`);
    } else {
      assert(false, `${label}: missing seo object entirely`);
    }
  });

  // ─── MEDICATIONS VALIDATION ───
  console.log("Medications:");
  const validCategories = MED_CATEGORIES.map(c => c.id).filter(id => id !== "all");
  const medNames = new Set();
  MEDICATIONS.forEach((med, mi) => {
    const label = `medication[${mi}] (${med.name || "NO NAME"})`;
    assert(med.name && typeof med.name === "string", `${label}: missing name`);
    assert(med.category && validCategories.includes(med.category), `${label}: invalid category "${med.category}"`);
    assert(med.phase, `${label}: missing phase`);
    assert(med.dose, `${label}: missing dose`);
    assert(med.route, `${label}: missing route`);
    assert(med.indication, `${label}: missing indication`);
    assert(med.warnings, `${label}: missing warnings`);
    assert(med.notes, `${label}: missing notes`);

    // No duplicate med names
    assert(!medNames.has(med.name), `${label}: duplicate medication name`);
    medNames.add(med.name);

    // Peds per-kg dose validation
    if (med.pedsPerKg !== undefined) {
      assert(typeof med.pedsPerKg === "number" && med.pedsPerKg > 0, `${label}: pedsPerKg must be positive number`);
      assert(med.pedsUnit, `${label}: has pedsPerKg but missing pedsUnit`);
      assert(med.pedsRoute, `${label}: has pedsPerKg but missing pedsRoute`);
    }
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
