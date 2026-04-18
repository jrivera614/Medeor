"use client";
import {
  TX_ITEMS, PRIORITIES, LABS, VENT_FIELDS, BURN_REGIONS,
  calcGCS, calcMAP, calcSI,
} from "../constants";
import type {
  Patient, Mist, History, Tourniquets, Medication, VitalSet, CarePlan,
  LabResults, BurnStates, BurnDepths, TreatmentChecks, TreatmentTimes,
  PriorityStates, VentState,
} from "../types";

interface UsePdfExportArgs {
  patient: Patient;
  mist: Mist;
  history: History;
  tourniquets: Tourniquets;
  meds: Medication[];
  labResults: LabResults;
  burns: BurnStates;
  burnDepth: BurnDepths;
  checks: TreatmentChecks;
  checkTimes: TreatmentTimes;
  priorities: PriorityStates;
  vitals: VitalSet[];
  vent: VentState;
  carePlan: CarePlan;
  treatmentsDone: number;
  prioritiesDone: number;
  tbsa: number;
}

// HTML escape for PDF output. Matches the original `esc` inline function.
function esc(str: string | number | null | undefined): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function usePdfExport(args: UsePdfExportArgs): () => void {
  const {
    patient, mist, history, tourniquets, meds, labResults,
    burns, burnDepth, checks, checkTimes, priorities, vitals, vent, carePlan,
    treatmentsDone, prioritiesDone, tbsa,
  } = args;

  return () => {
    const pdfWindow = window.open("", "_blank");
    if (!pdfWindow) {
      alert("Popup blocked. Please allow popups for medeor.app to export PDFs.");
      return;
    }

    const pdfHeading = (title: string) =>
      `<div style="background:#111;color:#fff;padding:4px 8px;font-size:12px;font-weight:700;letter-spacing:1px;margin:14px 0 6px">${esc(title)}</div>`;

    const pdfField = (label: string, value: string) =>
      `<div style="display:inline-block;margin:2px 8px 2px 0"><span style="font-size:9px;color:#888;text-transform:uppercase">${esc(label)}</span><div style="font-size:12px;border-bottom:1px solid #ccc;min-width:60px;padding:1px 0">${esc(value) || " — "}</div></div>`;

    const pdfCheckbox = (label: string, done: boolean, time: string) =>
      `<div style="display:flex;align-items:center;gap:4px;padding:2px 0;font-size:11px;${done ? "color:#2e7d32" : ""}"><span style="display:inline-block;width:11px;height:11px;border:1px solid ${done ? "#2e7d32" : "#999"};${done ? "background:#2e7d32;color:#fff;" : ""}font-size:9px;text-align:center;line-height:11px">${done ? "\u2713" : ""}</span>${esc(label)}${time ? ` <span style="color:#999;font-size:9px">(${esc(time)})</span>` : ""}</div>`;

    const tdStyle = `style="border:1px solid #ddd;padding:3px 6px;font-size:10px"`;
    const thStyle = `style="border:1px solid #ddd;padding:3px 6px;font-size:10px;background:#f0f0f0;font-weight:600;text-align:left"`;

    pdfWindow.document.write(`<!DOCTYPE html><html><head><title>PCC Card - ${esc(patient.name) || "Patient"}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;font-size:11px;padding:12px;max-width:960px;margin:0 auto}table{width:100%;border-collapse:collapse}.cols{display:flex;gap:8px}.cols>div{flex:1}@media print{body{padding:6px}}</style></head><body>`);
    pdfWindow.document.write(`<div style="text-align:center;font-size:15px;font-weight:800;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:8px">PROLONGED CASUALTY CARE CARD</div>`);
    pdfWindow.document.write(`<div style="text-align:right;font-size:8px;color:#999;margin-top:-6px;margin-bottom:6px">Generated ${new Date().toLocaleString()} | Based on JTS PCC CPG FY26</div>`);

    pdfWindow.document.write(pdfHeading("PATIENT INFO"));
    ([
      ["Name", patient.name], ["BR#", patient.id], ["Date", patient.date],
      ["Time", patient.time], ["TZ", patient.tz], ["PFC Start", patient.pfcStart],
      ["Wt kg", patient.wtkg], ["Wt lbs", patient.wtlbs], ["Ht", patient.ht],
      ["IBW", patient.ibw], ["Blood", patient.blood], ["Titer", patient.titer],
      ["Triage", patient.triage], ["EVAC", patient.evac], ["Status", patient.status],
    ] as Array<[string, string]>).forEach(([label, value]) => pdfWindow.document.write(pdfField(label, value)));

    pdfWindow.document.write(pdfHeading("M.I.S.T. REPORT"));
    ([
      ["Mechanism", mist.m], ["Injuries", mist.i], ["Signs/Symptoms", mist.s],
      ["Treatment", mist.t], ["Report Time", mist.time], ["Reported To", mist.to],
    ] as Array<[string, string]>).forEach(([label, value]) => pdfWindow.document.write(`<div style="margin-bottom:4px"><span style="font-size:9px;color:#888">${esc(label)}</span><div style="font-size:11px;border-bottom:1px solid #eee;min-height:14px">${esc(value)}</div></div>`));

    pdfWindow.document.write(pdfHeading("MEDICAL HISTORY"));
    ([
      ["Allergies", history.allergies], ["Medications", history.meds],
      ["Past Hx", history.past], ["Last Oral Intake", history.oral],
      ["Events", history.events],
    ] as Array<[string, string]>).forEach(([label, value]) => pdfWindow.document.write(`<div style="margin-bottom:4px"><span style="font-size:9px;color:#888">${esc(label)}</span><div style="font-size:11px;border-bottom:1px solid #eee;min-height:14px">${esc(value)}</div></div>`));

    pdfWindow.document.write(pdfHeading("INTERVENTIONS"));
    ([
      ["TQ1 On", tourniquets.t1on], ["TQ1 Conv", tourniquets.t1c],
      ["TQ2 On", tourniquets.t2on], ["TQ2 Conv", tourniquets.t2c],
      ["TQ3 On", tourniquets.t3on], ["TQ3 Conv", tourniquets.t3c],
      ["TQ4 On", tourniquets.t4on], ["TQ4 Conv", tourniquets.t4c],
      ["TXA 2g", tourniquets.txa], ["Ca 1g", tourniquets.ca],
    ] as Array<[string, string]>).forEach(([label, value]) => pdfWindow.document.write(pdfField(label, value)));

    if (meds.length) {
      pdfWindow.document.write(`<div style="margin-top:8px;font-size:11px;font-weight:700">Medications</div><table><tr><th ${thStyle}>Drug</th><th ${thStyle}>Dose</th><th ${thStyle}>Route</th><th ${thStyle}>Time</th></tr>`);
      meds.forEach(med => pdfWindow.document.write(`<tr><td ${tdStyle}>${esc(med.drug)}</td><td ${tdStyle}>${esc(med.dose)}</td><td ${tdStyle}>${esc(med.route)}</td><td ${tdStyle}>${esc(med.time)}</td></tr>`));
      pdfWindow.document.write(`</table>`);
    }

    pdfWindow.document.write(pdfHeading("LAB VALUES"));
    pdfWindow.document.write(`<table><tr><th ${thStyle}>Test</th><th ${thStyle}>Ref</th><th ${thStyle}>Result</th></tr>`);
    LABS.forEach(lab => pdfWindow.document.write(`<tr><td ${tdStyle}>${esc(lab.n)}</td><td ${tdStyle}>${esc(lab.r)}</td><td ${tdStyle} style="font-weight:600">${esc(labResults[lab.n])}</td></tr>`));
    pdfWindow.document.write(`</table>`);

    if (tbsa > 0) {
      pdfWindow.document.write(pdfHeading(`BURNS (TBSA: ${tbsa}%)`));
      BURN_REGIONS.filter(r => burns[r.id]).forEach(r =>
        pdfWindow.document.write(`<div style="font-size:11px;padding:2px 0">${esc(r.label)}: ${r.pct}% ${burnDepth[r.id] ? `(${esc(burnDepth[r.id])})` : ""}</div>`)
      );
      if (patient.wtkg) {
        const fluid = 4 * parseFloat(patient.wtkg) * tbsa;
        pdfWindow.document.write(`<div style="margin-top:4px;font-size:11px;font-weight:700">Parkland: ${fluid.toFixed(0)}ml/24hr | First 8hr: ${(fluid / 2).toFixed(0)}ml (${(fluid / 2 / 8).toFixed(0)}ml/hr)</div>`);
      }
    }

    pdfWindow.document.write(pdfHeading(`TREATMENT (${treatmentsDone}/${TX_ITEMS.length})`));
    pdfWindow.document.write(`<div class="cols"><div>`);
    const half = Math.ceil(TX_ITEMS.length / 2);
    TX_ITEMS.forEach((item, i) => {
      if (i === half) pdfWindow.document.write(`</div><div>`);
      pdfWindow.document.write(pdfCheckbox(item, checks[item], checkTimes[item]));
    });
    pdfWindow.document.write(`</div></div>`);

    pdfWindow.document.write(pdfHeading(`PRIORITIES (${prioritiesDone}/${PRIORITIES.length})`));
    pdfWindow.document.write(`<div class="cols"><div>`);
    const prioHalf = Math.ceil(PRIORITIES.length / 2);
    PRIORITIES.forEach((pItem, i) => {
      if (i === prioHalf) pdfWindow.document.write(`</div><div>`);
      pdfWindow.document.write(pdfCheckbox(pItem, priorities[pItem], ""));
    });
    pdfWindow.document.write(`</div></div>`);

    if (vitals.length) {
      pdfWindow.document.write(pdfHeading("VITAL SIGNS"));
      pdfWindow.document.write(`<table><tr><th ${thStyle}>Time</th><th ${thStyle}>HR</th><th ${thStyle}>BP</th><th ${thStyle}>MAP</th><th ${thStyle}>SI</th><th ${thStyle}>RR</th><th ${thStyle}>SpO2</th><th ${thStyle}>ETCO2</th><th ${thStyle}>Temp</th><th ${thStyle}>GCS</th><th ${thStyle}>AVPU</th><th ${thStyle}>Pain</th><th ${thStyle}>RASS</th><th ${thStyle}>In</th><th ${thStyle}>UOP</th></tr>`);
      vitals.forEach(v => {
        const gcs = calcGCS(v);
        const map = calcMAP(v);
        const si = calcSI(v);
        pdfWindow.document.write(`<tr><td ${tdStyle}>${esc(v.time)}</td><td ${tdStyle}>${esc(v.hr)}</td><td ${tdStyle}>${esc(v.sbp)}/${esc(v.dbp)}</td><td ${tdStyle}>${map || ""}</td><td ${tdStyle}>${si || ""}</td><td ${tdStyle}>${esc(v.rr)}</td><td ${tdStyle}>${esc(v.spo2)}</td><td ${tdStyle}>${esc(v.etco2)}</td><td ${tdStyle}>${esc(v.temp)}</td><td ${tdStyle}>${gcs || ""}</td><td ${tdStyle}>${esc(v.avpu)}</td><td ${tdStyle}>${esc(v.pain)}</td><td ${tdStyle}>${esc(v.rass)}</td><td ${tdStyle}>${esc(v.fluidIn)}</td><td ${tdStyle}>${esc(v.urineOut)}</td></tr>`);
      });
      pdfWindow.document.write(`</table>`);
      vitals.forEach((v, i) => {
        if (v.notes) pdfWindow.document.write(`<div style="font-size:10px"><b>Set ${i + 1}:</b> ${esc(v.notes)}</div>`);
      });
    }

    pdfWindow.document.write(pdfHeading("VENTILATOR"));
    VENT_FIELDS.forEach(vf => pdfWindow.document.write(pdfField(vf, vent[vf])));

    pdfWindow.document.write(pdfHeading("PPGC"));
    pdfWindow.document.write(`<div class="cols">`);
    ([
      ["Problems", carePlan.problems], ["Plans", carePlan.plans],
      ["Goals", carePlan.goals], ["Concerns", carePlan.concerns],
    ] as Array<[string, string]>).forEach(([label, value]) => pdfWindow.document.write(`<div style="border:1px solid #ddd;padding:6px;min-height:50px"><div style="font-weight:700;font-size:10px">${esc(label)}</div><div style="font-size:11px;white-space:pre-wrap">${esc(value)}</div></div>`));
    pdfWindow.document.write(`</div>`);

    if (carePlan.notes) {
      pdfWindow.document.write(`<div style="margin-top:8px;border:1px solid #ddd;padding:6px"><div style="font-weight:700;font-size:10px">Assessment Notes</div><div style="font-size:11px;white-space:pre-wrap">${esc(carePlan.notes)}</div></div>`);
    }

    pdfWindow.document.write(`<div style="text-align:center;margin-top:12px;font-size:8px;color:#aaa">Based on JTS PCC CPG FY26 | jts.health.mil | medeor.app</div>`);
    pdfWindow.document.write(`<div style="text-align:center;font-size:7px;color:#bbb;margin-top:4px">FOR OFFICIAL USE ONLY. Use Battle Roster # for patient identification. Do not include SSN or full name in unsecured systems. All data stored locally on device only.</div>`);
    pdfWindow.document.write(`<script src="/html2pdf.min.js"><\/script><script>window.onload=function(){html2pdf().set({margin:[8,8,8,8],filename:"PFC_Card_${esc((patient.name || "Patient").replace(/[^a-zA-Z0-9]/g, "_"))}_${patient.date || new Date().toISOString().split("T")[0]}.pdf",image:{type:"jpeg",quality:0.98},html2canvas:{scale:2},jsPDF:{unit:"mm",format:"letter",orientation:"portrait"}}).from(document.body).save()};<\/script></body></html>`);
    pdfWindow.document.close();
  };
}
