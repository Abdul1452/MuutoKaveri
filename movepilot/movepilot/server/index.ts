import express from "express";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fetchForecast } from "./fmi.ts";
import type { Forecast } from "../src/types.ts";
import { CITY_PATTERN } from "../src/validate.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(here, "fixtures", "forecast-turku.json");
const PORT = Number(process.env.PORT ?? 3001);

const app = express();
app.disable("x-powered-by");

// The app loads nothing from other origins and has no inline scripts or styles, so the policy can be strict.
app.use((_req, res, next) => {
  res.set({
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; " +
      "font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; " +
      "manifest-src 'self'; worker-src 'self'",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cross-Origin-Opener-Policy": "same-origin",
  });
  next();
});

// Forecasts change a few times a day, so one FMI call per city per 30 minutes is enough.
// This cuts repeat calls to FMI (Motiva: efficient use of caches; Ympäristö OK Web 3).
// The cache is bounded, failures are cached briefly, and requests for the same city share one FMI call,
// so a flood of made-up place names can't grow memory without limit or hammer FMI.
const CACHE_MS = 30 * 60 * 1000;
const FAILURE_CACHE_MS = 5 * 60 * 1000;
const CACHE_MAX = 500;
const cache = new Map<string, { expires: number; forecast: Forecast }>();
const inFlight = new Map<string, Promise<Forecast>>();

let fixture: Promise<Forecast> | null = null;
const savedForecast = () => (fixture ??= readFile(FIXTURE, "utf8").then((text) => JSON.parse(text) as Forecast));

function remember(key: string, forecast: Forecast, ttl: number): void {
  if (cache.size >= CACHE_MAX) {
    const now = Date.now();
    for (const [k, v] of cache) if (v.expires <= now) cache.delete(k);
    // Still full: drop the oldest entry (Map keeps insertion order).
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
  }
  cache.set(key, { expires: Date.now() + ttl, forecast });
}

async function forecastFor(city: string, key: string): Promise<Forecast> {
  try {
    const forecast = await fetchForecast(city);
    remember(key, forecast, CACHE_MS);
    return forecast;
  } catch (err) {
    // FMI down or unknown place: fall back to the saved forecast so the plan still works.
    // The place name is not logged: it can say where a user is moving.
    console.warn(`FMI request failed: ${(err as Error).message}. Using saved forecast.`);
    const forecast = { ...(await savedForecast()), city };
    remember(key, forecast, FAILURE_CACHE_MS);
    return forecast;
  }
}

app.get("/api/forecast", async (req, res) => {
  const city = String(req.query.city ?? "").trim();
  if (!CITY_PATTERN.test(city)) {
    res.status(400).json({ error: "Give a city name, for example Turku." });
    return;
  }

  const key = city.toLowerCase();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    res.json(hit.forecast);
    return;
  }

  let pending = inFlight.get(key);
  if (!pending) {
    pending = forecastFor(city, key).finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
  }
  try {
    res.json(await pending);
  } catch {
    res.status(503).json({ error: "Forecast unavailable." });
  }
});

// In production, serve the built client from the same server.
// `--production` works on every OS; NODE_ENV=production is kept for hosting services that set it.
if (process.env.NODE_ENV === "production" || process.argv.includes("--production")) {
  const dist = path.join(here, "..", "dist");
  // Hashed build assets never change, so browsers can keep them for a year; index.html is always revalidated.
  app.use("/assets", express.static(path.join(dist, "assets"), { immutable: true, maxAge: "365d" }));
  // index.html, sw.js and the manifest are always revalidated, so updates reach users straight away.
  app.use(express.static(dist, { maxAge: 0 }));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
