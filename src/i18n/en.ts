// English texts. This file is the source of truth: fi.ts and sv.ts must have the same shape
// (the Messages type below enforces it), so a missing translation is a compile error.
//
// Rules for translators:
// - Values that are functions get ready-formatted strings (dates, numbers, city names).
//   Don't inflect them; Finnish and Swedish texts are phrased so the value can stand as is.
// - Keep facts and figures exactly as in English; each one has a source on the card.

export const en = {
  htmlTitle: "MuutoKaveri – plan your move",
  metaDescription:
    "A moving companion that turns your move date into a personal plan for the move and your first 30 days.",

  shell: {
    skip: "Skip to content",
    tagline: "Your moving companion",
    language: "Language",
    mainNav: "Tools",
    menu: "Menu",
    tour: "Tour",
    insurance: "Update insurance",
    navLocked: "Build your plan first",
  },

  steps: {
    label: "Progress",
    of: (n: number, total: number) => `Step ${n} of ${total}`,
    names: ["Your move", "Your plan", "Ready"],
    done: "completed",
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
    badgeValue: "2 min",
    badgeLabel: "to your moving plan",
    visualPoints: ["Leak, frost and insurance checks", "A date for every task", "Works offline on moving day"],
    whyEyebrow: "Why MuutoKaveri",
    whyTitle: "Everything for the move in one plan",
    faqTitle: "Common questions",
    faq: [
      {
        q: "Is MuutoKaveri free, and do I need an account?",
        a: "It's free and there is no account. Answer six questions and your plan is ready.",
      },
      {
        q: "What happens to my answers?",
        a: "They stay in this browser tab. Only the city name goes to our server for the weather forecast. If you turn on “Save on this device”, the plan is kept on your device until you turn it off.",
      },
      {
        q: "Does the plan replace my insurance terms?",
        a: "No. The plan gives general advice. Your own policy decides what is covered, so the plan tells you what to check and links to your insurer's move notice.",
      },
      {
        q: "Can I use it on my phone on moving day?",
        a: "Yes. Turn on “Save on this device” and the plan opens even before the new home has internet. You can also print it or add the tasks to your calendar.",
      },
    ],
  },

  tour: {
    bannerTitle: "New to MuutoKaveri?",
    bannerBody: "Take a one-minute tour of the tools, from your answers to a finished plan.",
    bannerStart: "Start the tour",
    bannerDismiss: "No thanks",
    label: "Guided tour",
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    back: "Back",
    next: "Next",
    skip: "Skip tour",
    finish: "Finish",
    buildPlan: "Build the plan",
    openSummary: "Open the summary",
    steps: {
      welcome: {
        title: "Welcome to MuutoKaveri",
        body: "This tour shows each tool, from your answers to the finished plan. It takes about a minute. Press Esc to leave at any time.",
      },
      language: {
        title: "Choose your language",
        body: "Switch between English, Finnish and Swedish whenever you like. Your answers stay as they are.",
      },
      nav: {
        title: "Move between the tools",
        body: "Your move, your plan and the ready screen. The plan and the summary open once you have built a plan.",
      },
      form: {
        title: "Tell us about the move",
        body: "Six quick answers: the date, the city, the home, its building year, your appliances and your insurance.",
      },
      submit: {
        title: "Build your plan",
        body: "“Build the plan” makes a plan from the answers in the form. You can change them later.",
      },
      progress: {
        title: "Follow your progress",
        body: "See how many tasks are done, how many important ones are still open and how many days are left.",
      },
      forecast: {
        title: "Weather around your move",
        body: "The forecast for the days around the move. Frost, strong wind and heavy rain add a task to the plan.",
      },
      filters: {
        title: "Filter by topic",
        body: "Show only leak risks, insurance, weather, sustainable choices, admin or safety.",
      },
      card: {
        title: "Tick off tasks",
        body: "Each task has a date. Tick it when it's done. Important tasks have a violet edge, and links lead to the service and to the source of each fact.",
      },
      tools: {
        title: "Calendar and print",
        body: "Add the open tasks to your phone calendar, or print the plan as a checklist for moving day.",
      },
      remember: {
        title: "Save on this device",
        body: "Off by default. Turn it on to keep your plan and use it offline on moving day. Turning it off deletes everything.",
      },
      next: {
        title: "On to the summary",
        body: "When the plan looks right, the summary shows what is still open and the last steps.",
      },
      open: {
        title: "What's still open",
        body: "The important tasks you haven't ticked yet, so nothing big is forgotten.",
      },
      cta: {
        title: "Update your home insurance",
        body: "One link to your insurer's move notice, so the new home is covered from the first night.",
      },
      notes: {
        title: "Your home's key facts",
        body: "Write down where the water shut-off and the fuse box are, the maintenance number and the meter readings.",
      },
      emergency: {
        title: "If water leaks",
        body: "Four steps to follow straight away. They are on the printout too.",
      },
      done: {
        title: "You're ready",
        body: "That's every tool. You can take the tour again from the Tour button at the top of the page.",
      },
    },
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
    filterShown: (n: number) => (n === 1 ? "Showing 1 task" : `Showing ${n} tasks`),
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
      "MuutoKaveri has no accounts, cookies, analytics or tracking. By default your answers stay in this browser tab and disappear when you close it. Only the city name is sent to our server. The server passes it to the Finnish Meteorological Institute to get the forecast and keeps that city's forecast in memory for 30 minutes. The name is not logged or linked to you.",
    privacySaved:
      "If you turn on “Save on this device”, your answers, ticks and notes are kept in this browser's local storage and the app is cached for offline use. Nothing is sent anywhere. Turning it off deletes all of it.",
    accessibilityTitle: "Accessibility",
    accessibility:
      "MuutoKaveri is built to meet WCAG 2.1 level AA: it works with a keyboard and screen readers, colours meet contrast requirements, and it follows your light or dark mode setting. Found a problem? Open an issue in the project repository.",
    sourcesTitle: "Sources",
    sourceItems: [
      { topic: "Movers' insurance knowledge", label: "If survey, MTV Uutiset", href: "https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448" },
      { topic: "Leak claims in Finland, 2021", label: "Finanssiala via STT", href: "https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin" },
      { topic: "Leak causes and building age", label: "Pohjola, Verkkouutiset 2021", href: "https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/" },
      { topic: "Appliance age and average leak cost", label: "Pohjola, Verkkouutiset 2024", href: "https://www.verkkouutiset.fi/a/yleinen-kodinkone-voi-aiheuttaa-jopa-100000-euron-vahingot/" },
      { topic: "Heating energy and room temperature", label: "Motiva", href: "https://www.motiva.fi/tietopankki/kodin-energiatehokas-sahkolammitys/" },
      { topic: "Smoke alarms", label: "Ministry of the Interior decree 300/2025, Finlex", href: "https://www.finlex.fi/fi/lainsaadanto/2025/300" },
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
    smokeAlarm: "Decree on smoke alarms 300/2025 (Finlex)",
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
      link: "Move notice at Posti",
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
        "Write down the electricity and water meter readings for your first bills. Then close every tap and watch the water meter for a few minutes: if it keeps moving, there may be a hidden leak.",
      apartmentBody:
        "Write down the electricity meter reading for your contract. If the apartment has its own water meter, close every tap and watch it for a few minutes: if it keeps moving, there may be a hidden leak.",
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
      body: "A home needs at least one smoke alarm for every started 60 m² on each floor. Test them in the first week. In a housing company, the company maintains the alarms, so report a faulty alarm or flat battery to it straight away.",
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
      body: "About 21 °C is enough for living rooms and 18–20 °C for bedrooms. Each degree lower saves about 5% of heating energy. Don't close the ventilation vents: that causes damp and mould.",
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
