// JTS TCCC AAR - PDF export
//
// Medeor-styled PDF, drawn from scratch with pdf-lib (same approach as the
// SF 600 export). NOT a clone of the government form. Renders every section
// from fields.ts with the values the medic entered, word-wrapped, omitting
// empty fields to keep the page readable.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { AAR_SECTIONS } from "./fields";
import type { AarReport } from "./db";

const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.4, 0.4, 0.4);
const HEADER_FILL = rgb(0.92, 0.92, 0.92);
const BRAND = rgb(0.29, 0.18, 0.55);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const out: string[] = [];
  for (const para of (text || "").split("\n")) {
    if (!para) { out.push(""); continue; }
    const words = para.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > maxW && line) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

export async function exportAarPdf(report: AarReport): Promise<void> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const ensure = (need: number) => {
    if (y - need < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  };

  // Title block
  page.drawText("TCCC AFTER-ACTION REPORT", { x: MARGIN, y, size: 16, font: bold, color: BLACK });
  y -= 18;
  page.drawText("Medeor-styled draft - transcribe to the official JTS TCCC AAR for submission", {
    x: MARGIN, y, size: 8, font, color: GRAY,
  });
  y -= 22;

  for (const section of AAR_SECTIONS) {
    const rows = section.fields
      .map((f) => ({ label: f.label, value: (report.values[f.id] || "").trim() }))
      .filter((r) => r.value.length > 0);
    if (rows.length === 0) continue;

    ensure(28);
    // Section header bar
    page.drawRectangle({ x: MARGIN, y: y - 16, width: CONTENT_W, height: 18, color: HEADER_FILL });
    page.drawText(section.title.toUpperCase(), { x: MARGIN + 6, y: y - 12, size: 9, font: bold, color: BLACK });
    y -= 26;

    for (const row of rows) {
      const labelLines = wrap(row.label, bold, 8, CONTENT_W);
      const valueLines = wrap(row.value, font, 9, CONTENT_W - 12);
      const blockH = labelLines.length * 11 + valueLines.length * 12 + 6;
      ensure(blockH);

      for (const l of labelLines) {
        page.drawText(l, { x: MARGIN, y, size: 8, font: bold, color: GRAY });
        y -= 11;
      }
      for (const l of valueLines) {
        page.drawText(l, { x: MARGIN + 10, y, size: 9, font, color: BLACK });
        y -= 12;
      }
      y -= 4;
    }
    y -= 6;
  }

  // Footer on every page
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawText(`Medeor TCCC AAR  -  page ${i + 1} of ${pages.length}  -  FOUO when completed`, {
      x: MARGIN, y: 24, size: 7, font, color: GRAY,
    });
    p.drawLine({ start: { x: MARGIN, y: 34 }, end: { x: PAGE_W - MARGIN, y: 34 }, thickness: 0.5, color: BRAND });
  });

  const bytes = await doc.save();
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = (report.title || "report").replace(/[^a-z0-9_-]+/gi, "_").slice(0, 40);
  a.href = url;
  a.download = `AAR_${safe}_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
