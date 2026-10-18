# MuutoKaveri

*Muuttokaveri* is Finnish for "moving buddy". A moving companion that turns your move date into a personal plan for the move and your first 30 days in the new home, with cover checks and leak-risk tips built in.

Built in 48 hours at JunctionX Turku 2026 for the challenge **If Insurance Could Do More**.

## The problem

Finns move about 7 times in their lives. A move is a long list of small tasks, and insurance is one that many people get wrong: in an If survey, 38% of movers believed their belongings were not insured during their last move, and only 41% knew they were covered ([MTV Uutiset](https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448)).

The new home also comes with risks the new resident does not know about yet: the age of the pipes, how old the dishwasher is, where the main water valve is, and what the weather will do in the first week.

Today If's moving service is the move notice that transfers the home insurance to the new address. Everything else about the move is left to the customer.

## What MuutoKaveri does

1. **Tell us about the move.** The user enters the move date, the new city, the home type (apartment or detached house), the building year, the age of the washing machine and dishwasher, and whether they know their cover level.
2. **Get a plan.** MuutoKaveri builds a timeline in three parts: before the move, moving day, and the first 30 days. Each card is one action with a suggested date, for example:
   - Check whether your things are covered while you move.
   - Your building is from 1985: find the main water shut-off valve on day one.
   - Your dishwasher is 8 years old: check the hoses before you connect it.
   - Frost is forecast for Tuesday: keep the cellar heated. (live weather from FMI)
   - Sell, donate or recycle what you won't take, and rent reusable moving boxes.

   The user ticks cards off, filters them by topic (cover, leak risk, weather, sustainable, admin, safety), adds the open ones to their phone calendar as an `.ics` file, or prints the plan.
3. **Finish in two taps.** A summary of what is still open and a button that opens If's existing move notice, so the insurance is updated in the same flow. The summary also has:
   - a place to write down the new home's key facts on moving day: where the main water shut-off and the fuse box are, the maintenance phone number and the meter readings
   - what to do if water leaks, in four steps
   - the leak sensor offer, shown only when the home has a raised leak risk (old building or old appliances) and the reason why

**First visit: a guided tour.** New users are offered a one-minute tour (or open it any time from **Tour** in the header). It walks through every tool in 17 short steps, from the language picker and the move form, through building the plan, the progress, weather, filters, task cards, calendar, print and saving, to the summary's insurance link, home facts and leak steps. The tour is keyboard and screen-reader friendly: focus moves to each step's heading, Esc leaves it, and on phones it docks to the bottom of the screen.

No login and no customer data. The app works in English, Finnish and Swedish. By default everything the user enters stays in the browser tab. If the user turns on **Save on this device**, the plan, ticks and notes are kept in the browser and the app works offline on moving day, before the new home has internet. Turning it off deletes everything.

## Why it matters for If

- **Retention.** A move is when customers compare insurers. Sampo's target is that at least 89% of about 3.7 million Nordic households renew each year ([Sampo IR](https://www.sampo.com/investors/ir-blog/introducing-sampos-business-areas-private-nordic/)). Helping at the moment of the move protects that number.
- **Fewer claims.** Water leaks are the most common home insurance claim in Finland: 34,800 claims costing €171M in 2021 ([Finanssiala via STT](https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin)). About 60% start in water pipes and appliances, and almost 70% happen in houses built in the 1980s or earlier ([Verkkouutiset](https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/)). The plan flags exactly these.
- **Acquisition.** Young people moving out for the first time are the least insured group. MuutoKaveri works for anyone, customer or not, and ends at If's move notice.

## Design

The layout follows the patterns of large Finnish insurance sites such as If's product pages, so the next step to If's own move notice feels familiar:

- **Navigation:** a two-tier header. A utility bar with the tour, the language and a filled "Update insurance" link, above a main bar with the logo and the three tools (Your move, Your plan, Ready). The utility bar scrolls away and the main bar stays at the top. On phones it becomes one 64 px bar with icon-and-label buttons (language, tour, menu) and a menu panel.
- **Boxes:** a 1160 px content column, cards with 12 px corners, a hairline border and no shadow, 48 px buttons and inputs with 6 px corners, and full-width bands in alternating tones with 64 px of space.
- **Information:** a plain heading and lead, one split box (the form next to a violet panel with the key promise), then bands for the reasons and the common questions. A breadcrumb-style trail shows where you are in the three steps.
- **Type:** regular-weight headings (42/52, 32/40, 24/32), 17/24 body text and 19/28 leads. If's typeface (If Sans) is proprietary, so MuutoKaveri uses **Source Sans 3**, an open-licence humanist sans with a similar feel, self-hosted with only the Latin subset (about 29 kB).

Colours stay MuutoKaveri's own: Signal violet `#7A35FF` on mist gray `#F0F2F5`.

## How it works

```
Browser (Vite + TypeScript)                 Server (Node + Express)
┌──────────────────────────────┐            ┌──────────────────────────────┐
│ 1. Move form                 │            │ GET /api/forecast?city=turku │
│ 2. Plan timeline             │──fetch────▶│  calls FMI open data (XML)   │
│ 3. Summary + move notice     │◀──JSON─────│  returns frost/wind/rain     │
│                              │            │  days as JSON                │
│ rules.ts: inputs → cards     │            │  falls back to a saved       │
└──────────────────────────────┘            │  forecast if FMI fails       │
                                            └──────────────────────────────┘
```

The plan comes from a small set of readable rules in `src/rules.ts`. Each rule has a condition on the user's input or the forecast, a timeline phase and a card text. There is no AI and no database; the rules are easy to check and easy for If to change.

The server exists for one reason: FMI returns XML, and a server-side call avoids browser CORS problems. It parses the forecast with `fast-xml-parser` and returns a short JSON summary.

## Data sources

| Source | Used for | Licence |
|---|---|---|
| [FMI open data](https://en.ilmatieteenlaitos.fi/open-data) (HARMONIE point forecast) | Frost, wind and rain in the first days after the move | CC BY 4.0, attribution: Finnish Meteorological Institute |
| [If home insurance guide](https://www.if.fi/globalassets/fi/pdf/opas/kotivakuutusopas.pdf) | Wording of the cover-check card | If's public document, used as reference only |
| [If move notice](https://www.if.fi/henkiloasiakkaat/vakuutukset/kotivakuutus/muuttaminen/muuttoilmoitus) | The final step links here | Link only |

## Project structure

```
movepilot/
├── README.md
├── package.json
├── index.html
├── src/
│   ├── main.ts          screen flow and state
│   ├── shell.ts         two-tier header and tool navigation, step trail, footer
│   ├── tour.ts          first-time-user guided tour across all tools
│   ├── form.ts          screen 1: move details
│   ├── plan.ts          screen 2: timeline, filters, forecast strip
│   ├── summary.ts       screen 3: open items, move notice, home facts, leak steps
│   ├── rules.ts         inputs + forecast → cards with due dates
│   ├── i18n/            en.ts (source texts), fi.ts, sv.ts; fi and sv load only when chosen
│   ├── ics.ts           calendar export, made in the browser
│   ├── storage.ts       opt-in "Save on this device" and offline support
│   ├── validate.ts      input checks shared by the form, saved data and the server
│   ├── icons.ts         inline SVG icons
│   ├── types.ts         shared types
│   ├── util.ts          HTML escaping and dates
│   └── styles.css       design tokens, light and dark mode, print
├── public/
│   ├── sw.js            service worker, registered only when saving is on
│   ├── manifest.webmanifest
│   └── icon.svg
├── scripts/
│   ├── budget.mjs       page-weight budget (60 kB first visit, font included)
│   └── contrast.mjs     WCAG contrast check for every colour pair
├── test/                unit tests (node:test)
└── server/
    ├── index.ts         Express app, /api/forecast
    ├── fmi.ts           FMI request and XML parsing
    ├── save-fixture.ts  saves a real FMI forecast as the fallback
    └── fixtures/
        └── forecast-turku.json   forecast used if FMI is down
```

## Run it locally

Requires Node 20 or newer.

```bash
npm install
npm run dev        # starts the Vite client and the API server together
```

Open http://localhost:5173.

To refresh the fallback forecast with real FMI data (the plan then says "saved forecast" instead of "sample"):

```bash
npm run save-fixture -- Turku
```

To run as one server, for example on a hosting service:

```bash
npm run build
npm start          # serves the app and the API on port 3001
```

Before you commit, run all the checks: type check, unit tests, colour contrast, build and the page-weight budget.

```bash
npm run check
```

## Sustainability, privacy and accessibility

The full assessment, including the legal check, is in [docs/SUSTAINABILITY.md](docs/SUSTAINABILITY.md). In short:

- The first visit transfers about 58 kB compressed: 30 kB of code and styles and a 28 kB font, plus a forecast response under 1 kB. The Finnish or Swedish texts add about 8 kB, and only for people who choose that language. The median web page in 2024 was 2.3 MB on mobile ([HTTP Archive](https://almanac.httparchive.org/en/2024/page-weight)), so a visit is about 2.5% of that. There is no tracking, no photos (the hero art is a small inline drawing), no third-party requests and no AI. The font is self-hosted and only its Latin subset loads. `npm run budget` fails the build if the first visit goes over 60 kB.
- The server caches each city's forecast for 30 minutes, so repeat visits don't call FMI again.
- Privacy by design (GDPR Art. 5 and 25): no accounts or cookies. Only the city name leaves the browser, and the server does not log it. Nothing is stored on the device unless the user turns on **Save on this device**; turning it off deletes the saved plan and the offline cache, and the service worker stops writing at once.
- Accessibility: built for WCAG 2.1 AA, the level required by the European Accessibility Act and Finland's Act on the Provision of Digital Services. Lighthouse (axe-core) scores 100 for accessibility on the form and plan screens of the production build. Colours are Signal violet (`#7A35FF`) on mist gray (`#F0F2F5`), in light and dark mode; `npm run contrast` checks that every text pair meets 4.5:1 and every control border, progress bar and focus ring meets 3:1. States stay visible in Windows High Contrast mode.
- Every fact on a card links to its Finnish source.

## Limitations

- The rules are simplified examples written during the hackathon. They are not If's underwriting rules or insurance terms.
- Cover depends on the customer's own policy. MuutoKaveri tells the user what to check and where; it does not decide what is covered.
- The weather card uses the forecast for the city centre, not the exact address, and the forecast reaches only two to three days ahead.
- The Finnish and Swedish texts were translated and reviewed with AI help and still need a check by a native speaker before production.
- The server has no per-IP rate limit on `/api/forecast` yet; its cache is bounded and repeat requests share one FMI call, but a production host should add a rate limit.
- The effect on damage and claims has not been measured yet.

## Team

Built at JunctionX Turku, 16–18 October 2026.

- Olamilekan ([@Abdul1452](https://github.com/Abdul1452))

## License

MIT
