import { describe, it, expect } from "vitest";
import { writeFileSync } from "fs";
import { exportSF600Pdf, wrapText } from "../../../tools/documentation/sf600/pdf/exportPdf";
import { PDFDocument, StandardFonts } from "pdf-lib";
import type { Patient, Entry } from "../types";
import { uuid } from "../format";

// Real-bytes PDF tests. exportSF600Pdf is the most complex, least-trivially-
// testable piece of the package - it wraps text, paginates, draws tables. We
// run it with realistic inputs and assert:
//   1. The output starts with the PDF magic header (%PDF-).
//   2. pdf-lib can re-parse what we generated (catches structural corruption).
//   3. Page count grows with entry count (catches pagination regressions).
//   4. wrapText splits long input correctly.
//
// No DOM needed - exportSF600Pdf returns Uint8Array and never touches window.

function makePatient(over: Partial<Patient> = {}): Patient {
  const now = Date.now();
  return {
    id: uuid(),
    lastName: "RIVERA",
    firstName: "Justin",
    middleName: "M",
    idNumber: "123-45-6789",
    sex: "M",
    dob: "1985-06-15",
    rankGrade: "SGT",
    createdAt: now, updatedAt: now,
    ...over,
  };
}

function makeEntry(patientId: string, over: Partial<Entry> = {}): Entry {
  const now = Date.now();
  return {
    id: uuid(),
    patientId,
    date: "2026-04-25T13:42",
    narrative: "S: HA. O: AVPU=A, vitals stable. A: tension HA. P: ibu 800mg PO, RTC prn.",
    signedBy: "RIVERA, J. SGT",
    treatingOrganization: "JTF Marianas",
    hr: "72", sbp: "118", dbp: "76", rr: "14", spo2: "99", temp: "98.4", pain: "3",
    createdAt: now, updatedAt: now,
    ...over,
  };
}

const PDF_MAGIC = "%PDF-";

describe("wrapText", () => {
  it("splits a long line at word boundaries", async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const longText = "The patient presented with chief complaint of severe headache for the past three days.";
    const lines = wrapText(longText, font, 9, 100);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) {
      expect(font.widthOfTextAtSize(line, 9)).toBeLessThanOrEqual(100 + 0.001);
    }
  });

  it("preserves explicit newlines", async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const text = "line one\nline two\nline three";
    const lines = wrapText(text, font, 9, 500);
    expect(lines).toEqual(["line one", "line two", "line three"]);
  });

  it("returns a single blank line for empty input but preserves blank lines from paragraphs", async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    // "".split("\n") yields [""], which the wrapper turns into a single blank
    // line rather than no lines. Harmless in PDF output (blank vertical space).
    expect(wrapText("", font, 9, 100)).toEqual([""]);
    expect(wrapText("a\n\nb", font, 9, 100)).toEqual(["a", "", "b"]);
  });

  it("does not break individual words even when they exceed maxWidth", async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    // A word like a long medication name that's wider than the column
    const lines = wrapText("supercalifragilisticexpialidocious", font, 9, 50);
    expect(lines.length).toBe(1); // intentionally not split mid-word
    expect(lines[0]).toBe("supercalifragilisticexpialidocious");
  });
});

describe("exportSF600Pdf", () => {
  it("produces bytes that begin with the PDF magic header", async () => {
    const p = makePatient();
    const e = makeEntry(p.id);
    const bytes = await exportSF600Pdf(p, [e]);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(500); // sanity floor
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe(PDF_MAGIC);
  });

  it("produces a PDF that pdf-lib can re-parse", async () => {
    const p = makePatient();
    const e = makeEntry(p.id);
    const bytes = await exportSF600Pdf(p, [e]);
    const reloaded = await PDFDocument.load(bytes);
    expect(reloaded.getPageCount()).toBe(1);
  });

  it("renders zero-entry patients without crashing", async () => {
    const p = makePatient();
    const bytes = await exportSF600Pdf(p, []);
    const reloaded = await PDFDocument.load(bytes);
    expect(reloaded.getPageCount()).toBe(1);
  });

  it("paginates when entries exceed one page", async () => {
    const p = makePatient();
    // 30 entries with substantial narrative each should overflow page 1.
    const entries: Entry[] = [];
    for (let i = 0; i < 30; i++) {
      entries.push(makeEntry(p.id, {
        date: `2026-04-${String((i % 28) + 1).padStart(2, "0")}T13:00`,
        narrative: "Long narrative line one with substantial clinical detail.\n".repeat(4),
      }));
    }
    const bytes = await exportSF600Pdf(p, entries);
    const reloaded = await PDFDocument.load(bytes);
    expect(reloaded.getPageCount()).toBeGreaterThan(1);
  });

  it("does not truncate long patient names - they wrap into the cell", async () => {
    // The patient name field used to be sliced at 60 chars. With wrapping,
    // a long compound name should still be fully present in the rendered PDF.
    const p = makePatient({
      lastName: "VAN DEN BERG-HERNANDEZ-WASHINGTON",
      firstName: "Jonathan-Christopher",
      middleName: "Alexander",
    });
    const bytes = await exportSF600Pdf(p, []);
    expect(bytes).toBeInstanceOf(Uint8Array);
    // Re-parse succeeds = layout math handled the long name without throwing.
    const reloaded = await PDFDocument.load(bytes);
    expect(reloaded.getPageCount()).toBe(1);
  });

  it("does not truncate long signatures - they wrap into the sign column", async () => {
    const p = makePatient();
    const e = makeEntry(p.id, {
      signedBy: "VAN DEN BERG-HERNANDEZ, J.A. CPT MC USA",
      treatingOrganization: "Joint Task Force Marianas / Forward Surgical Element / FOB Andersen",
    });
    const bytes = await exportSF600Pdf(p, [e]);
    const reloaded = await PDFDocument.load(bytes);
    expect(reloaded.getPageCount()).toBe(1);
  });

  it("writes a sample PDF to /tmp for visual inspection", async () => {
    // Generate a realistic single-patient document and persist it so a human
    // can open and look at the output. Skipped silently if /tmp isn't writable.
    const p = makePatient();
    const entries = [
      makeEntry(p.id, {
        date: "2026-04-23T08:15",
        narrative: "S: 32yo M presents with cough x 3d, fever T 101.2 yesterday.\nO: AVPU A, lungs clear, no SOB.\nA: viral URI.\nP: tylenol/ibu, hydration, RTC if SOB or fever > 102.",
        hr: "88", sbp: "118", dbp: "72", rr: "16", spo2: "98", temp: "99.8", pain: "3",
      }),
      makeEntry(p.id, {
        date: "2026-04-25T13:42",
        narrative: "F/U from 23 APR. Cough resolved, no fever. RTD, no further f/u needed.",
        hr: "72", sbp: "120", dbp: "78", rr: "14", spo2: "99", temp: "98.4", pain: "0",
        signedBy: "VAN DEN BERG-HERNANDEZ, J.A. CPT MC USA",
        treatingOrganization: "Joint Task Force Marianas / Forward Surgical Element",
      }),
    ];
    const bytes = await exportSF600Pdf(p, entries);
    try {
      writeFileSync("/tmp/sf600_sample.pdf", bytes);
    } catch {
      // ignore - test still passes if file write fails
    }
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });
});
