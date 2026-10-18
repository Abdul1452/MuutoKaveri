import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fetchForecast } from "./fmi.js";
import type { Forecast } from "../src/types.js";

// Shared by the Express server (server/index.ts) and the Vercel function (api/forecast.ts).
// Imports use .js extensions so the files also run as plain ESM after Vercel compiles them.

const here = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(here, "fixtures", "forecast-turku.json");

// Forecasts change a few times a day, so one FMI call per city per 30 minutes is enough.
// This cuts repeat calls to FMI (Motiva: efficient use of caches; Ympäristö OK Web 3).
// The cache is bounded, failures are cached briefly, and requests for the same city share one FMI call,
// so a flood of made-up place names can't grow memory without limit or hammer FMI.
const CACHE_MS = 30 * 60 * 1000;
const FAILURE_CACHE_MS = 5 * 60 * 1000;
const CACHE_MAX = 500;

export interface CachedForecast {
  forecast: Forecast;
  /** When the answer goes stale (ms since epoch); also tells a CDN how long it may keep it. */
  expires: number;
}

const cache = new Map<string, CachedForecast>();
const inFlight = new Map<string, Promise<CachedForecast>>();

let fixture: Promise<Forecast> | null = null;
const savedForecast = () => (fixture ??= readFile(FIXTURE, "utf8").then((text) => JSON.parse(text) as Forecast));

function remember(key: string, forecast: Forecast, ttl: number): CachedForecast {
  if (cache.size >= CACHE_MAX) {
    const now = Date.now();
    for (const [k, v] of cache) if (v.expires <= now) cache.delete(k);
    // Still full: drop the oldest entry (Map keeps insertion order).
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
  }
  const entry = { forecast, expires: Date.now() + ttl };
  cache.set(key, entry);
  return entry;
}

async function load(city: string, key: string): Promise<CachedForecast> {
  try {
    return remember(key, await fetchForecast(city), CACHE_MS);
  } catch (err) {
    // FMI down or unknown place: fall back to the saved forecast so the plan still works.
    // The place name is not logged: it can say where a user is moving.
    console.warn(`FMI request failed: ${(err as Error).message}. Using saved forecast.`);
    return remember(key, { ...(await savedForecast()), city }, FAILURE_CACHE_MS);
  }
}

/** The forecast for an already validated city name, from the cache when it is fresh. */
export function getForecast(city: string): Promise<CachedForecast> {
  const key = city.toLowerCase();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit);

  let pending = inFlight.get(key);
  if (!pending) {
    pending = load(city, key).finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
  }
  return pending;
}
