// DD 1380 TCCC Card - PDF export
//
// Medeor-styled PDF drawn from scratch with pdf-lib (same approach as SF 600
// and the AAR export). NOT a clone of the government form. Renders each
// section from fields.ts, omitting empty fields. Multiselect values (mechanism
// of injury) render as a comma-joined list.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { DD1380_SECTIONS } from "./fields";
import type { DdCard, DdValue } from "./db";

const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.4, 0.4, 0.4);
const HEADER_FILL = rgb(0.92, 0.92, 0.92);
const BRAND = rgb(0.29, 0.18, 0.55);
const RED = rgb(0.78, 0.15, 0.15);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

function valueToString(v: DdValue | undefined): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.join(", ");
  return v;
}

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

export async function exportDd1380Pdf(card: DdCard): Promise<void> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const ensure = (need: number) => {
    if (y - need < MARGIN + 20) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  };

  page.drawText("TCCC CARD (DD 1380 - style)", { x: MARGIN, y, size: 16, font: bold, color: BLACK });
  y -= 18;
  page.drawText("Medeor-styled draft. Transcribe to the official DD Form 1380 for the record.", {
    x: MARGIN, y, size: 8, font, color: GRAY,
  });
  y -= 14;
  page.drawText("CUI / PRVCY WHEN FILLED IN", { x: MARGIN, y, size: 8, font: bold, color: RED });
  y -= 22;

  for (const section of DD1380_SECTIONS) {
    const rows = section.fields
      .map((f) => ({ label: f.label, value: valueToString(card.values[f.id]).trim() }))
      .filter((r) => r.value.length > 0);
    if (rows.length === 0) continue;

    ensure(28);
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

  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawText(`Medeor TCCC Card  -  page ${i + 1} of ${pages.length}  -  CUI/PRVCY when filled in`, {
      x: MARGIN, y: 24, size: 7, font, color: GRAY,
    });
    p.drawLine({ start: { x: MARGIN, y: 34 }, end: { x: PAGE_W - MARGIN, y: 34 }, thickness: 0.5, color: BRAND });
  });

  const bytes = await doc.save();
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = (card.title || "card").replace(/[^a-z0-9_-]+/gi, "_").slice(0, 40);
  a.href = url;
  a.download = `DD1380_${safe}_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
