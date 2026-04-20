// safeStorage — thin wrapper around localStorage that logs failures instead
// of silently swallowing them. Intended to replace empty catch blocks
// scattered across the app. Guards against SSR (typeof window === "undefined")
// and against private-mode / quota errors at runtime.
//
// Usage:
//   import { safeStorage } from "@/app/lib/safeStorage";
//   const raw = safeStorage.get("medeor_progress");
//   safeStorage.set("medeor_progress", JSON.stringify(data));
//
// For JSON-shaped data, prefer getJSON / setJSON which handle parse/stringify
// and return null / false on failure rather than throwing.

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function get(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    console.warn(`safeStorage.get("${key}") failed:`, e);
    return null;
  }
}

function set(key: string, value: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`safeStorage.set("${key}") failed:`, e);
    return false;
  }
}

function remove(key: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`safeStorage.remove("${key}") failed:`, e);
    return false;
  }
}

function getJSON<T = unknown>(key: string, fallback: T | null = null): T | null {
  const raw = get(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`safeStorage.getJSON("${key}") parse failed:`, e);
    return fallback;
  }
}

function setJSON(key: string, value: unknown): boolean {
  try {
    return set(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`safeStorage.setJSON("${key}") stringify failed:`, e);
    return false;
  }
}

export const safeStorage = {
  get,
  set,
  remove,
  getJSON,
  setJSON,
};
