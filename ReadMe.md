# MovePilot

A moving companion that turns your move date into a personal plan for the move and your first 30 days in the new home, with cover checks and leak-risk tips built in.

Built in 48 hours at JunctionX Turku 2026 for the challenge **If Insurance Could Do More**.

## The problem

Finns move about 7 times in their lives. A move is a long list of small tasks, and insurance is one that many people get wrong: in an If survey, 38% of movers believed their belongings were not insured during their last move, and only 41% knew they were covered ([MTV Uutiset](https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448)).

The new home also comes with risks the new resident does not know about yet: the age of the pipes, how old the dishwasher is, where the main water valve is, and what the weather will do in the first week.

Today If's moving service is the move notice that transfers the home insurance to the new address. Everything else about the move is left to the customer.

## What MovePilot does

1. **Tell us about the move.** The user enters the move date, the new city, the home type (apartment or detached house), the building year, the age of the washing machine and dishwasher, and whether they know their cover level.
2. **Get a plan.** MovePilot builds a timeline in three parts: before the move, moving day, and the first 30 days. Each card is one action, for example:
   - Check whether your things are covered while you move.
   - Your building is from 1985: find the main water shut-off valve on day one.
   - Your dishwasher is 8 years old: check the hoses before you connect it.
   - Frost is forecast for Tuesday: keep the cellar heated. (live weather from FMI)
3. **Finish in two taps.** A summary of the plan and a button that opens If's existing move notice, so the insurance is updated in the same flow.

No login and no customer data. Everything the user enters stays in the browser.

## Why it matters for If

- **Retention.** A move is when customers compare insurers. Sampo's target is that at least 89% of about 3.7 million Nordic households renew each year ([Sampo IR](https://www.sampo.com/investors/ir-blog/introducing-sampos-business-areas-private-nordic/)). Helping at the moment of the move protects that number.
- **Fewer claims.** Water leaks are the most common home insurance claim in Finland: 34,800 claims costing €171M in 2021 ([Finanssiala via STT](https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin)). About 60% start in water pipes and appliances, and almost 70% happen in houses built in the 1980s or earlier ([Verkkouutiset](https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/)). The plan flags exactly these.
- **Acquisition.** Young people moving out for the first time are the least insured group. MovePilot works for anyone, customer or not, and ends at If's move notice.

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
│   ├── form.ts          screen 1: move details
│   ├── plan.ts          screen 2: timeline
│   ├── summary.ts       screen 3: summary and move notice link
│   ├── rules.ts         inputs + forecast → cards
│   ├── types.ts         shared types
│   ├── util.ts          HTML escaping and dates
│   └── styles.css
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

## Limitations

- The rules are simplified examples written during the hackathon. They are not If's underwriting rules or insurance terms.
- Cover depends on the customer's own policy. MovePilot tells the user what to check and where; it does not decide what is covered.
- The weather card uses the forecast for the city centre, not the exact address.

## Team

Built at JunctionX Turku, 16–18 October 2026.

- Olamilekan ([@Abdul1452](https://github.com/Abdul1452))

## License

MIT