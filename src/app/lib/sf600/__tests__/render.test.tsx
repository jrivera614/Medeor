// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, act, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "fake-indexeddb/auto";
import Dexie from "dexie";

// Mock next/navigation since we're not running inside a Next route tree.
// Components that call useRouter() get a no-op router and don't crash.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/tools/documentation/sf600",
}));

import { EntryForm } from "../../../tools/documentation/sf600/components/EntryForm";
import { PatientForm } from "../../../tools/documentation/sf600/components/PatientForm";
import { PatientList } from "../../../tools/documentation/sf600/components/PatientList";
import { PatientDetail } from "../../../tools/documentation/sf600/components/PatientDetail";
import { ProviderSelector } from "../../../tools/documentation/sf600/components/ProviderSelector";
import { StorageHealthBanner } from "../../../tools/documentation/sf600/components/StorageHealthBanner";
import { ConflictReport } from "../../../tools/documentation/sf600/components/ConflictReport";
import { uuid } from "../format";
import { DEXIE_DB_NAME } from "../constants";
import type { Patient, Entry, Provider, MergeReport } from "../types";

// Test fixtures
const mkPatient = (over: Partial<Patient> = {}): Patient => ({
  id: uuid(), lastName: "RIVERA", firstName: "Justin",
  middleName: "M", idNumber: "123-45-6789", sex: "M",
  dob: "1985-06-15", rankGrade: "SGT",
  createdAt: 1000, updatedAt: 1000, ...over,
});
const mkEntry = (patientId: string, over: Partial<Entry> = {}): Entry => ({
  id: uuid(), patientId,
  date: "2026-04-25T13:42",
  narrative: "S: HA. O: stable. A: tension HA. P: ibu.",
  signedBy: "RIVERA, J.",
  hr: "72", sbp: "118", dbp: "76",
  createdAt: 1000, updatedAt: 1000, ...over,
});
const mkProvider = (): Provider => ({ name: "RIVERA, J. SGT", unit: "JTF Marianas" });

// Unmount after every test so subsequent tests don't see DOM nodes from
// previous tests (which would make screen.getBy* return multiple matches).
afterEach(() => {
  cleanup();
});

// ─── Smoke renders ──────────────────────────────────────────────────────────

describe("Component smoke renders", () => {
  it("PatientForm renders without crashing", () => {
    render(<PatientForm onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByText("Last Name")).toBeTruthy();
    expect(screen.getByText("First Name")).toBeTruthy();
  });

  it("PatientList renders empty state", () => {
    render(<PatientList patients={[]} entries={[]} onSelect={() => {}} />);
    expect(screen.getByText(/No patients yet/i)).toBeTruthy();
  });

  it("PatientList renders a populated list", () => {
    const p = mkPatient({ lastName: "GARCIA", firstName: "Maria" });
    render(<PatientList patients={[p]} entries={[]} onSelect={() => {}} />);
    expect(screen.getByText(/GARCIA, Maria/)).toBeTruthy();
  });

  it("ProviderSelector starts in edit mode with no provider", () => {
    render(<ProviderSelector provider={null} onChange={() => {}} />);
    expect(screen.getByText(/Set Active Provider/i)).toBeTruthy();
  });

  it("ProviderSelector starts collapsed when provider is set", () => {
    render(<ProviderSelector provider={mkProvider()} onChange={() => {}} />);
    expect(screen.getByText(/Active Provider/i)).toBeTruthy();
    expect(screen.getByText("RIVERA, J. SGT")).toBeTruthy();
  });

  it("StorageHealthBanner renders nothing when storage API unavailable", async () => {
    // jsdom doesn't implement navigator.storage so getStorageHealth returns null.
    const { container } = render(<StorageHealthBanner />);
    await act(async () => { await new Promise((r) => setTimeout(r, 10)); });
    expect(container.textContent).toBe("");
  });

  it("ConflictReport renders the no-conflicts state cleanly", () => {
    const report: MergeReport = { added: 3, updated: 0, unchanged: 1, conflicts: [] };
    render(<ConflictReport report={report} onClose={() => {}} />);
    expect(screen.getByText(/No conflicts/i)).toBeTruthy();
  });

  it("ConflictReport renders a conflict list with winner labels", () => {
    const report: MergeReport = {
      added: 0, updated: 1, unchanged: 0,
      conflicts: [{
        kind: "patient", id: "p1", label: "RIVERA, Justin",
        localUpdatedAt: 1000, incomingUpdatedAt: 2000, winner: "incoming",
      }],
    };
    render(<ConflictReport report={report} onClose={() => {}} />);
    expect(screen.getByText("RIVERA, Justin")).toBeTruthy();
    expect(screen.getByText(/Replaced/i)).toBeTruthy();
  });

  it("PatientDetail renders patient info and empty entries", () => {
    const p = mkPatient();
    render(
      <PatientDetail
        patient={p}
        entries={[]}
        onEditInfo={() => {}}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
        onDeleteEntry={() => {}}
        onExportPdf={async () => {}}
      />
    );
    expect(screen.getByText("RIVERA, Justin M")).toBeTruthy();
    expect(screen.getByText(/No entries yet/i)).toBeTruthy();
  });

  it("PatientDetail renders entries with vitals summary", () => {
    const p = mkPatient();
    const e = mkEntry(p.id);
    render(
      <PatientDetail
        patient={p}
        entries={[e]}
        onEditInfo={() => {}}
        onDelete={() => {}}
        onNewEntry={() => {}}
        onEditEntry={() => {}}
        onDeleteEntry={() => {}}
        onExportPdf={async () => {}}
      />
    );
    expect(screen.getByText(/HR 72/)).toBeTruthy();
    expect(screen.getByText(/BP 118\/76/)).toBeTruthy();
  });
});

// ─── EntryForm: the critical save-and-retry flow ────────────────────────────

describe("EntryForm save flow", () => {
  it("autosaves a typed narrative after debounce", async () => {
    vi.useFakeTimers();
    const onSave = vi.fn(async () => "new-id-1");
    render(
      <EntryForm
        patient={mkPatient()}
        provider={mkProvider()}
        onSave={onSave}
        onDone={() => {}}
      />
    );

    const textarea = screen.getByPlaceholderText(/chief complaint/i);
    fireEvent.change(textarea, { target: { value: "Test narrative" } });

    // Trigger debounce
    await act(async () => {
      vi.advanceTimersByTime(700);
    });
    // Let the async save promise resolve
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onSave).toHaveBeenCalled();
    const draftArg = (onSave.mock.calls[0] as unknown as [{ narrative: string }])[0];
    expect(draftArg.narrative).toBe("Test narrative");
    vi.useRealTimers();
  });

  it("does NOT autosave when no fields are filled (new entry)", async () => {
    vi.useFakeTimers();
    const onSave = vi.fn(async () => "x");
    render(
      <EntryForm
        patient={mkPatient()}
        provider={mkProvider()}
        onSave={onSave}
        onDone={() => {}}
      />
    );
    // No typing - just trigger any state effect
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(onSave).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("shows save-failure UI with retry button when onSave throws", async () => {
    let attempt = 0;
    const onSave = vi.fn(async () => {
      attempt++;
      if (attempt === 1) throw new Error("IndexedDB write failed");
      return "saved-id-2";
    });

    vi.useFakeTimers();
    render(
      <EntryForm
        patient={mkPatient()}
        provider={mkProvider()}
        onSave={onSave}
        onDone={() => {}}
      />
    );

    const textarea = screen.getByPlaceholderText(/chief complaint/i);
    fireEvent.change(textarea, { target: { value: "Critical patient note" } });

    await act(async () => { vi.advanceTimersByTime(700); });
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });

    // Failure UI should now be visible
    vi.useRealTimers();
    await waitFor(() => {
      expect(screen.getByText(/Save Failed/i)).toBeTruthy();
      expect(screen.getByRole("button", { name: /RETRY SAVE/i })).toBeTruthy();
    });
    expect(screen.getByText(/IndexedDB write failed/)).toBeTruthy();

    // Click retry - second attempt should succeed
    fireEvent.click(screen.getByRole("button", { name: /RETRY SAVE/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(2);
    });

    // Verify retry used the latest typed text, not a stale draft
    const retryDraft = (onSave.mock.calls[1] as unknown as [{ narrative: string }])[0];
    expect(retryDraft.narrative).toBe("Critical patient note");
  });

  it("subsequent save (after error) uses currently-typed text, not stale draft", async () => {
    // The behavior we want: if the medic types more text after seeing the
    // error banner, ANY subsequent save attempt (whether via retry click or
    // via the next autosave debounce) must include the new text. This guards
    // against the previous bug where retry held a stale ref of the
    // attempted-but-failed draft.
    let attempt = 0;
    const onSave = vi.fn(async (_draft: { narrative: string }) => {
      attempt++;
      if (attempt === 1) throw new Error("disk full");
      return "id-3";
    });

    vi.useFakeTimers();
    render(
      <EntryForm
        patient={mkPatient()}
        provider={mkProvider()}
        onSave={onSave}
        onDone={() => {}}
      />
    );

    const textarea = screen.getByPlaceholderText(/chief complaint/i);

    // First save attempt - fails
    fireEvent.change(textarea, { target: { value: "first version" } });
    await act(async () => { await vi.runAllTimersAsync(); });
    expect(onSave).toHaveBeenCalledTimes(1);

    // Medic amends the text after seeing the error. The autosave debounce
    // re-fires (attempt 2) and this time it succeeds.
    fireEvent.change(textarea, { target: { value: "first version - amended after failure" } });
    await act(async () => { await vi.runAllTimersAsync(); });

    expect(onSave).toHaveBeenCalledTimes(2);
    const secondDraft = (onSave.mock.calls[1] as unknown as [{ narrative: string }])[0];
    expect(secondDraft.narrative).toBe("first version - amended after failure");

    vi.useRealTimers();
  });

  it("loads existing entry data into the form", () => {
    const e = mkEntry("p1", {
      narrative: "Loaded narrative",
      hr: "88", sbp: "130", pain: "5",
      treatingOrganization: "Test Clinic",
    });
    render(
      <EntryForm
        patient={mkPatient({ id: "p1" })}
        provider={mkProvider()}
        existing={e}
        onSave={async () => e.id}
        onDone={() => {}}
      />
    );
    const textarea = screen.getByPlaceholderText(/chief complaint/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe("Loaded narrative");
  });
});

// ─── PatientForm validation ─────────────────────────────────────────────────

describe("PatientForm validation", () => {
  it("disables save until last name and first name are filled", () => {
    render(<PatientForm onSave={() => {}} onCancel={() => {}} />);
    const saveBtn = screen.getByRole("button", { name: /SAVE PATIENT/i });
    expect((saveBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it("enables save when both names are filled", () => {
    render(<PatientForm onSave={() => {}} onCancel={() => {}} />);
    const lastInput = screen.getAllByRole("textbox")[0];
    const firstInput = screen.getAllByRole("textbox")[1];
    fireEvent.change(lastInput, { target: { value: "RIVERA" } });
    fireEvent.change(firstInput, { target: { value: "Justin" } });
    const saveBtn = screen.getByRole("button", { name: /SAVE PATIENT/i });
    expect((saveBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it("calls onSave with trimmed values on submit", () => {
    const onSave = vi.fn();
    render(<PatientForm onSave={onSave} onCancel={() => {}} />);
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "  RIVERA  " } });
    fireEvent.change(screen.getAllByRole("textbox")[1], { target: { value: " Justin " } });
    fireEvent.click(screen.getByRole("button", { name: /SAVE PATIENT/i }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      lastName: "RIVERA",
      firstName: "Justin",
    }));
  });
});
