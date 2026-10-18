// English texts. This file is the source of truth: fi.ts and sv.ts must have the same shape
// (the Messages type below enforces it), so a missing translation is a compile error.
//
// Rules for translators:
// - Values that are functions get ready-formatted strings (dates, numbers, city names).
//   Don't inflect them; Finnish and Swedish texts are phrased so the value can stand as is.
// - Keep facts and figures exactly as in English; each one has a source on the card.

export const en = {
  htmlTitle: "MovePilot – plan your move",
  metaDescription:
    "A moving companion that turns your move date into a personal plan for the move and your first 30 days.",

  shell: {
    skip: "Skip to content",
    tagline: "Your moving companion",
    language: "Language",
  },

  steps: {
    label: "Progress",
    of: (n: number, total: number) => `Step ${n} of ${total}`,
    names: ["Your move", "Your plan", "Ready"],
  },

  form: {
    eyebrow: "Plan your move",
    title: "Moving soon? Tell us about the new home.",
    lead: "Two minutes of answers give you a personal plan for the move and your first 30 days, with leak, weather and insurance checks built in.",
    sectionMove: "The move",
    moveDate: "Move date",
    city: "New city",
    cityPlaceholder: "e.g. Turku",
    sectionHome: "The new home",
    homeType: "Home type",
    apartment: "Apartment",
    apartmentHint: "Flat or terraced house in a housing company",
    house: "Detached house",
    houseHint: "You look after the building yourself",
    buildingYear: "Year the building was built",
    buildingYearHint: "Older buildings have more pipe leaks.",
    sectionAppliances: "Appliances",
    washerAge: "Washing machine age (years)",
    dishwasherAge: "Dishwasher age (years)",
    ageHint: "Leave empty if you don't have one.",
    agePlaceholder: "none",
    sectionCover: "Insurance",
    knowsCover: "Do you know what your home insurance covers during a move?",
    coverYes: "Yes",
    coverUnsure: "Not sure",
    coverNo: "No",
    submit: "Build my move plan",
    privacy:
      "Nothing you enter leaves this page except the city name, used for the weather forecast. No cookies, no tracking.",
    errorDate: "Pick a move date.",
    errorCity: "Enter the city name, for example Turku.",
    errorYear: "Enter the building year, for example 1985.",
    errorAge: "Enter the appliance age in whole years from 0 to 40, or leave it empty.",
    benefitsTitle: "What you get",
    benefits: [
      { title: "A personal timeline", body: "Before the move, moving day and the first 30 days, with a date for each task." },
      { title: "Leak and frost checks", body: "Based on your building's age, your appliances and the live FMI forecast." },
      { title: "A greener move", body: "Fewer boxes and trips, less waste, lower heating energy in the new home." },
      { title: "Private by design", body: "No account and no tracking. Works in English, Finnish and Swedish." },
    ],
  },

  loading: {
    title: "Building your plan…",
    status: (city: string) => `Checking the weather forecast for ${city}.`,
  },

  phases: {
    before: { title: "Before the move", when: "Now until moving day" },
    movingDay: { title: "Moving day" },
    first30: { title: "First 30 days", when: "In the new home" },
  },

  tags: {
    insurance: "Cover",
    leak: "Leak risk",
    weather: "Weather",
    admin: "Admin",
    safety: "Safety",
    green: "Sustainable",
  },

  plan: {
    eyebrow: "Your plan",
    title: (city: string) => `Your move to ${city}`,
    countdown: (days: number) =>
      days > 1
        ? `${days} days to go`
        : days === 1
          ? "Moving tomorrow"
          : days === 0
            ? "Moving day is today"
            : days === -1
              ? "Moved yesterday"
              : `Moved ${-days} days ago`,
    lead: (total: number, high: number) =>
      `${total} things to do, ${high} of them important for your home.`,
    forecastFmi: "Live weather from the Finnish Meteorological Institute.",
    forecastSaved: "Live weather unavailable, so the plan uses a saved forecast.",
    forecastNone: "Weather forecast unavailable.",
    progressLabel: "Plan progress",
    progress: (done: number, total: number) => `${done} of ${total} done`,
    openImportant: (n: number) =>
      n === 0 ? "All important items done" : n === 1 ? "1 important item open" : `${n} important items open`,
    filterLabel: "Show",
    filterAll: "All",
    calendar: "Add to calendar",
    print: "Print",
    phaseCount: (done: number, total: number) => `${done} of ${total} done`,
    empty: "Nothing here for this filter.",
    important: "Important",
    dueBy: (date: string) => `By ${date}`,
    dueToday: "Today",
    overdue: (date: string) => `Do this now (suggested by ${date})`,
    source: "Source",
    newTab: "(opens in a new tab)",
    back: "Change answers",
    next: "See summary",
    forecastTitle: "Weather around your move",
    forecastLow: "Low",
    forecastWind: "Wind",
    forecastRain: "Rain",
    alertFrost: "Frost",
    alertWind: "Strong wind",
    alertRain: "Heavy rain",
    remember: "Save on this device",
    rememberHint:
      "Keeps your plan, notes and the app itself on this device, so they work offline on moving day. Off by default; turn it off to delete everything.",
    rememberOn: "Saved on this device.",
    rememberOff: "Removed from this device.",
    calendarName: (city: string) => `Move to ${city}`,
    calendarDone: "Calendar file downloaded. Open it to add the open tasks to your calendar.",
  },

  summary: {
    eyebrow: "Ready",
    title: (date: string) => `Ready for ${date}`,
    progress: (done: number, total: number) => `${done} of ${total} done.`,
    openTitle: (n: number) => (n === 1 ? "1 important item is still open" : `${n} important items are still open`),
    allDone: "All the important items are done.",
    ctaTitle: "Update your home insurance in one step",
    ctaBody:
      "The last step is telling your insurer the new address, so the new home is covered from the first night.",
    ctaButton: "Open the If move notice",
    notesTitle: "Your new home's key facts",
    notesLead:
      "Write these down on moving day. In a leak or a power cut you'll find them here or on the printout.",
    notesWaterValve: "Main water shut-off is at",
    notesWaterValvePlaceholder: "e.g. under the kitchen sink",
    notesFuseBox: "Fuse box is at",
    notesFuseBoxPlaceholder: "e.g. hallway cupboard",
    notesMaintenance: "Maintenance or emergency phone",
    notesElectricityMeter: "Electricity meter reading",
    notesWaterMeter: "Water meter reading",
    notesSavedHint: "Your notes are kept on this device.",
    notesUnsavedHint: "Notes disappear when you close the tab, unless you turn on “Save on this device” on the plan.",
    emergencyTitle: "If water leaks",
    emergencySteps: [
      "Shut off the water at the main valve or at the appliance's own tap.",
      "Switch off the power to the area if water reaches sockets or appliances.",
      "Call the housing company's maintenance, or a plumber if you live in a house. Call 112 if anyone is in danger.",
      "Photograph the damage, dry what you can and report it to your insurer as soon as possible.",
    ],
    offerTag: "Offer concept",
    offerTitle: "Leak sensor for the new kitchen",
    offerWhy: "Shown because your home has a higher leak risk:",
    offerBuilding: (year: number) => `Building from ${year}`,
    offerWasher: (age: number) => `Washing machine ${age} years old`,
    offerDishwasher: (age: number) => `Dishwasher ${age} years old`,
    offerBody:
      "A sensor under the dishwasher and sink alarms on the first drops. It is offered only to homes with a higher leak risk, so no device is sold where it isn't needed. Choose one with a replaceable battery, and recycle it as electronics at the end of its life.",
    back: "Back to plan",
    print: "Print",
    restart: "Start over",
    restartConfirm: "Start over? Your answers, ticks and notes will be deleted.",
  },

  footer: {
    summary: "Privacy, accessibility and sources",
    privacyTitle: "Privacy",
    privacy:
      "MovePilot has no accounts, cookies, analytics or tracking. By default your answers stay in this browser tab and disappear when you close it. Only the city name is sent to our server, which uses it to fetch the weather forecast and does not store it.",
    privacySaved:
      "If you turn on “Save on this device”, your answers, ticks and notes are kept in this browser's local storage and the app is cached for offline use. Nothing is sent anywhere. Turning it off deletes all of it.",
    accessibilityTitle: "Accessibility",
    accessibility:
      "MovePilot is built to meet WCAG 2.1 level AA: it works with a keyboard and screen readers, colours meet contrast requirements, and it follows your light or dark mode setting. Found a problem? Open an issue in the project repository.",
    sourcesTitle: "Sources",
    sourceItems: [
      { topic: "Movers' insurance knowledge", label: "If survey, MTV Uutiset", href: "https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448" },
      { topic: "Leak claims in Finland, 2021", label: "Finanssiala via STT", href: "https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin" },
      { topic: "Leak causes and building age", label: "Pohjola, Verkkouutiset 2021", href: "https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/" },
      { topic: "Appliance age and average leak cost", label: "Pohjola, Verkkouutiset 2024", href: "https://www.verkkouutiset.fi/a/yleinen-kodinkone-voi-aiheuttaa-jopa-100000-euron-vahingot/" },
      { topic: "Heating energy and room temperature", label: "Motiva", href: "https://www.motiva.fi/" },
      { topic: "Weather forecast", label: "Finnish Meteorological Institute open data, CC BY 4.0", href: "https://en.ilmatieteenlaitos.fi/open-data" },
    ],
    disclaimer:
      "Built at JunctionX Turku 2026. The plan gives general information, not insurance advice; your own policy terms decide what is covered.",
  },

  sources: {
    ifSurvey: "If survey (MTV Uutiset)",
    leakClaims2021: "Finanssiala 2021 leak statistics (STT)",
    leakCauses: "Pohjola leak data (Verkkouutiset 2021)",
    applianceAge: "Pohjola appliance data (Verkkouutiset 2024)",
    fmi: "Finnish Meteorological Institute, CC BY 4.0",
    motiva: "Motiva",
  },

  cards: {
    coverCheck: {
      title: "Check that your things are covered during the move",
      known:
        "You know your cover level. Check that it includes breakage while moving, which some policies cover only at a broader level.",
      unknown:
        "In an If survey, 38% of movers thought their belongings were not insured during their last move. Check your policy level before moving day: breakage while moving is covered only at some levels.",
    },
    declutter: {
      title: "Sell, donate or recycle what you won't take",
      body: "Every box you don't move saves packing, van space and fuel. Give usable things to a recycling centre or sell them, and take electronics, batteries and old paint to a free collection point.",
      link: "Find a collection point",
    },
    boxes: {
      title: "Rent reusable moving boxes",
      body: "Rented plastic boxes are used again and again, stack safely and are collected after the move. If you use cardboard, get used boxes and recycle them afterwards.",
    },
    officialNotice: {
      title: "File your official move notice",
      body: "One notice updates the Population Register and Posti. You can file it up to a month before the move, and at the latest one week after it.",
      link: "muuttoilmoitus.fi",
    },
    insurerNotice: {
      title: "Tell your insurer the new address and move date",
      body: "Your home insurance should cover both homes on moving day. Update the address so the new home is covered from the first night.",
      link: "If move notice",
    },
    electricity: {
      title: "Sign an electricity contract for the new home",
      body: "Without a contract the power can be off when you arrive. Do it at least a week before the move. Choosing electricity from renewable sources is one of the easiest climate actions at home.",
    },
    internet: {
      title: "Order broadband or move your subscription",
      body: "Check which connections the new address has. A new installation can take a couple of weeks.",
    },
    washerOld: {
      title: (age: number) => `Your washing machine is ${age} years old: replace the hoses before you reconnect it`,
    },
    dishwasherOld: {
      title: (age: number) => `Your dishwasher is ${age} years old: replace the hoses before you reconnect it`,
    },
    applianceOldBody:
      "Leak risk from washing machines and dishwashers grows from about year 4. New inlet hoses cost little compared with an average leak claim of about €8,500 in a detached house.",
    washerCheck: { title: (age: number) => `Check the hoses on your washing machine (${age} years old)` },
    dishwasherCheck: { title: (age: number) => `Check the hoses on your dishwasher (${age} years old)` },
    applianceCheckBody:
      "Look for cracks and stiff spots in the inlet and drain hoses while the machine is disconnected anyway.",
    waterValve: {
      houseTitle: "Find the main water shut-off valve",
      apartmentTitle: "Find the water shut-off for your apartment",
      houseBody: (oldYear: number | null) =>
        `In a leak, every minute counts. ${oldYear ? `Your house is from ${oldYear}: almost 70% of leaks happen in houses built in the 1980s or earlier. ` : ""}Find the valve before you unpack and make sure everyone in the home knows where it is.`,
      apartmentBody:
        "Many apartments have their own valve under the kitchen sink or in the bathroom. If you can't find one, ask the housing company who to call in a leak.",
    },
    meters: {
      title: "Read the meters and check for hidden leaks",
      houseBody:
        "Write down the electricity and water meter readings for your first bills. Then close every tap: if the water meter still moves, there is a hidden leak.",
      apartmentBody:
        "Write down the electricity meter reading for your contract. If the apartment has its own water meter, close every tap and check that it stands still; if it moves, there is a hidden leak.",
    },
    reconnect: {
      title: "Reconnect appliances and watch the first run",
      body: "About 60% of leaks start in water pipes and appliances. Stay nearby during the first wash and dishwasher cycle and check the connections for drips.",
    },
    photos: {
      title: "Photograph your things and the new home's condition",
      body: "Photos taken on arrival make any claim for moving damage faster and show the condition of the home when you got the keys.",
    },
    smokeAlarm: {
      title: "Test the smoke alarms",
      body: "Every floor of a home needs a working smoke alarm. Test it in the first week and write down when the battery was changed.",
    },
    pipeHistory: {
      houseTitle: "Find out when the pipes were last renewed",
      apartmentTitle: "Ask the housing company about the pipe renovation plan",
      houseBody: (year: number) =>
        `Your house is from ${year}. Check the seller's documents or the maintenance book for the last pipe renovation, and plan one if there has been none.`,
      apartmentBody: (year: number) =>
        `The building is from ${year}. Ask when the pipe renovation is planned so you know what to expect.`,
    },
    leakSensor: {
      title: "Put a leak sensor under the dishwasher and the sink",
      body: "Leaks were the most common home insurance claim in Finland in 2021: 34,800 claims costing €171 million. A sensor that alarms on the first drops lets you shut the water off before the damage spreads.",
    },
    heating: {
      title: "Set room temperatures and keep the vents open",
      body: "About 21 °C is enough for living rooms and 18 °C for bedrooms. Each degree lower saves about 5% of heating energy. Don't close the ventilation vents: that causes damp and mould.",
    },
    waste: {
      title: "Learn the waste sorting at the new address",
      body: "Bins differ between housing companies and municipalities. Check which waste types are collected at home and where the nearest recycling point is.",
      link: "Find a recycling point",
    },
    frost: {
      title: (city: string, date: string, temp: string) => `Frost forecast for ${city} on ${date} (${temp} °C)`,
      house:
        "Keep the cellar, crawl space and any empty rooms heated, and drain the outdoor tap and garden hose. Frozen pipes burst when they thaw.",
      apartment:
        "Keep the heating on in all rooms, even the ones still full of boxes, and close windows left open while moving.",
    },
    wind: {
      title: (date: string, speed: string) => `Strong wind on ${date} (up to ${speed} m/s)`,
      body: "Secure garden furniture and anything left outside after the move, and bring in moving boxes stored on a balcony.",
    },
    rain: {
      title: (date: string, mm: string) => `Heavy rain on ${date} (${mm} mm)`,
      house: "Check that gutters and downpipes are clear and that water drains away from the foundation.",
      apartment: "Keep boxes off the floor of storage rooms and close the balcony glazing.",
    },
    season: {
      title: "First winter in the new home",
      house: "Before the first frost, find out how the cellar and crawl space are heated and drain the outdoor taps.",
      apartment: "Check that radiators work in every room before the first frost.",
    },
    forecastCheck: {
      title: "Check the weather forecast two days before",
      body: "Forecasts reach only a few days ahead. Two days before the move, check for rain to protect your boxes, frost to keep the heating on, and strong wind.",
    },
    weatherFmi: "Forecast: Finnish Meteorological Institute.",
    weatherSaved: "Saved FMI forecast (live data unavailable).",
    weatherSample: "Sample forecast (live data unavailable).",
  },
};

export type Messages = typeof en;
