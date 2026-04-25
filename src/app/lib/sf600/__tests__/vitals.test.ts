import { describe, it, expect } from "vitest";
import { isVitalInRange, hasVitals, vitalsSummary } from "../vitals";
import { VITALS_RANGES } from "../constants";

// Pure-function tests for the vitals helpers. No DB, no DOM, no React.
// These guard against regressions in the validation ranges - if a future
// constants edit changes a bound, these tests will catch it.

describe("isVitalInRange", () => {
  it("treats empty string as in-range (not entered yet)", () => {
    expect(isVitalInRange("hr", "")).toBe(true);
    expect(isVitalInRange("sbp", "")).toBe(true);
    expect(isVitalInRange("pain", "")).toBe(true);
  });

  it("treats non-numeric input as out-of-range", () => {
    expect(isVitalInRange("hr", "abc")).toBe(false);
    expect(isVitalInRange("sbp", "120/80")).toBe(false); // BP entered as fraction
  });

  it("accepts values exactly at the min and max boundaries", () => {
    expect(isVitalInRange("hr", String(VITALS_RANGES.hr.min))).toBe(true);
    expect(isVitalInRange("hr", String(VITALS_RANGES.hr.max))).toBe(true);
    expect(isVitalInRange("pain", "0")).toBe(true);
    expect(isVitalInRange("pain", "10")).toBe(true);
  });

  it("rejects values one outside the boundaries", () => {
    expect(isVitalInRange("hr", String(VITALS_RANGES.hr.min - 1))).toBe(false);
    expect(isVitalInRange("hr", String(VITALS_RANGES.hr.max + 1))).toBe(false);
    expect(isVitalInRange("pain", "11")).toBe(false);
    expect(isVitalInRange("pain", "-1")).toBe(false);
  });

  it("accepts plausible field values across all vitals", () => {
    expect(isVitalInRange("hr", "88")).toBe(true);
    expect(isVitalInRange("sbp", "120")).toBe(true);
    expect(isVitalInRange("dbp", "78")).toBe(true);
    expect(isVitalInRange("rr", "16")).toBe(true);
    expect(isVitalInRange("spo2", "98")).toBe(true);
    expect(isVitalInRange("temp", "98.6")).toBe(true);
    expect(isVitalInRange("pain", "3")).toBe(true);
  });

  it("rejects typo-shaped inputs (extra zeros)", () => {
    // Common autocorrect / fat-finger mistakes the validator should flag.
    expect(isVitalInRange("hr", "880")).toBe(false);    // meant 88
    expect(isVitalInRange("rr", "160")).toBe(false);    // meant 16
    expect(isVitalInRange("spo2", "980")).toBe(false);  // meant 98
  });

  it("accepts decimal temperature in Fahrenheit", () => {
    expect(isVitalInRange("temp", "98.6")).toBe(true);
    expect(isVitalInRange("temp", "104.0")).toBe(true);
    expect(isVitalInRange("temp", "85.0")).toBe(true);
  });

  it("rejects Celsius temperature mistakenly entered (37 < 85 lower bound)", () => {
    // Documents the failure mode: the validator catches unit errors
    // because the range is set up for Fahrenheit only.
    expect(isVitalInRange("temp", "37")).toBe(false);
  });
});

describe("hasVitals", () => {
  it("returns false for an empty object", () => {
    expect(hasVitals({})).toBe(false);
  });

  it("returns false when all fields are empty strings", () => {
    expect(hasVitals({ hr: "", sbp: "", dbp: "" })).toBe(false);
  });

  it("returns false for whitespace-only fields", () => {
    expect(hasVitals({ hr: "   ", pain: "  " })).toBe(false);
  });

  it("returns true when any single field is set", () => {
    expect(hasVitals({ hr: "88" })).toBe(true);
    expect(hasVitals({ sbp: "120" })).toBe(true);
    expect(hasVitals({ pain: "0" })).toBe(true); // pain 0 is a valid datum
    expect(hasVitals({ temp: "98.6" })).toBe(true);
  });
});

describe("vitalsSummary", () => {
  it("returns empty string when nothing is set", () => {
    expect(vitalsSummary({})).toBe("");
  });

  it("formats a full set of vitals with middle-dot separators", () => {
    const out = vitalsSummary({
      hr: "88", sbp: "120", dbp: "78", rr: "16", spo2: "98", temp: "98.6", pain: "3",
    });
    expect(out).toContain("HR 88");
    expect(out).toContain("BP 120/78");
    expect(out).toContain("RR 16");
    expect(out).toContain("SpO2 98%");
    expect(out).toContain("T 98.6");
    expect(out).toContain("Pain 3/10");
    expect(out).toContain(" \u00b7 "); // middle dot
  });

  it("renders BP with placeholder when only one half is recorded", () => {
    expect(vitalsSummary({ sbp: "120" })).toBe("BP 120/-");
    expect(vitalsSummary({ dbp: "78" })).toBe("BP -/78");
  });

  it("omits sections that are empty", () => {
    const out = vitalsSummary({ hr: "88", spo2: "98" });
    expect(out).toBe("HR 88 \u00b7 SpO2 98%");
    expect(out).not.toContain("BP");
    expect(out).not.toContain("RR");
  });
});
