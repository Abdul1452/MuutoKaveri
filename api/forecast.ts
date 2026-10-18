// Vercel function for GET /api/forecast: the same answer as the Express route in server/index.ts.
import { getForecast } from "../server/forecast.js";
import { CITY_PATTERN } from "../src/validate.js";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request: Request): Promise<Response> {
  const city = (new URL(request.url).searchParams.get("city") ?? "").trim();
  if (!CITY_PATTERN.test(city)) {
    return Response.json({ error: "Give a city name, for example Turku." }, { status: 400, headers: noStore });
  }
  try {
    const { forecast, expires } = await getForecast(city);
    // Vercel's CDN keeps the answer as long as the server cache would (30 min, or 5 min for the saved
    // fallback), so repeat requests for a city don't start the function or call FMI at all.
    const seconds = Math.max(0, Math.floor((expires - Date.now()) / 1000));
    return Response.json(forecast, { headers: { "Cache-Control": `public, max-age=0, s-maxage=${seconds}` } });
  } catch {
    return Response.json({ error: "Forecast unavailable." }, { status: 503, headers: noStore });
  }
}
