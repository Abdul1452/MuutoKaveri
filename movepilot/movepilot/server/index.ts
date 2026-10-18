import express from "express";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fetchForecast } from "./fmi.ts";
import type { Forecast } from "../src/types.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(here, "fixtures", "forecast-turku.json");
const PORT = Number(process.env.PORT ?? 3001);

const app = express();
app.disable("x-powered-by");

// Forecasts change a few times a day, so one FMI call per city per 30 minutes is enough.
// This cuts repeat calls to FMI (Motiva: efficient use of caches; Ympäristö OK Web 3).
const CACHE_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; forecast: Forecast }>();

// Letters (incl. å, ä, ö), spaces and hyphens only; FMI takes a place name.
const CITY_PATTERN = /^[\p{L} -]{2,40}$/u;

app.get("/api/forecast", async (req, res) => {
  const city = String(req.query.city ?? "").trim();
  if (!CITY_PATTERN.test(city)) {
    res.status(400).json({ error: "Give a city name, for example Turku." });
    return;
  }

  const key = city.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    res.json(hit.forecast);
    return;
  }

  try {
    const forecast = await fetchForecast(city);
    cache.set(key, { at: Date.now(), forecast });
    res.json(forecast);
  } catch (err) {
    // FMI down or unknown place: fall back to the saved forecast so the demo keeps working.
    console.warn(`FMI failed for "${city}": ${(err as Error).message}. Using saved forecast.`);
    const saved = JSON.parse(await readFile(FIXTURE, "utf8")) as Forecast;
    res.json({ ...saved, city });
  }
});

// In production, serve the built client from the same server.
if (process.env.NODE_ENV === "production") {
  const dist = path.join(here, "..", "dist");
  // Hashed build assets never change, so browsers can keep them for a year; index.html is always revalidated.
  app.use("/assets", express.static(path.join(dist, "assets"), { immutable: true, maxAge: "365d" }));
  app.use(express.static(dist, { maxAge: 0 }));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
