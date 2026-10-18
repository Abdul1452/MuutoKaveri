import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getForecast } from "./forecast.ts";
import { SECURITY_HEADERS } from "./headers.ts";
import { CITY_PATTERN } from "../src/validate.ts";

// Local development and self-hosting. On Vercel, api/forecast.ts answers the API and vercel.json sets the headers.
const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3001);

const app = express();
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.set(SECURITY_HEADERS);
  next();
});

app.get("/api/forecast", async (req, res) => {
  const city = String(req.query.city ?? "").trim();
  if (!CITY_PATTERN.test(city)) {
    res.status(400).json({ error: "Give a city name, for example Turku." });
    return;
  }
  try {
    res.json((await getForecast(city)).forecast);
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
