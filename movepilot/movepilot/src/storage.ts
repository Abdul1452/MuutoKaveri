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
// The worker writes only while the CONSENT cache exists (see public/sw.js), so deleting the caches
// stops it even if it keeps controlling this tab after it has been unregistered.
const CONSENT = "movepilot-consent";
let offlineWanted = false;
let enabling: Promise<void> | null = null;

export function enableOffline(): Promise<void> {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator) || !("caches" in window)) return Promise.resolve();
  offlineWanted = true;
  enabling = (async () => {
    try {
      await caches.open(CONSENT);
      await navigator.serviceWorker.register("/sw.js");
      const worker = (await navigator.serviceWorker.ready).active;
      if (!offlineWanted) return; // turned off while the worker was installing
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
  })();
  return enabling;
}

async function deleteCaches(): Promise<void> {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX)).map((k) => caches.delete(k)));
}

async function disableOffline(): Promise<void> {
  offlineWanted = false;
  try {
    await deleteCaches(); // first, so the worker stops writing at once
    await enabling; // let a registration that is still in progress finish, then remove it too
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }
    await deleteCaches(); // anything written while the worker was being removed
  } catch {
    // nothing to remove
  }
}
