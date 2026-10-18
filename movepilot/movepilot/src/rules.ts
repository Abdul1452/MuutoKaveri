import type { Card, Forecast, ForecastDay, MoveInput } from "./types";

// Links used by the cards.
const IF_MOVE_NOTICE =
  "https://www.if.fi/henkiloasiakkaat/vakuutukset/kotivakuutus/muuttaminen/muuttoilmoitus";
const OFFICIAL_MOVE_NOTICE = "https://www.muuttoilmoitus.fi/";

// Finnish research behind the card texts. Shown on each card so users and judges can check them.
export const SOURCES = {
  ifSurvey: {
    label: "If survey (MTV Uutiset)",
    href: "https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448",
  },
  leakClaims2021: {
    label: "Finanssiala 2021 leak statistics (STT)",
    href: "https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin",
  },
  leakCauses: {
    label: "Pohjola leak data (Verkkouutiset 2021)",
    href: "https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/",
  },
  applianceAge: {
    label: "Pohjola appliance data (Verkkouutiset 2024)",
    href: "https://www.verkkouutiset.fi/a/yleinen-kodinkone-voi-aiheuttaa-jopa-100000-euron-vahingot/",
  },
  fmi: {
    label: "Finnish Meteorological Institute, CC BY 4.0",
    href: "https://en.ilmatieteenlaitos.fi/open-data",
  },
} as const;

// Thresholds for weather cards.
const FROST_C = 0;
const STRONG_WIND_MS = 15;
const HEAVY_RAIN_MM = 10;
const OLD_BUILDING_YEAR = 1989; // ~70% of leaks happen in houses from the 1980s or earlier
const APPLIANCE_CHECK_YEARS = 4; // leak risk rises from about year 4
const APPLIANCE_OLD_YEARS = 7;

const weekday = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long" });

/** Turns the user's answers and the forecast into plan cards. Pure function: easy to test. */
export function buildPlan(input: MoveInput, forecast: Forecast | null): Card[] {
  const cards: Card[] = [];
  const isHouse = input.homeType === "house";
  const oldBuilding = input.buildingYear <= OLD_BUILDING_YEAR;

  // ---------- Before the move ----------
  cards.push({
    id: "cover-check",
    phase: "before",
    priority: input.knowsCover === "yes" ? "normal" : "high",
    tag: "insurance",
    source: SOURCES.ifSurvey,
    title: "Check that your things are covered during the move",
    body:
      input.knowsCover === "yes"
        ? "You know your cover level. Check that it includes breakage while moving, which some policies cover only at a broader level."
        : "In an If survey, 38% of movers thought their belongings were not insured during their last move. Check your policy level before moving day: breakage while moving is covered only at some levels.",
  });

  cards.push({
    id: "official-notice",
    phase: "before",
    priority: "normal",
    tag: "admin",
    title: "File your official move notice",
    body: "One notice updates the Population Register and Posti. You can file it up to a month before the move.",
    link: { label: "muuttoilmoitus.fi", href: OFFICIAL_MOVE_NOTICE },
  });

  cards.push({
    id: "insurer-notice",
    phase: "before",
    priority: "normal",
    tag: "insurance",
    title: "Tell your insurer the new address and move date",
    body: "Your home insurance should cover both homes on moving day. Update the address so the new home is covered from the first night.",
    link: { label: "If move notice", href: IF_MOVE_NOTICE },
  });

  cards.push({
    id: "electricity",
    phase: "before",
    priority: "normal",
    tag: "admin",
    title: "Sign an electricity contract for the new home",
    body: "Without a contract the power can be off when you arrive. Do it at least a week before the move.",
  });

  for (const [name, age] of [
    ["washing machine", input.washerAge],
    ["dishwasher", input.dishwasherAge],
  ] as const) {
    if (age === null) continue;
    if (age >= APPLIANCE_OLD_YEARS) {
      cards.push({
        id: `appliance-old-${name.replaceAll(" ", "-")}`,
        phase: "before",
        priority: "high",
        tag: "leak",
        source: SOURCES.applianceAge,
        title: `Your ${name} is ${age} years old: replace the hoses before you reconnect it`,
        body: "Leak risk from washing machines and dishwashers grows from about year 4. New inlet hoses cost little compared with an average leak claim of about €8,500 in a detached house.",
      });
    } else if (age >= APPLIANCE_CHECK_YEARS) {
      cards.push({
        id: `appliance-check-${name.replaceAll(" ", "-")}`,
        phase: "before",
        priority: "normal",
        tag: "leak",
        source: SOURCES.applianceAge,
        title: `Check the hoses on your ${name} (${age} years old)`,
        body: "Look for cracks and stiff spots in the inlet and drain hoses while the machine is disconnected anyway.",
      });
    }
  }

  // ---------- Moving day ----------
  cards.push({
    id: "water-valve",
    phase: "moving-day",
    priority: oldBuilding ? "high" : "normal",
    tag: "leak",
    source: oldBuilding ? SOURCES.leakCauses : undefined,
    title: isHouse
      ? "Find the main water shut-off valve"
      : "Find the water shut-off for your apartment",
    body: isHouse
      ? `In a leak, every minute counts. ${oldBuilding ? `Your house is from ${input.buildingYear}: almost 70% of leaks happen in houses built in the 1980s or earlier. ` : ""}Find the valve before you unpack and make sure everyone in the home knows where it is.`
      : "Many apartments have their own valve under the kitchen sink or in the bathroom. If you cannot find one, ask the housing company who to call in a leak.",
  });

  cards.push({
    id: "reconnect-test",
    phase: "moving-day",
    priority: "normal",
    tag: "leak",
    source: SOURCES.leakCauses,
    title: "Reconnect appliances and watch the first run",
    body: "About 60% of leaks start in water pipes and appliances. Stay nearby during the first wash and dishwasher cycle and check the connections for drips.",
  });

  cards.push({
    id: "photos",
    phase: "moving-day",
    priority: "normal",
    tag: "insurance",
    title: "Photograph your things and the new home's condition",
    body: "Photos taken on arrival make any claim for moving damage faster and show the condition of the home when you got the keys.",
  });

  // ---------- First 30 days ----------
  cards.push({
    id: "smoke-alarm",
    phase: "first-30",
    priority: "normal",
    tag: "safety",
    title: "Test the smoke alarms",
    body: "Every floor of a home needs a working smoke alarm. Test it in the first week and write down when the battery was changed.",
  });

  if (oldBuilding) {
    cards.push({
      id: "pipe-history",
      phase: "first-30",
      priority: "normal",
      tag: "leak",
      source: SOURCES.leakCauses,
      title: isHouse
        ? "Find out when the pipes were last renewed"
        : "Ask the housing company about the pipe renovation plan",
      body: isHouse
        ? `Your house is from ${input.buildingYear}. Check the seller's documents or the maintenance book for the last pipe renovation, and plan one if there has been none.`
        : `The building is from ${input.buildingYear}. Ask when the pipe renovation (putkiremontti) is planned so you know what to expect.`,
    });
  }

  cards.push({
    id: "leak-sensor",
    phase: "first-30",
    priority: "normal",
    tag: "leak",
    source: SOURCES.leakClaims2021,
    title: "Put a leak sensor under the dishwasher and the sink",
    body: "Leaks were the most common home insurance claim in Finland in 2021: 34,800 claims costing €171 million. A sensor that alarms on the first drops lets you shut the water off before the damage spreads.",
  });

  cards.push(...weatherCards(input, forecast));

  return cards;
}

function weatherCards(input: MoveInput, forecast: Forecast | null): Card[] {
  const cards: Card[] = [];
  const isHouse = input.homeType === "house";
  const days = forecast?.days ?? [];
  const sourceNote =
    forecast?.source === "fmi"
      ? "Forecast: Finnish Meteorological Institute."
      : forecast?.source === "saved"
        ? "Saved FMI forecast (live data unavailable)."
        : "Sample forecast (live data unavailable).";

  const frost = days.find((d) => d.minTemp !== null && d.minTemp <= FROST_C);
  const wind = days.find((d) => d.maxWind !== null && d.maxWind >= STRONG_WIND_MS);
  const rain = days.find((d) => d.rainMm !== null && d.rainMm >= HEAVY_RAIN_MM);

  if (frost) {
    cards.push(weatherCard("frost", frost, sourceNote,
      `Frost in ${input.city} on ${weekday(frost.date)} (${frost.minTemp} °C)`,
      isHouse
        ? "Keep the cellar, crawl space and any empty rooms heated, and drain the outdoor tap and garden hose. Frozen pipes burst when they thaw."
        : "Keep the heating on in all rooms, even the ones still full of boxes, and close windows left open while moving."));
  } else if (isWinterMove(input.moveDate)) {
    cards.push({
      id: "weather-season",
      phase: "first-30",
      priority: "normal",
      tag: "weather",
      title: "First winter in the new home",
      body: isHouse
        ? "Before the first frost, find out how the cellar and crawl space are heated and drain the outdoor taps."
        : "Check that radiators work in every room before the first frost.",
    });
  }

  if (wind) {
    cards.push(weatherCard("wind", wind, sourceNote,
      `Strong wind on ${weekday(wind.date)} (up to ${wind.maxWind} m/s)`,
      "Secure garden furniture, trampolines and anything left outside after the move, and close the moving boxes stored on a balcony."));
  }

  if (rain) {
    cards.push(weatherCard("rain", rain, sourceNote,
      `Heavy rain on ${weekday(rain.date)} (${rain.rainMm} mm)`,
      isHouse
        ? "Check that gutters and downpipes are clear and that water drains away from the foundation."
        : "Keep boxes off the floor of storage rooms and close balcony glazing."));
  }

  return cards;
}

function weatherCard(
  kind: string,
  day: ForecastDay,
  sourceNote: string,
  title: string,
  body: string,
): Card {
  return {
    id: `weather-${kind}-${day.date}`,
    phase: "first-30",
    priority: "high",
    tag: "weather",
    source: SOURCES.fmi,
    title,
    body: `${body} ${sourceNote}`,
  };
}

function isWinterMove(moveDate: string): boolean {
  const month = new Date(moveDate).getMonth() + 1;
  return month >= 10 || month <= 3;
}
