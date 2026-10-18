// "Save on this device" is opt-in. Until the user turns it on, nothing is written to the device:
// no local storage and no offline cache, so no consent banner is needed (Finnish Act 917/2014, s. 205).
import type { HomeNotes, Lang, MoveInput } from "./types";
import { isLang } from "./i18n";
import { isMoveInput } from "./validate";

const KEY = "movepilot:v1";
const CACHE_PREFIX = "movepilot";
const NOTE_MAX = 120;

export interface Saved {
  input: MoveInput;
  done: string[];
  notes: HomeNotes;
  lang: Lang;
}

export const emptyNotes = (): HomeNotes => ({
  waterValve: "",
  fuseBox: "",
  maintenancePhone: "",
  electricityMeter: "",
  waterMeter: "",
});

export function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.v !== 1 || !isMoveInput(data.input)) return null;
    return {
      input: data.input,
      done: Array.isArray(data.done) ? data.done.filter((id: unknown) => typeof id === "string") : [],
      notes: cleanNotes(data.notes),
      lang: isLang(data.lang) ? data.lang : "en",
    };
  } catch {
    return null; // storage blocked or corrupt: start fresh
  }
}

export function save(saved: Saved): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, ...saved }));
  } catch {
    // Storage full or blocked (private mode): the app keeps working in memory.
  }
}

export async function forget(): Promise<void> {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing stored
  }
  await disableOffline();
}

export function cleanNotes(value: unknown): HomeNotes {
  const notes = emptyNotes();
  if (value && typeof value === "object") {
    for (const key of Object.keys(notes) as (keyof HomeNotes)[]) {
      const v = (value as Record<string, unknown>)[key];
      if (typeof v === "string") notes[key] = v.slice(0, NOTE_MAX);
    }
  }
  return notes;
}

// Offline support. The service worker caches the app and the last forecast, so the plan opens
// on moving day before the new home has internet. Only in production builds, and only when saving is on.
export async function enableOffline(): Promise<void> {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/sw.js");
    const worker = (await navigator.serviceWorker.ready).active;
    // Files this page loaded before the worker existed: the scripts, styles and the forecast.
    const urls = performance
      .getEntriesByType("resource")
      .map((e) => new URL(e.name))
      .filter((u) => u.origin === location.origin && (u.pathname.startsWith("/assets/") || u.pathname === "/api/forecast"))
      .map((u) => u.pathname + u.search);
    worker?.postMessage({ type: "precache", urls });
  } catch {
    // offline support is a bonus; the app works without it
  }
}

async function disableOffline(): Promise<void> {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX)).map((k) => caches.delete(k)));
    }
  } catch {
    // nothing to remove
  }
}
