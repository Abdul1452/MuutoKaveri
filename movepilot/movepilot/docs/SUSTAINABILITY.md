# Sustainability assessment: MovePilot

## Summary

MovePilot is a small prevention tool with a very light direct footprint. Its main sustainability value is indirect: helping people find leak and frost risks in a new home before they cause damage, since repairs mean new materials, drying equipment and building waste. The prototype already does well on privacy and accessibility by design. Version 0.2 adds Finnish and Swedish, which closes the biggest inclusion gap, though the translations still need a native-speaker check. It still has no measured evidence that it prevents any damage. The leak sensor offer brings hardware, and so e-waste, into an otherwise digital service.

| Dimension | Score (1–5) | Confidence |
|---|---|---|
| Ecological | 3.5 | Medium |
| Social | 3 | Medium |
| Economic | 3.5 | Low |
| Technical | 4 | High |

The top three risks are the unmeasured effect on damage, the exclusion of people who don't read English, and the hardware upsell. The top three actions are a Finnish and Swedish version, an outcome pilot with If, and durability and take-back requirements for any sensor offer.

## 1. Scope, frameworks and assumptions

This assesses the hackathon prototype in this repository and a likely next step, where If offers it to customers who file a move notice. It uses the strong sustainability view from the TUAS course: an economic gain for If does not cancel an ecological or social cost. Software is checked against the Ympäristö OK Web criteria, the Motiva criteria bank and the Green Software Foundation's SCI. The legal check covers EU and Finnish law that applies to a consumer web service in Finland.

The assessment assumes hosting in an EU region and no users yet, and that If, as an insurer, would be the operator in production. This is not legal advice.

## 2. Does the plan work in practice?

The running cost is close to zero: one small Node server, no database and no paid APIs. FMI's open data is free under CC BY 4.0.

The HARMONIE forecast reaches only about two to three days ahead, so the weather cards are useful only for moves in the next few days. For later moves, the app falls back to a seasonal card. The forecast is for the city, not the address.

The business case for prevention rests on the size of leak damage. In 2021 Finnish insurers handled 34,800 leak claims costing €171 million (Finanssiala). The average detached-house leak cost about €8,500 at Pohjola in 2024. By our own estimate, preventing one such leak would pay for the service's hosting for many years. That estimate is not measured, and the effect on claim frequency is unknown until a pilot measures it (see action 2).

## 3. Impacts by dimension

### Ecological

**Direct footprint.** The first visit transfers about 24 kB compressed: 18 kB of JavaScript, 5 kB of CSS and under 1 kB of HTML, plus a forecast response under 1 kB. Finnish and Swedish texts (about 7 kB each) load only for people who choose them. `npm run budget` fails the build above 50 kB. The median web page in 2024 was 2.3 MB on mobile and 2.6 MB on desktop (HTTP Archive). This follows Ympäristö OK Web 2 (lightweight front end) and Web 5 (few browser dependencies): the browser loads no third-party libraries.
- There is no tracking, no media and no fonts to download (Web 1, Web 4).
- The server caches each city's forecast for 30 minutes, so repeat visits don't call FMI again. This follows Motiva's cache criterion and Web 3.
- Build files are cached by the browser for a year.
- There is no AI, so no inference energy.

**Enabling impact.** Most of the ecological value comes from damage that doesn't happen. Pohjola's data shows about 60% of leaks start in water pipes and appliances, and almost 70% happen in houses from the 1980s or earlier. The plan's cards target exactly these. Avoided water damage means fewer replaced floors and walls and less drying equipment running for weeks. This links to SDG target 12.5 (less waste) and to 13.1 (resilience to climate-related hazards) through the frost, storm and rain cards.

**Negative impact.** A leak sensor offer adds electronics with embodied emissions, batteries and e-waste (SDG 12.5 in the other direction). If sensors are sold to everyone rather than to homes with a real risk, the hardware footprint can outweigh the avoided damage. That would be a rebound effect.

### Social

**Privacy.** Nothing the user enters leaves the browser except the city name, which the server does not log. Nothing is stored on the device unless the user turns on "Save on this device", which keeps the plan and notes in local storage and the app in an offline cache; turning it off deletes both (SDG 16.10).

**Accessibility.** Lighthouse (axe-core) scores 100 for accessibility on the form and plan screens of the production build. `npm run contrast` checks every colour pair in light and dark mode, and states stay visible in Windows High Contrast mode. Keyboard focus moves to each new screen's heading and stays on a checkbox after it is ticked (SDG 10.2).

**Exclusion.** The app is now in English, Finnish and Swedish, Finland's two national languages, but the translations still need a native-speaker check. It is still digital-first, although the plan and the home's key facts can now be printed. It still leaves out some people who manage their affairs by phone or with a relative's help. The 2030 Agenda principle "leave no one behind" points at exactly these groups.

**Advice quality.** The plan gives general information and says that the user's own policy decides cover. It doesn't recommend products.

### Economic

For households, the plan helps them avoid the cost and disruption of damage and makes them check their cover before moving. 38% of movers in an If survey thought their things were uninsured during the move. For If, it creates a contact at the moment customers compare insurers and could lower leak claims. The economic case is the least proven dimension, so it gets a Low confidence.

### Technical

The rules sit in one readable file (`src/rules.ts`), each with its source. The code is MIT-licensed TypeScript with two runtime dependencies on the server (Express and fast-xml-parser) and none in the browser. The forecast endpoint is a plain JSON API that another service could reuse (Motiva 654). The app runs on any current browser and needs no app install.

## 4. Legal and regulatory fit

| Law | What it requires | MovePilot today | Gap |
|---|---|---|---|
| GDPR (EU 2016/679) and Data Protection Act 1050/2018 | Data minimisation, storage limitation, data protection by design (Art. 5, 25), and telling people what is processed (Art. 13) | No accounts. Device storage only after opt-in. A privacy notice is in the footer, and the server does not log city names. | Hosting logs keep IP addresses, which are personal data (CJEU C-582/14). Set short log retention and mention it in the notice. |
| Act on Electronic Communications Services 917/2014, section 205 (cookies) | Consent before storing or reading data on the user's device, unless strictly necessary | No cookies. Local storage and the offline cache are used only after the user turns on "Save on this device", and turning it off deletes them, so no consent banner is needed | None |
| European Accessibility Act (2019/882) and Act on the Provision of Digital Services 306/2019 | EN 301 549, in practice WCAG 2.1 A and AA. If's own accessibility statement says the Act covers its statutory insurance tasks and, since 28 June 2025, consumer e-commerce. | No automated WCAG 2.1 AA violations. Keyboard and screen-reader support built in. | Manual testing with a screen reader and an accessibility statement before production |
| Insurance Distribution Directive (2016/97) and Act on Insurance Distribution 234/2018 | Rules for advising on or proposing insurance contracts | General checklist only, with no product comparison or recommendation | If If runs it, If's compliance should review the cover-check wording and the link to the move notice |
| Consumer Protection Act 38/1978, chapter 2 | Marketing must be recognisable as marketing and show who is behind it | The sensor offer is labelled "Offer concept" | In production, label it as If's offer |
| EU AI Act (2024/1689) | Duties for AI systems | Not applicable, because MovePilot uses no AI | None |
| FMI licence, CC BY 4.0 | Attribution | Credited on weather cards and in the footer | None |

## 5. Critical challenges, root causes and interdependencies

**The effect is unmeasured.** There is no outcome data yet, so neither the ecological nor the economic claim is proven. Both depend on the same measurement, so one pilot answers both.

**Inclusion gaps.** The English-only, digital-only build comes from hackathon time limits. It also weakens the business case, because people who can't use the plan get no prevention benefit.

**The hardware upsell.** It ties If's revenue to selling devices. That pulls against neutral advice, which affects consumer trust, and against reduction-first thinking, which affects e-waste. Targeting the offer at real risk (old buildings, old appliances) solves both together.

**Limited weather data.** The forecast horizon and city-level data limit the weather cards. Seasonal cards cover the gap honestly, without pretending to be precise.

## 6. Stakeholders, institutions and value conflicts

| Stakeholder | Role | Gains or bears |
|---|---|---|
| Movers: renters, first-time movers, older people | Users | Gain prevention and clarity. Non-English speakers are left out today. |
| If | Likely owner and operator; decides on offers | Gains retention and fewer claims. Bears legal duties (IDD, EAA, GDPR). |
| FMI | Data provider | Its open data is reused under CC BY 4.0 |
| Traficom, Data Protection Ombudsman, FIN-FSA | Supervisors | Enforce accessibility, privacy and insurance distribution rules |
| Housing companies and plumbers | Get questions and repair work | More planned maintenance, fewer emergency repairs |
| Future residents and the environment | Not present | Benefit from avoided damage. Bear the sensors' e-waste. |

The main conflict is between If's interest in personalised offers and data, and users' interest in neutral, private advice. A second conflict is that prevention reduces claims, which is good for If and households, while sensor sales add hardware. Fairness and "leave no one behind" argue for languages and offline access before more features.

## 7. Scorecard

| Dimension | Score | Evidence | Confidence |
|---|---|---|---|
| Ecological | 3.5 | About 24 kB first visit with a 50 kB budget in the build; forecast caching; no AI or database. Enabling value is unmeasured, and the sensor offer brings hardware. | Medium |
| Social | 3 | Privacy and WCAG 2.1 AA by design (Lighthouse accessibility 100). English, Finnish and Swedish; translations not yet checked by native speakers. Digital-first, with a printable plan. | Medium |
| Economic | 3.5 | Large leak claim costs; very low running cost. Effect not measured. | Low |
| Technical | 4 | One readable rules file with sources; few dependencies; open licence and API | High |

## 8. Recommended improvements

| Priority | Action | Dimension / SDG target | Impact | Effort | Owner | Metric |
|---|---|---|---|---|---|---|
| 1 | Add Finnish and Swedish versions of all screens and cards | Social / 10.2 | High | Medium | Team | Share of sessions in each language |
| 2 | Run a pilot with If's move-notice customers and compare leak and frost claims with non-users over 12 months | Ecological, Economic / 12.5, 13.1 | High | Medium | If | Claims per 1,000 households |
| 3 | Offer sensors only to high-risk homes, require a replaceable battery and repairable design, and arrange take-back under the WEEE rules | Ecological / 12.5 | High | Low | If | Share of sensors returned or reused |
| 4 | Set hosting log retention to 14 days or less and state it in the privacy notice | Social / 16.10 | Medium | Low | Team | Configured retention |
| 5 | Test manually with NVDA and VoiceOver and publish an accessibility statement | Social / 10.2 | Medium | Low | Team | Issues found and fixed |
| 6 | Add axe and a 50 kB page budget to the CI definition of done | Technical, Ecological | Medium | Low | Team | Builds passing both checks |
| 7 | Build it into If's existing move notice instead of a new app (reduction first) | Ecological, Social | Medium | Medium | If | Users reached without a new install |
| 8 | Have If's compliance team review the cover and offer texts (IDD, Consumer Protection Act) | Economic, Social | Medium | Low | If | Review done before launch |

## 8a. Done in version 0.2

| Action | Status |
|---|---|
| 1. Finnish and Swedish versions | Done; texts need a native-speaker check before production |
| 3. Sensors only for high-risk homes | Done in the app: the offer shows only for buildings from 1989 or earlier or appliances 7 years or older, says why, and asks for a replaceable battery and recycling. Take-back is still for If to arrange |
| 4. Log retention | Partly: the server no longer logs city names. Hosting log retention still has to be set |
| 6. Page budget and checks in the definition of done | Done for the page budget and colour contrast (`npm run check`). axe runs through Lighthouse by hand, not yet in CI |

New in 0.2 with a sustainability angle: sustainable-move cards (sell, donate or recycle before packing; reusable boxes; waste sorting; room temperatures, with Motiva as the source), calendar export and printing without any account, and opt-in offline use so the plan works before the new home has internet.

## 9. Sources

- Finanssiala, leak claims 2021 (STT): https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin
- Pohjola, leak causes and building age (Verkkouutiset 2021): https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/
- Pohjola, appliance age and average leak cost (Verkkouutiset 2024): https://www.verkkouutiset.fi/a/yleinen-kodinkone-voi-aiheuttaa-jopa-100000-euron-vahingot/
- If survey on movers (MTV Uutiset): https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448
- HTTP Archive, Web Almanac 2024, Page weight: https://almanac.httparchive.org/en/2024/page-weight
- FMI open data: https://en.ilmatieteenlaitos.fi/open-data
- If accessibility statement: https://www.if.fi/en/accessibility
- Traficom, requirements of the Act on the Provision of Digital Services: https://www.saavutettavuusvaatimukset.fi/en/requirements-act-provision-digital-services
- FIN-FSA, Insurance Distribution Directive: https://finanssivalvonta.fi/en/regulation/regulatory-framework/idd
- Ympäristö OK criteria project (TIEKE): https://tieke.fi/en/projects/ymparisto-ok-sustainable-software-criteria-for-ict-procurement/
- Motiva criteria bank, software services: https://kriteeripankki.fi/t/54
- Green Software Foundation, SCI: https://greensoftware.foundation/standards/sci/
- SDG wedding cake (Stockholm Resilience Centre): https://www.stockholmresilience.org/research/research-news/2016-06-14-the-sdgs-wedding-cake.html
- Turku UAS, *Fundamentals of Sustainable Development*, course material
