// Saves a real FMI forecast as the fallback used when FMI is unreachable.
// Run on a machine that can reach FMI:  npm run save-fixture -- Turku
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fetchForecast } from "./fmi.ts";

const city = process.argv[2] ?? "Turku";
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "fixtures", "forecast-turku.json");

const forecast = await fetchForecast(city);
const saved = { ...forecast, source: "saved", savedAt: new Date().toISOString() };
await writeFile(out, JSON.stringify(saved, null, 2) + "\n");
console.log(`Saved ${forecast.days.length} days for ${city} to ${out}`);
