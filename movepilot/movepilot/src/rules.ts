import type { Card, Forecast, ForecastDay, MoveInput, Phase } from "./types";
import { en, type Messages } from "./i18n/en";
import { addDays, daysBetween, formatDate, formatNumber, monthOf } from "./util";

// Links used by the cards.
export const IF_MOVE_NOTICE =
  "https://www.if.fi/henkiloasiakkaat/vakuutukset/kotivakuutus/muuttaminen/muuttoilmoitus";
const OFFICIAL_MOVE_NOTICE = "https://www.muuttoilmoitus.fi/";
const RECYCLING_FINDER = "https://www.kierratys.info/";

// Finnish research behind the card texts. Shown on each card so users and judges can check them.
export const SOURCE_LINKS = {
  ifSurvey: "https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448",
  leakClaims2021: "https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin",
  leakCauses: "https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/",
  applianceAge: "https://www.verkkouutiset.fi/a/yleinen-kodinkone-voi-aiheuttaa-jopa-100000-euron-vahingot/",
  fmi: "https://en.ilmatieteenlaitos.fi/open-data",
  motiva: "https://www.motiva.fi/",
} as const;

// Thresholds for weather cards.
const FROST_C = 0;
const STRONG_WIND_MS = 15;
const HEAVY_RAIN_MM = 10;
// Weather matters from the day before the move (loading the van) to a week after (empty rooms, boxes outside).
const WEATHER_FROM = -1;
const WEATHER_TO = 7;
export const OLD_BUILDING_YEAR = 1989; // ~70% of leaks happen in houses from the 1980s or earlier
const APPLIANCE_CHECK_YEARS = 4; // leak risk rises from about year 4
export const APPLIANCE_OLD_YEARS = 7;

/**
 * Turns the user's answers and the forecast into plan cards. Pure function: easy to test.
 * Card ids don't depend on the language, so ticks survive a language switch.
 */
export function buildPlan(
  input: MoveInput,
  forecast: Forecast | null,
  m: Messages = en,
  locale = "en-GB",
): Card[] {
  const c = m.cards;
  const src = (key: keyof typeof SOURCE_LINKS) => ({ label: m.sources[key], href: SOURCE_LINKS[key] });
  const due = (offset: number) => addDays(input.moveDate, offset);
  const isHouse = input.homeType === "house";
  const oldBuilding = input.buildingYear <= OLD_BUILDING_YEAR;
  const cards: Card[] = [];

  // ---------- Before the move ----------
  cards.push({
    id: "declutter",
    phase: "before",
    priority: "normal",
    tag: "green",
    due: due(-21),
    title: c.declutter.title,
    body: c.declutter.body,
    link: { label: c.declutter.link, href: RECYCLING_FINDER },
  });

  cards.push({
    id: "cover-check",
    phase: "before",
    priority: input.knowsCover === "yes" ? "normal" : "high",
    tag: "insurance",
    due: due(-14),
    source: src("ifSurvey"),
    title: c.coverCheck.title,
    body: input.knowsCover === "yes" ? c.coverCheck.known : c.coverCheck.unknown,
  });

  cards.push({
    id: "boxes",
    phase: "before",
    priority: "normal",
    tag: "green",
    due: due(-14),
    title: c.boxes.title,
    body: c.boxes.body,
  });

  cards.push({
    id: "internet",
    phase: "before",
    priority: "normal",
    tag: "admin",
    due: due(-14),
    title: c.internet.title,
    body: c.internet.body,
  });

  cards.push({
    id: "official-notice",
    phase: "before",
    priority: "normal",
    tag: "admin",
    due: due(-7),
    title: c.officialNotice.title,
    body: c.officialNotice.body,
    link: { label: c.officialNotice.link, href: OFFICIAL_MOVE_NOTICE },
  });

  cards.push({
    id: "insurer-notice",
    phase: "before",
    priority: "normal",
    tag: "insurance",
    due: due(-7),
    title: c.insurerNotice.title,
    body: c.insurerNotice.body,
    link: { label: c.insurerNotice.link, href: IF_MOVE_NOTICE },
  });

  cards.push({
    id: "electricity",
    phase: "before",
    priority: "normal",
    tag: "admin",
    due: due(-7),
    title: c.electricity.title,
    body: c.electricity.body,
  });

  const appliances = [
    { key: "washing-machine", age: input.washerAge, old: c.washerOld, check: c.washerCheck },
    { key: "dishwasher", age: input.dishwasherAge, old: c.dishwasherOld, check: c.dishwasherCheck },
  ];
  for (const a of appliances) {
    if (a.age === null) continue;
    if (a.age >= APPLIANCE_OLD_YEARS) {
      cards.push({
        id: `appliance-old-${a.key}`,
        phase: "before",
        priority: "high",
        tag: "leak",
        due: due(-1),
        source: src("applianceAge"),
        title: a.old.title(a.age),
        body: c.applianceOldBody,
      });
    } else if (a.age >= APPLIANCE_CHECK_YEARS) {
      cards.push({
        id: `appliance-check-${a.key}`,
        phase: "before",
        priority: "normal",
        tag: "leak",
        due: due(-1),
        source: src("applianceAge"),
        title: a.check.title(a.age),
        body: c.applianceCheckBody,
      });
    }
  }

  // ---------- Moving day ----------
  cards.push({
    id: "water-valve",
    phase: "moving-day",
    priority: oldBuilding ? "high" : "normal",
    tag: "leak",
    due: due(0),
    source: oldBuilding ? src("leakCauses") : undefined,
    title: isHouse ? c.waterValve.houseTitle : c.waterValve.apartmentTitle,
    body: isHouse ? c.waterValve.houseBody(oldBuilding ? input.buildingYear : null) : c.waterValve.apartmentBody,
  });

  cards.push({
    id: "meters",
    phase: "moving-day",
    priority: "normal",
    tag: "leak",
    due: due(0),
    title: c.meters.title,
    body: isHouse ? c.meters.houseBody : c.meters.apartmentBody,
  });

  cards.push({
    id: "reconnect-test",
    phase: "moving-day",
    priority: "normal",
    tag: "leak",
    due: due(0),
    source: src("leakCauses"),
    title: c.reconnect.title,
    body: c.reconnect.body,
  });

  cards.push({
    id: "photos",
    phase: "moving-day",
    priority: "normal",
    tag: "insurance",
    due: due(0),
    title: c.photos.title,
    body: c.photos.body,
  });

  // ---------- First 30 days ----------
  cards.push({
    id: "waste",
    phase: "first-30",
    priority: "normal",
    tag: "green",
    due: due(3),
    title: c.waste.title,
    body: c.waste.body,
    link: { label: c.waste.link, href: RECYCLING_FINDER },
  });

  cards.push({
    id: "smoke-alarm",
    phase: "first-30",
    priority: "normal",
    tag: "safety",
    due: due(7),
    title: c.smokeAlarm.title,
    body: c.smokeAlarm.body,
  });

  cards.push({
    id: "heating",
    phase: "first-30",
    priority: "normal",
    tag: "green",
    due: due(7),
    source: src("motiva"),
    title: c.heating.title,
    body: c.heating.body,
  });

  cards.push({
    id: "leak-sensor",
    phase: "first-30",
    priority: "normal",
    tag: "leak",
    due: due(14),
    source: src("leakClaims2021"),
    title: c.leakSensor.title,
    body: c.leakSensor.body,
  });

  if (oldBuilding) {
    cards.push({
      id: "pipe-history",
      phase: "first-30",
      priority: "normal",
      tag: "leak",
      due: due(30),
      source: src("leakCauses"),
      title: isHouse ? c.pipeHistory.houseTitle : c.pipeHistory.apartmentTitle,
      body: isHouse ? c.pipeHistory.houseBody(input.buildingYear) : c.pipeHistory.apartmentBody(input.buildingYear),
    });
  }

  cards.push(...weatherCards(input, forecast, m, locale));

  return cards;
}

/** Forecast days that matter for this move: from the day before to a week after. */
export function moveWindow(input: MoveInput, forecast: Forecast | null): ForecastDay[] {
  return (forecast?.days ?? []).filter((d) => {
    const offset = daysBetween(input.moveDate, d.date);
    return offset >= WEATHER_FROM && offset <= WEATHER_TO;
  });
}

export const isFrost = (d: ForecastDay) => d.minTemp !== null && d.minTemp <= FROST_C;
export const isStrongWind = (d: ForecastDay) => d.maxWind !== null && d.maxWind >= STRONG_WIND_MS;
export const isHeavyRain = (d: ForecastDay) => d.rainMm !== null && d.rainMm >= HEAVY_RAIN_MM;

function weatherCards(input: MoveInput, forecast: Forecast | null, m: Messages, locale: string): Card[] {
  const c = m.cards;
  const cards: Card[] = [];
  const isHouse = input.homeType === "house";
  const days = moveWindow(input, forecast);
  const num = (n: number | null) => formatNumber(n ?? 0, locale);
  const date = (d: ForecastDay) => formatDate(d.date, locale);
  const note =
    forecast?.source === "fmi" ? c.weatherFmi : forecast?.source === "saved" ? c.weatherSaved : c.weatherSample;

  const card = (kind: string, day: ForecastDay, title: string, body: string): Card => ({
    id: `weather-${kind}`,
    phase: phaseOf(input.moveDate, day.date),
    priority: "high",
    tag: "weather",
    due: day.date,
    source: { label: m.sources.fmi, href: SOURCE_LINKS.fmi },
    title,
    body: `${body} ${note}`,
  });

  const frost = days.find(isFrost);
  const wind = days.find(isStrongWind);
  const rain = days.find(isHeavyRain);

  if (frost) {
    cards.push(card("frost", frost, c.frost.title(input.city, date(frost), num(frost.minTemp)),
      isHouse ? c.frost.house : c.frost.apartment));
  }
  if (wind) {
    cards.push(card("wind", wind, c.wind.title(date(wind), num(wind.maxWind)), c.wind.body));
  }
  if (rain) {
    cards.push(card("rain", rain, c.rain.title(date(rain), num(rain.rainMm)),
      isHouse ? c.rain.house : c.rain.apartment));
  }

  // No forecast for the move yet (it's further away than the forecast reaches, or FMI is down).
  if (days.length === 0) {
    cards.push({
      id: "weather-check",
      phase: "before",
      priority: "normal",
      tag: "weather",
      due: addDays(input.moveDate, -2),
      title: c.forecastCheck.title,
      body: c.forecastCheck.body,
    });
  }

  if (!frost && isWinterMove(input.moveDate)) {
    cards.push({
      id: "weather-season",
      phase: "first-30",
      priority: "normal",
      tag: "weather",
      due: addDays(input.moveDate, 7),
      title: c.season.title,
      body: isHouse ? c.season.house : c.season.apartment,
    });
  }

  return cards;
}

function phaseOf(moveDate: string, date: string): Phase {
  const offset = daysBetween(moveDate, date);
  return offset < 0 ? "before" : offset === 0 ? "moving-day" : "first-30";
}

function isWinterMove(moveDate: string): boolean {
  const month = monthOf(moveDate);
  return month >= 10 || month <= 3;
}

/** Why the leak sensor offer is shown. Empty means the home has no raised risk, so no offer. */
export function leakRiskReasons(input: MoveInput, m: Messages = en): string[] {
  const s = m.summary;
  const reasons: string[] = [];
  if (input.buildingYear <= OLD_BUILDING_YEAR) reasons.push(s.offerBuilding(input.buildingYear));
  if (input.washerAge !== null && input.washerAge >= APPLIANCE_OLD_YEARS) reasons.push(s.offerWasher(input.washerAge));
  if (input.dishwasherAge !== null && input.dishwasherAge >= APPLIANCE_OLD_YEARS)
    reasons.push(s.offerDishwasher(input.dishwasherAge));
  return reasons;
}
