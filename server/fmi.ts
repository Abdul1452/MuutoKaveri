import { XMLParser } from "fast-xml-parser";
import type { Forecast, ForecastDay } from "../src/types.ts";

const FMI_URL = "https://opendata.fmi.fi/wfs";
const STORED_QUERY = "fmi::forecast::harmonie::surface::point::simple";
const PARAMS = "temperature,windspeedms,precipitation1h";

interface Row {
  time: string;
  name: string;
  value: number | null;
}

/** Fetches the HARMONIE point forecast for a place name and summarises it per day. */
export async function fetchForecast(city: string): Promise<Forecast> {
  const url = new URL(FMI_URL);
  url.search = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "getFeature",
    storedquery_id: STORED_QUERY,
    place: city,
    parameters: PARAMS,
    timestep: "60",
  }).toString();

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`FMI responded ${res.status}`);
  const xml = await res.text();
  const rows = parseSimpleXml(xml);
  if (rows.length === 0) throw new Error("FMI returned no data for this place");
  return { city, source: "fmi", days: summariseByDay(rows) };
}

/** Parses FMI's "simple" WFS format: one BsWfsElement per time + parameter. */
export function parseSimpleXml(xml: string): Row[] {
  const parser = new XMLParser({ removeNSPrefix: true, ignoreAttributes: true });
  const doc = parser.parse(xml);
  const members = doc?.FeatureCollection?.member;
  if (!members) return [];
  const list = Array.isArray(members) ? members : [members];

  return list
    .map((m: any) => m?.BsWfsElement)
    .filter(Boolean)
    .map((el: any) => {
      const value = Number(el.ParameterValue);
      return {
        time: String(el.Time),
        name: String(el.ParameterName).toLowerCase(),
        value: Number.isFinite(value) ? value : null,
      };
    });
}

const helsinkiDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Helsinki",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function summariseByDay(rows: Row[]): ForecastDay[] {
  const days = new Map<string, ForecastDay>();

  for (const row of rows) {
    if (row.value === null) continue;
    const date = helsinkiDate.format(new Date(row.time));
    const day = days.get(date) ?? { date, minTemp: null, maxWind: null, rainMm: null };

    if (row.name === "temperature") {
      day.minTemp = day.minTemp === null ? row.value : Math.min(day.minTemp, row.value);
    } else if (row.name === "windspeedms") {
      day.maxWind = day.maxWind === null ? row.value : Math.max(day.maxWind, row.value);
    } else if (row.name === "precipitation1h") {
      day.rainMm = (day.rainMm ?? 0) + row.value;
    }
    days.set(date, day);
  }

  return [...days.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      minTemp: d.minTemp === null ? null : Math.round(d.minTemp * 10) / 10,
      maxWind: d.maxWind === null ? null : Math.round(d.maxWind * 10) / 10,
      rainMm: d.rainMm === null ? null : Math.round(d.rainMm * 10) / 10,
    }));
}
