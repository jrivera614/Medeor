// SF 600 - PDF export
//
// Uses pdf-lib (already a dependency) to render an SF 600 - Chronological
// Record of Medical Care - styled PDF for a single patient and all their
// entries. NOT pixel-perfect to the official OPM form; it is a Medeor-styled
// export that matches the form's structure and required fields.
//
// Text handling: wrap, don't truncate. Long names, long unit names, and long
// signatures all get word-wrapped to fit their column. The previous
// truncation-at-N-chars behavior cost us patient identifying info in the
// prototype, which is a documentation hazard in a medical record.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Patient, Entry } from "@/app/lib/sf600/types";
import { PDF_DIMS } from "@/app/lib/sf600/constants";
import { vitalsSummary } from "@/app/lib/sf600/vitals";
import { fmtDateMil } from "@/app/lib/sf600/format";

// wrapText: split a string into lines that each fit within maxWidth at the
// given font/size. Preserves explicit \n boundaries. Does NOT split words
// that are individually wider than maxWidth - those overflow rather than
// breaking mid-word, because mid-word breaks in a medical record can change
// meaning ("hypotension" vs "hypo" + "tension").
export function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const paragraph of (text || "").split("\n")) {
    if (!paragraph) { lines.push(""); continue; }
    const words = paragraph.split(/\s+/);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.4, 0.4, 0.4);
const HEADER_FILL = rgb(0.92, 0.92, 0.92);
const VITALS_BLUE = rgb(0.15, 0.15, 0.5);
const FOOTER_GRAY = rgb(0.5, 0.5, 0.5);

interface PageState {
  page: PDFPage;
  y: number;
}

// drawWrappedText: write each line of `lines` starting at (x, startY), moving
// down by lineHeight. Returns the y of the line below the last line drawn.
function drawWrappedText(
  page: PDFPage,
  lines: string[],
  x: number,
  startY: number,
  font: PDFFont,
  size: number,
  lineHeight: number,
  color = BLACK,
): number {
  let y = startY;
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color });
    y -= lineHeight;
  }
  return y;
}

export async function exportSF600Pdf(patient: Patient, entries: Entry[]): Promise<Uint8Array> {
  const D = PDF_DIMS;
  const NARR_X = D.margin + D.dateColWidth;
  const NARR_W = D.pageWidth - 2 * D.margin - D.dateColWidth - D.signColWidth;
  const SIGN_X = D.pageWidth - D.margin - D.signColWidth;

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const state: PageState = {
    page: doc.addPage([D.pageWidth, D.pageHeight]),
    y: D.pageHeight - D.margin,
  };

  function drawDocHeader() {
    state.page.drawText("CHRONOLOGICAL RECORD OF MEDICAL CARE", {
      x: D.margin, y: state.y, size: D.headerFontSize, font: fontBold, color: BLACK,
    });
    state.y -= 14;
    state.page.drawText("Standard Form 600 - Medeor export", {
      x: D.margin, y: state.y, size: 8, font, color: GRAY,
    });
    state.page.drawText("CUI (When Filled Out)", {
      x: D.pageWidth - D.margin - 110,
      y: D.pageHeight - D.margin,
      size: 8, font: fontBold, color: BLACK,
    });
    state.y -= 12;
  }

  // Patient block: 5 fields in a 2-column grid. Long names wrap onto a second
  // line within the cell rather than getting truncated.
  function drawPatientBlock() {
    const fullName = `${patient.lastName}, ${patient.firstName}${
      patient.middleName ? " " + patient.middleName : ""
    }`;
    const fields: Array<[string, string]> = [
      ["NAME", fullName],
      ["ID NO / SSN", patient.idNumber || "N/A"],
      ["SEX", patient.sex || "-"],
      ["DOB", patient.dob || "-"],
      ["RANK / GRADE", patient.rankGrade || "-"],
    ];
    const colW = (D.pageWidth - 2 * D.margin) / 2;
    const cellPad = 6;
    const valFontSize = 9;
    const valLineH = 10;
    const labelH = 10;

    // Compute each cell's required height based on wrapped value lines.
    const cellHeights = fields.map(([, val]) => {
      const wrapped = wrapText(val, font, valFontSize, colW - 2 * cellPad);
      return labelH + Math.max(wrapped.length, 1) * valLineH + cellPad;
    });

    // Row heights = max of two cells in that row (2-col layout).
    const rowHeights: number[] = [];
    for (let i = 0; i < cellHeights.length; i += 2) {
      rowHeights.push(Math.max(cellHeights[i], cellHeights[i + 1] ?? 0));
    }
    const boxH = rowHeights.reduce((a, b) => a + b, 0);
    const boxTop = state.y;

    state.page.drawRectangle({
      x: D.margin, y: boxTop - boxH,
      width: D.pageWidth - 2 * D.margin, height: boxH,
      borderColor: BLACK, borderWidth: 0.75,
    });

    fields.forEach(([label, val], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cellTop = boxTop - rowHeights.slice(0, row).reduce((a, b) => a + b, 0);
      const x = D.margin + col * colW + cellPad;
      const labelY = cellTop - labelH;
      state.page.drawText(label, {
        x, y: labelY, size: 6.5, font: fontBold, color: rgb(0.35, 0.35, 0.35),
      });
      const wrapped = wrapText(val, font, valFontSize, colW - 2 * cellPad);
      drawWrappedText(state.page, wrapped, x, labelY - valLineH, font, valFontSize, valLineH);
    });

    state.y = boxTop - boxH - 12;
  }

  function drawTableHeader() {
    const hH = 16;
    state.page.drawRectangle({
      x: D.margin, y: state.y - hH,
      width: D.pageWidth - 2 * D.margin, height: hH,
      color: HEADER_FILL, borderColor: BLACK, borderWidth: 0.75,
    });
    state.page.drawText("DATE", {
      x: D.margin + D.cellPadX, y: state.y - 11,
      size: 8, font: fontBold, color: BLACK,
    });
    state.page.drawText("VITALS \u00b7 SYMPTOMS, DIAGNOSIS, TREATMENT, TREATING ORG", {
      x: NARR_X + D.cellPadX, y: state.y - 11,
      size: 7.5, font: fontBold, color: BLACK,
    });
    state.page.drawText("SIGN", {
      x: SIGN_X + D.cellPadX, y: state.y - 11,
      size: 8, font: fontBold, color: BLACK,
    });
    state.page.drawLine({
      start: { x: NARR_X, y: state.y },
      end: { x: NARR_X, y: state.y - hH },
      thickness: 0.75, color: BLACK,
    });
    state.page.drawLine({
      start: { x: SIGN_X, y: state.y },
      end: { x: SIGN_X, y: state.y - hH },
      thickness: 0.75, color: BLACK,
    });
    state.y -= hH;
  }

  function newPage() {
    state.page = doc.addPage([D.pageWidth, D.pageHeight]);
    state.y = D.pageHeight - D.margin;
    drawDocHeader();
    drawTableHeader();
  }

  function drawEntry(e: Entry) {
    // Build narrative lines: vitals summary on its own line first, then wrapped
    // narrative body.
    const narrLines: string[] = [];
    const vs = vitalsSummary(e);
    if (vs) narrLines.push(`[VITALS] ${vs}`);
    const bodyLines = wrapText(
      e.narrative || "",
      font,
      D.bodyFontSize,
      NARR_W - 2 * D.cellPadX,
    );
    narrLines.push(...bodyLines);

    // Wrap the date and signature columns too. Date rarely needs it but
    // signatures with long unit affiliations definitely do.
    const dateLines = wrapText(
      fmtDateMil(e.date),
      font,
      D.bodyFontSize,
      D.dateColWidth - 2 * D.cellPadX,
    );
    const sigLines: string[] = [];
    sigLines.push(...wrapText(
      e.signedBy || "",
      font,
      D.signFontSize,
      D.signColWidth - 2 * D.cellPadX,
    ));
    if (e.treatingOrganization) {
      sigLines.push(...wrapText(
        e.treatingOrganization,
        font,
        D.signFontSize,
        D.signColWidth - 2 * D.cellPadX,
      ));
    }

    // Entry row height = max of all three columns' wrapped heights.
    const dateH = Math.max(dateLines.length, 1) * D.bodyLineHeight;
    const narrH = Math.max(narrLines.length, 1) * D.bodyLineHeight;
    const sigH = Math.max(sigLines.length, 1) * D.signLineHeight;
    const entryH = Math.max(
      dateH + D.cellPadY,
      narrH + D.cellPadY,
      sigH + D.cellPadY,
      D.minEntryHeight,
    );

    // Page break if this entry won't fit. Reserve 24pt for footer.
    if (state.y - entryH < D.margin + 24) newPage();

    const top = state.y;
    const bot = state.y - entryH;

    state.page.drawRectangle({
      x: D.margin, y: bot,
      width: D.pageWidth - 2 * D.margin, height: entryH,
      borderColor: BLACK, borderWidth: 0.5,
    });
    state.page.drawLine({
      start: { x: NARR_X, y: top },
      end: { x: NARR_X, y: bot },
      thickness: 0.5, color: BLACK,
    });
    state.page.drawLine({
      start: { x: SIGN_X, y: top },
      end: { x: SIGN_X, y: bot },
      thickness: 0.5, color: BLACK,
    });

    // Column 1: date
    drawWrappedText(
      state.page, dateLines,
      D.margin + D.cellPadX, top - 12,
      font, D.bodyFontSize, D.bodyLineHeight,
    );

    // Column 2: vitals (bold blue) + narrative
    let narrY = top - 12;
    narrLines.forEach((line, i) => {
      const isVitals = i === 0 && line.startsWith("[VITALS]");
      state.page.drawText(line, {
        x: NARR_X + D.cellPadX, y: narrY,
        size: D.bodyFontSize,
        font: isVitals ? fontBold : font,
        color: isVitals ? VITALS_BLUE : BLACK,
      });
      narrY -= D.bodyLineHeight;
    });

    // Column 3: signature + treating org
    drawWrappedText(
      state.page, sigLines,
      SIGN_X + D.cellPadX, top - 12,
      font, D.signFontSize, D.signLineHeight,
    );

    state.y = bot;
  }

  drawDocHeader();
  drawPatientBlock();
  drawTableHeader();

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) {
    state.page.drawText("No entries.", {
      x: D.pageWidth / 2 - 24, y: state.y - 30,
      size: 10, font, color: GRAY,
    });
  } else {
    for (const e of sorted) drawEntry(e);
  }

  // Footer on every page
  const stamp = new Date().toISOString().slice(0, 10);
  const footer = `SF 600 style - generated by Medeor - ${stamp}`;
  for (const p of doc.getPages()) {
    p.drawText(footer, {
      x: D.margin, y: 18,
      size: 7, font, color: FOOTER_GRAY,
    });
  }

  return doc.save();
}

// Trigger a browser download for the given patient/entries. Convenience
// wrapper around exportSF600Pdf.
export async function downloadSF600Pdf(patient: Patient, entries: Entry[]): Promise<void> {
  const bytes = await exportSF600Pdf(patient, entries);
  // pdf-lib returns Uint8Array. Wrap in a fresh Uint8Array so the Blob
  // constructor is happy across TS lib versions.
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = `${patient.lastName}_${patient.firstName}`.replace(/[^A-Za-z0-9_-]/g, "");
  a.href = url;
  a.download = `SF600_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
