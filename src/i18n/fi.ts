// Finnish texts. Same shape as en.ts (enforced by the Messages type and test/i18n.test.ts).
// Parameters arrive ready-formatted and are never inflected: sentences are phrased so the
// value stands alone (e.g. "Muuttosi: Turku").
import type { Messages } from "./en";

/** "1 vuosi" / "8 vuotta" */
const years = (n: number) => (n === 1 ? "1 vuosi" : `${n} vuotta`);
/** "1 tehtävä" / "12 tehtävää" */
const tasks = (n: number) => (n === 1 ? "1 tehtävä" : `${n} tehtävää`);

export const fi: Messages = {
  htmlTitle: "MuutoKaveri – suunnittele muuttosi",
  metaDescription:
    "Muuttokaveri, joka laatii muuttopäiväsi perusteella henkilökohtaisen suunnitelman muuttoon ja ensimmäisiin 30 päivään.",

  shell: {
    skip: "Siirry sisältöön",
    tagline: "Muuttokaverisi",
    language: "Kieli",
    mainNav: "Työkalut",
    menu: "Valikko",
    tour: "Esittely",
    insurance: "Päivitä vakuutus",
    navLocked: "Tee ensin suunnitelma",
  },

  steps: {
    label: "Eteneminen",
    of: (n: number, total: number) => `Vaihe ${n}/${total}`,
    names: ["Muuttosi", "Suunnitelmasi", "Valmis"],
    done: "valmis",
  },

  form: {
    eyebrow: "Suunnittele muuttosi",
    title: "Muutatko pian? Kerro meille uudesta kodista.",
    lead: "Vastaa muutamaan kysymykseen kahdessa minuutissa, niin saat henkilökohtaisen suunnitelman muuttoon ja ensimmäisiin 30 päivään. Mukana ovat vuoto-, sää- ja vakuutustarkistukset.",
    sectionMove: "Muutto",
    moveDate: "Muuttopäivä",
    city: "Uusi kotikunta",
    cityPlaceholder: "esim. Turku",
    sectionHome: "Uusi koti",
    homeType: "Talotyyppi",
    apartment: "Kerrostalo tai rivitalo",
    apartmentHint: "Asunto taloyhtiössä",
    house: "Omakotitalo",
    houseHint: "Huolehdit rakennuksesta itse",
    buildingYear: "Rakennuksen valmistumisvuosi",
    buildingYearHint: "Vanhemmissa rakennuksissa putkivuotoja on enemmän.",
    sectionAppliances: "Kodinkoneet",
    washerAge: "Pesukoneen ikä (vuotta)",
    dishwasherAge: "Astianpesukoneen ikä (vuotta)",
    ageHint: "Jätä tyhjäksi, jos sinulla ei ole konetta.",
    agePlaceholder: "ei konetta",
    sectionCover: "Vakuutus",
    knowsCover: "Tiedätkö, mitä kotivakuutuksesi korvaa muuton aikana?",
    coverYes: "Tiedän",
    coverUnsure: "En ole varma",
    coverNo: "En tiedä",
    submit: "Tee muuttosuunnitelma",
    privacy:
      "Syöttämäsi tiedot eivät lähde tältä sivulta. Ainoa poikkeus on kunnan nimi, jota käytetään sääennusteen hakemiseen. Ei evästeitä eikä seurantaa.",
    errorDate: "Valitse muuttopäivä.",
    errorCity: "Kirjoita kunnan nimi, esimerkiksi Turku.",
    errorYear: "Kirjoita rakennuksen valmistumisvuosi, esimerkiksi 1985.",
    errorAge: "Kirjoita koneen ikä kokonaisina vuosina 0–40 tai jätä kenttä tyhjäksi.",
    benefitsTitle: "Mitä saat",
    benefits: [
      { title: "Henkilökohtainen aikataulu", body: "Ennen muuttoa, muuttopäivänä ja ensimmäisten 30 päivän aikana. Jokaiselle tehtävälle on oma päivämäärä." },
      { title: "Vuoto- ja pakkastarkistukset", body: "Perustuvat rakennuksen ikään, kodinkoneisiisi ja Ilmatieteen laitoksen ajantasaiseen ennusteeseen." },
      { title: "Vihreämpi muutto", body: "Vähemmän laatikoita ja ajoja, vähemmän jätettä ja pienempi lämmitysenergian kulutus uudessa kodissa." },
      { title: "Yksityisyys etusijalla", body: "Ei käyttäjätiliä eikä seurantaa. Toimii suomeksi, ruotsiksi ja englanniksi." },
    ],
    badgeValue: "2 min",
    badgeLabel: "ja muuttosuunnitelmasi on valmis",
    visualPoints: [
      "Vuoto-, pakkas- ja vakuutustarkistukset",
      "Jokaiselle tehtävälle oma päivämäärä",
      "Toimii muuttopäivänä ilman verkkoyhteyttä",
    ],
    whyEyebrow: "Miksi MuutoKaveri",
    whyTitle: "Kaikki muuttoon liittyvä yhdessä suunnitelmassa",
    faqTitle: "Usein kysyttyä",
    faq: [
      {
        q: "Onko MuutoKaveri maksuton, ja tarvitsenko käyttäjätilin?",
        a: "MuutoKaveri on maksuton, eikä käyttäjätiliä tarvita. Vastaa kuuteen kysymykseen, niin suunnitelmasi on valmis.",
      },
      {
        q: "Mitä vastauksilleni tapahtuu?",
        a: "Ne pysyvät tällä selaimen välilehdellä. Palvelimellemme lähetetään vain kunnan nimi sääennusteen hakemista varten. Jos otat käyttöön asetuksen ”Tallenna tähän laitteeseen”, suunnitelma säilyy laitteessasi, kunnes poistat asetuksen käytöstä.",
      },
      {
        q: "Käykö suunnitelma vakuutusehtojen sijasta?",
        a: "Ei käy. Suunnitelma antaa yleisiä neuvoja, mutta oman vakuutuksesi ehdot ratkaisevat, mitä korvataan. Siksi suunnitelma kertoo, mitä kannattaa tarkistaa, ja siinä on linkki vakuutusyhtiösi muuttoilmoitukseen.",
      },
      {
        q: "Voinko käyttää sitä puhelimella muuttopäivänä?",
        a: "Voit. Ota käyttöön asetus ”Tallenna tähän laitteeseen”, niin suunnitelma aukeaa, vaikka uudessa kodissa ei olisi vielä internetyhteyttä. Voit myös tulostaa suunnitelman tai lisätä tehtävät kalenteriisi.",
      },
    ],
  },

  tour: {
    bannerTitle: "Käytätkö MuutoKaveria ensimmäistä kertaa?",
    bannerBody: "Tutustu työkaluihin minuutin esittelykierroksella: vastauksista valmiiseen suunnitelmaan.",
    bannerStart: "Aloita esittely",
    bannerDismiss: "Ei kiitos",
    label: "Esittelykierros",
    stepOf: (n: number, total: number) => `Vaihe ${n}/${total}`,
    back: "Takaisin",
    next: "Seuraava",
    skip: "Ohita esittely",
    finish: "Valmis",
    buildPlan: "Tee suunnitelma",
    openSummary: "Avaa yhteenveto",
    steps: {
      welcome: {
        title: "Tervetuloa MuutoKaveriin",
        body: "Tämä esittelykierros näyttää jokaisen työkalun vastauksistasi valmiiseen suunnitelmaan. Se kestää noin minuutin. Voit lopettaa milloin tahansa painamalla Esc-näppäintä.",
      },
      language: {
        title: "Valitse kieli",
        body: "Voit vaihtaa kieleksi suomen, ruotsin tai englannin milloin tahansa. Vastauksesi säilyvät ennallaan.",
      },
      nav: {
        title: "Siirry työkalusta toiseen",
        body: "Työkalut ovat Muuttosi, Suunnitelmasi ja Valmis. Suunnitelma ja yhteenveto avautuvat, kun olet tehnyt suunnitelman.",
      },
      form: {
        title: "Kerro muutostasi",
        body: "Kuusi nopeaa vastausta: muuttopäivä, kunta, talotyyppi, rakennuksen valmistumisvuosi, kodinkoneesi ja vakuutuksesi.",
      },
      submit: {
        title: "Tee suunnitelma",
        body: "Kun jatkat, suunnitelma tehdään lomakkeen vastausten perusteella. Voit muuttaa vastauksia myöhemmin.",
      },
      progress: {
        title: "Seuraa etenemistä",
        body: "Näet, montako tehtävää on tehty, montako tärkeää tehtävää on vielä tekemättä ja montako päivää muuttoon on jäljellä.",
      },
      forecast: {
        title: "Sää muuton aikaan",
        body: "Sääennuste muuttoa edeltäville ja sitä seuraaville päiville. Jos ennusteessa on pakkasta, kovaa tuulta tai rankkasadetta, suunnitelmaan lisätään tehtävä.",
      },
      filters: {
        title: "Suodata aiheen mukaan",
        body: "Näytä vain vuotoriskeihin, vakuutukseen, säähän, kestävyyteen, asiointiin tai turvallisuuteen liittyvät tehtävät.",
      },
      card: {
        title: "Merkitse tehtävät tehdyiksi",
        body: "Jokaisella tehtävällä on päivämäärä. Merkitse tehtävä, kun se on tehty. Tärkeissä tehtävissä on violetti reuna. Linkeistä pääset palveluun ja kunkin tiedon lähteeseen.",
      },
      tools: {
        title: "Kalenteri ja tulostus",
        body: "Lisää tekemättömät tehtävät puhelimesi kalenteriin tai tulosta suunnitelma muistilistaksi muuttopäivää varten.",
      },
      remember: {
        title: "Tallenna tähän laitteeseen",
        body: "Asetus on oletuksena pois päältä. Ota se käyttöön, niin suunnitelmasi säilyy ja voit käyttää sitä muuttopäivänä ilman verkkoyhteyttä. Kun poistat asetuksen käytöstä, kaikki tiedot poistetaan.",
      },
      next: {
        title: "Siirry yhteenvetoon",
        body: "Kun suunnitelma näyttää hyvältä, siirry yhteenvetoon. Siinä näet, mitä on vielä tekemättä, ja viimeiset vaiheet.",
      },
      open: {
        title: "Mitä on vielä tekemättä",
        body: "Tärkeät tehtävät, joita et ole vielä merkinnyt tehdyiksi. Näin mikään iso asia ei unohdu.",
      },
      cta: {
        title: "Päivitä kotivakuutuksesi",
        body: "Linkki vie vakuutusyhtiösi muuttoilmoitukseen, jotta uusi koti on vakuutettu ensimmäisestä yöstä alkaen.",
      },
      notes: {
        title: "Uuden kodin tärkeät tiedot",
        body: "Kirjoita muistiin veden pääsulkuventtiilin ja sähkökeskuksen sijainti, huoltoyhtiön puhelinnumero ja mittarien lukemat.",
      },
      emergency: {
        title: "Jos vettä vuotaa",
        body: "Neljä toimenpidettä, jotka teet heti. Ne ovat myös tulosteessa.",
      },
      done: {
        title: "Olet valmis",
        body: "Siinä olivat kaikki työkalut. Voit katsoa esittelyn uudelleen sivun yläreunan Esittely-painikkeesta.",
      },
    },
  },

  loading: {
    title: "Suunnitelmaa tehdään…",
    status: (city: string) => `Haetaan sääennustetta: ${city}.`,
  },

  phases: {
    before: { title: "Ennen muuttoa", when: "Tästä muuttopäivään" },
    movingDay: { title: "Muuttopäivä" },
    first30: { title: "Ensimmäiset 30 päivää", when: "Uudessa kodissa" },
  },

  tags: {
    insurance: "Vakuutus",
    leak: "Vuotoriski",
    weather: "Sää",
    admin: "Asiointi",
    safety: "Turvallisuus",
    green: "Kestävyys",
  },

  plan: {
    eyebrow: "Suunnitelmasi",
    title: (city: string) => `Muuttosi: ${city}`,
    countdown: (days: number) =>
      days > 1
        ? `${days} päivää muuttoon`
        : days === 1
          ? "Muutto on huomenna"
          : days === 0
            ? "Muuttopäivä on tänään"
            : days === -1
              ? "Muutit eilen"
              : `Muutit ${-days} päivää sitten`,
    lead: (total: number, high: number) =>
      `${tasks(total)}, joista ${
        high === 0 ? "yksikään ei ole tärkeä" : high === 1 ? "1 on tärkeä" : `${high} on tärkeitä`
      } kotisi kannalta.`,
    forecastFmi: "Ajantasainen sää Ilmatieteen laitokselta.",
    forecastSaved: "Ajantasaista säätietoa ei saatu, joten suunnitelmassa käytetään tallennettua ennustetta.",
    forecastNone: "Sääennustetta ei ole saatavilla.",
    progressLabel: "Suunnitelman eteneminen",
    progress: (done: number, total: number) => `Tehty ${done}/${total}`,
    openImportant: (n: number) =>
      n === 0
        ? "Kaikki tärkeät tehtävät tehty"
        : n === 1
          ? "1 tärkeä tehtävä tekemättä"
          : `${n} tärkeää tehtävää tekemättä`,
    filterLabel: "Näytä",
    filterAll: "Kaikki",
    filterShown: (n: number) => (n === 1 ? "Näytetään 1 tehtävä" : `Näytetään ${n} tehtävää`),
    calendar: "Lisää kalenteriin",
    print: "Tulosta",
    phaseCount: (done: number, total: number) => `Tehty ${done}/${total}`,
    empty: "Tällä suodattimella ei löydy tehtäviä.",
    important: "Tärkeä",
    dueBy: (date: string) => `Viimeistään ${date}`,
    dueToday: "Tänään",
    overdue: (date: string) => `Tee tämä nyt (suositus: viimeistään ${date})`,
    source: "Lähde",
    newTab: "(avautuu uuteen välilehteen)",
    back: "Muuta vastauksia",
    next: "Katso yhteenveto",
    forecastTitle: "Sää muuton aikaan",
    forecastLow: "Alin",
    forecastWind: "Tuuli",
    forecastRain: "Sade",
    alertFrost: "Pakkanen",
    alertWind: "Kova tuuli",
    alertRain: "Rankkasade",
    remember: "Tallenna tähän laitteeseen",
    rememberHint:
      "Tallentaa suunnitelmasi, muistiinpanosi ja itse sovelluksen tähän laitteeseen, jotta ne toimivat muuttopäivänä myös ilman verkkoyhteyttä. Asetus on oletuksena pois päältä. Kun poistat sen käytöstä, kaikki tiedot poistetaan.",
    rememberOn: "Tallennettu tähän laitteeseen.",
    rememberOff: "Poistettu tästä laitteesta.",
    calendarName: (city: string) => `Muutto: ${city}`,
    calendarDone: "Kalenteritiedosto on ladattu. Avaa se, niin tekemättömät tehtävät lisätään kalenteriisi.",
  },

  summary: {
    eyebrow: "Valmis",
    title: (date: string) => `Valmiina muuttoon: ${date}`,
    progress: (done: number, total: number) => `Tehty ${done}/${total}.`,
    openTitle: (n: number) =>
      n === 1 ? "1 tärkeä tehtävä on vielä tekemättä" : `${n} tärkeää tehtävää on vielä tekemättä`,
    allDone: "Kaikki tärkeät tehtävät on tehty.",
    ctaTitle: "Päivitä kotivakuutuksesi yhdellä kertaa",
    ctaBody:
      "Viimeinen vaihe on kertoa vakuutusyhtiölle uusi osoite. Silloin uusi koti on vakuutettu ensimmäisestä yöstä alkaen.",
    ctaButton: "Avaa Ifin muuttoilmoitus",
    notesTitle: "Uuden kodin tärkeät tiedot",
    notesLead:
      "Kirjoita nämä muistiin muuttopäivänä. Vuotovahingon tai sähkökatkon sattuessa löydät ne täältä tai tulosteesta.",
    notesWaterValve: "Veden pääsulkuventtiilin sijainti",
    notesWaterValvePlaceholder: "esim. keittiön tiskialtaan alla",
    notesFuseBox: "Sähkökeskuksen (sulaketaulun) sijainti",
    notesFuseBoxPlaceholder: "esim. eteisen kaapissa",
    notesMaintenance: "Huoltoyhtiön tai päivystyksen puhelinnumero",
    notesElectricityMeter: "Sähkömittarin lukema",
    notesWaterMeter: "Vesimittarin lukema",
    notesSavedHint: "Muistiinpanosi säilyvät tässä laitteessa.",
    notesUnsavedHint:
      "Muistiinpanot katoavat, kun suljet välilehden, ellet ota suunnitelmassa käyttöön asetusta ”Tallenna tähän laitteeseen”.",
    emergencyTitle: "Jos vettä vuotaa",
    emergencySteps: [
      "Sulje vesi pääsulkuventtiilistä tai laitteen omasta hanasta.",
      "Katkaise alueen sähköt, jos vettä pääsee pistorasioihin tai laitteisiin.",
      "Soita taloyhtiön huoltoon tai omakotitalossa putkiasentajalle. Jos joku on vaarassa, soita 112.",
      "Valokuvaa vahingot, kuivaa mitä voit ja ilmoita vahingosta vakuutusyhtiölle mahdollisimman pian.",
    ],
    offerTag: "Tarjouskonsepti",
    offerTitle: "Vuotovahti uuteen keittiöön",
    offerWhy: "Näytämme tämän, koska kotisi vuotoriski on tavallista suurempi:",
    offerBuilding: (year: number) => `Rakennus valmistunut vuonna ${year}`,
    offerWasher: (age: number) => `Pesukoneen ikä: ${years(age)}`,
    offerDishwasher: (age: number) => `Astianpesukoneen ikä: ${years(age)}`,
    offerBody:
      "Astianpesukoneen ja tiskialtaan alle asennettu vuotovahti hälyttää jo ensimmäisistä pisaroista. Tarjoamme sitä vain koteihin, joissa vuotoriski on tavallista suurempi. Näin laitetta ei myydä sinne, missä sitä ei tarvita. Valitse malli, jossa on vaihdettava paristo, ja kierrätä laite käytön päätyttyä sähkö- ja elektroniikkaromuna.",
    back: "Takaisin suunnitelmaan",
    print: "Tulosta",
    restart: "Aloita alusta",
    restartConfirm: "Aloitetaanko alusta? Vastauksesi, merkintäsi ja muistiinpanosi poistetaan.",
  },

  footer: {
    summary: "Tietosuoja, saavutettavuus ja lähteet",
    privacyTitle: "Tietosuoja",
    privacy:
      "MuutoKaverissa ei ole käyttäjätilejä, evästeitä, analytiikkaa eikä seurantaa. Oletuksena vastauksesi pysyvät tällä selaimen välilehdellä ja katoavat, kun suljet sen. Palvelimellemme lähetetään vain kunnan nimi. Palvelin välittää sen Ilmatieteen laitokselle sääennusteen hakemista varten ja pitää kunnan ennustetta muistissa 30 minuuttia. Nimeä ei kirjata lokiin eikä yhdistetä sinuun.",
    privacySaved:
      "Jos otat käyttöön asetuksen ”Tallenna tähän laitteeseen”, vastauksesi, merkintäsi ja muistiinpanosi säilytetään selaimen paikallisessa tallennustilassa, ja sovellus tallennetaan välimuistiin, jotta se toimii ilman verkkoyhteyttä. Mitään ei lähetetä minnekään. Kun poistat asetuksen käytöstä, kaikki nämä tiedot poistetaan.",
    accessibilityTitle: "Saavutettavuus",
    accessibility:
      "MuutoKaveri on suunniteltu täyttämään WCAG 2.1 -ohjeiston AA-tason vaatimukset. Sitä voi käyttää näppäimistöllä ja ruudunlukijalla, värit täyttävät kontrastivaatimukset ja sovellus noudattaa vaalean tai tumman tilan asetustasi. Löysitkö ongelman? Kerro siitä avaamalla issue projektin repositoriossa.",
    sourcesTitle: "Lähteet",
    sourceItems: [
      { topic: "Muuttajien tietämys vakuutusturvasta", label: "If-kysely, MTV Uutiset", href: "https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448" },
      { topic: "Vuotovahingot Suomessa 2021", label: "Finanssiala, STT", href: "https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin" },
      { topic: "Vuotojen syyt ja rakennuksen ikä", label: "Pohjola, Verkkouutiset 2021", href: "https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/" },
      { topic: "Kodinkoneiden ikä ja vuotovahinkojen keskimääräiset kustannukset", label: "Pohjola, Verkkouutiset 2024", href: "https://www.verkkouutiset.fi/a/yleinen-kodinkone-voi-aiheuttaa-jopa-100000-euron-vahingot/" },
      { topic: "Lämmitysenergia ja huonelämpötila", label: "Motiva", href: "https://www.motiva.fi/tietopankki/kodin-energiatehokas-sahkolammitys/" },
      { topic: "Palovaroittimet", label: "Sisäministeriön asetus 300/2025, Finlex", href: "https://www.finlex.fi/fi/lainsaadanto/2025/300" },
      { topic: "Sääennuste", label: "Ilmatieteen laitoksen avoin data, CC BY 4.0", href: "https://en.ilmatieteenlaitos.fi/open-data" },
    ],
    disclaimer:
      "Tehty JunctionX Turku 2026 -tapahtumassa. Suunnitelma antaa yleistä tietoa, ei vakuutusneuvontaa. Oman vakuutuksesi ehdot ratkaisevat, mitä korvataan.",
  },

  sources: {
    ifSurvey: "If-kysely (MTV Uutiset)",
    leakClaims2021: "Finanssialan vuotovahinkotilastot 2021 (STT)",
    leakCauses: "Pohjolan vuotovahinkotiedot (Verkkouutiset 2021)",
    applianceAge: "Pohjolan kodinkonetiedot (Verkkouutiset 2024)",
    fmi: "Ilmatieteen laitos, CC BY 4.0",
    motiva: "Motiva",
    smokeAlarm: "Asetus palovaroittimista 300/2025 (Finlex)",
  },

  cards: {
    coverCheck: {
      title: "Varmista, että tavarasi on vakuutettu muuton aikana",
      known:
        "Tiedät vakuutusturvasi tason. Tarkista, että se kattaa muuton aikana rikkoutuneet tavarat. Jotkin vakuutukset korvaavat ne vain laajemmissa turvatasoissa.",
      unknown:
        "Ifin kyselyssä 38 % muuttajista uskoi, että heidän tavaransa eivät olleet vakuutettuja edellisen muuton aikana. Tarkista vakuutuksesi taso ennen muuttopäivää. Muuton aikana rikkoutuneet tavarat korvataan vain osassa turvatasoista.",
    },
    declutter: {
      title: "Myy, lahjoita tai kierrätä se, mitä et ota mukaan",
      body: "Jokainen laatikko, jota ei tarvitse kuljettaa, säästää pakkaamista, tilaa muuttoautossa ja polttoainetta. Lahjoita käyttökelpoiset tavarat kierrätyskeskukseen tai myy ne. Vie elektroniikka, paristot ja vanhat maalit maksuttomaan keräyspisteeseen.",
      link: "Etsi keräyspiste",
    },
    boxes: {
      title: "Vuokraa uudelleenkäytettävät muuttolaatikot",
      body: "Vuokrattuja muovilaatikoita käytetään yhä uudelleen, ne pinoutuvat tukevasti ja ne haetaan pois muuton jälkeen. Jos käytät pahvilaatikoita, hanki käytettyjä ja kierrätä ne muuton jälkeen.",
    },
    officialNotice: {
      title: "Tee virallinen muuttoilmoitus",
      body: "Yhdellä ilmoituksella tiedot päivittyvät väestötietojärjestelmään ja Postille. Voit tehdä ilmoituksen aikaisintaan kuukautta ennen muuttoa ja viimeistään viikon kuluttua muutosta.",
      link: "Muuttoilmoitus Postissa",
    },
    insurerNotice: {
      title: "Kerro vakuutusyhtiölle uusi osoite ja muuttopäivä",
      body: "Kotivakuutuksesi pitäisi kattaa molemmat kodit muuttopäivänä. Päivitä osoite, niin uusi koti on vakuutettu ensimmäisestä yöstä alkaen.",
      link: "Ifin muuttoilmoitus",
    },
    electricity: {
      title: "Tee sähkösopimus uuteen kotiin",
      body: "Ilman sopimusta sähköt voivat olla poikki, kun saavut. Tee sopimus viimeistään viikkoa ennen muuttoa. Uusiutuvilla energialähteillä tuotetun sähkön valitseminen on yksi helpoimmista ilmastoteoista kotona.",
    },
    internet: {
      title: "Tilaa laajakaista tai siirrä liittymäsi",
      body: "Tarkista, mitä yhteyksiä uuteen osoitteeseen on saatavilla. Uuden liittymän asennus voi kestää pari viikkoa.",
    },
    washerOld: {
      title: (age: number) => `Pesukoneesi ikä on ${years(age)}: vaihda letkut ennen kuin kytket koneen uudelleen`,
    },
    dishwasherOld: {
      title: (age: number) => `Astianpesukoneesi ikä on ${years(age)}: vaihda letkut ennen kuin kytket koneen uudelleen`,
    },
    applianceOldBody:
      "Pesukoneiden ja astianpesukoneiden vuotoriski kasvaa noin neljännestä käyttövuodesta alkaen. Uudet tuloletkut ovat edullisia verrattuna omakotitalon keskimääräiseen vuotovahinkoon, joka maksaa noin 8 500 euroa.",
    washerCheck: { title: (age: number) => `Tarkista pesukoneen letkut (ikä ${years(age)})` },
    dishwasherCheck: { title: (age: number) => `Tarkista astianpesukoneen letkut (ikä ${years(age)})` },
    applianceCheckBody:
      "Kun kone on muutenkin irrotettuna, tarkista tulo- ja poistoletkut. Etsi halkeamia ja jäykkiä kohtia.",
    waterValve: {
      houseTitle: "Etsi veden pääsulkuventtiili",
      apartmentTitle: "Etsi asuntosi veden sulkuventtiili",
      houseBody: (oldYear: number | null) =>
        `Vuotovahingossa jokainen minuutti on tärkeä. ${oldYear ? `Talosi on rakennettu vuonna ${oldYear}. Lähes 70 % vuodoista sattuu taloissa, jotka on rakennettu 1980-luvulla tai aiemmin. ` : ""}Etsi venttiili ennen kuin alat purkaa muuttolaatikoita, ja varmista, että kaikki kotisi asukkaat tietävät, missä se on.`,
      apartmentBody:
        "Monessa asunnossa on oma sulkuventtiili keittiön tiskialtaan alla tai kylpyhuoneessa. Jos et löydä sitä, kysy taloyhtiöltä, kenelle vuototilanteessa soitetaan.",
    },
    meters: {
      title: "Lue mittarit ja tarkista, onko piileviä vuotoja",
      houseBody:
        "Kirjoita sähkö- ja vesimittarin lukemat muistiin ensimmäisiä laskuja varten. Sulje sitten kaikki hanat ja seuraa vesimittaria muutaman minuutin ajan. Jos se pyörii yhä, jossain voi olla piilevä vuoto.",
      apartmentBody:
        "Kirjoita sähkömittarin lukema muistiin sähkösopimusta varten. Jos asunnossa on oma vesimittari, sulje kaikki hanat ja seuraa mittaria muutaman minuutin ajan. Jos se pyörii yhä, jossain voi olla piilevä vuoto.",
    },
    reconnect: {
      title: "Kytke kodinkoneet takaisin ja seuraa ensimmäistä käyttökertaa",
      body: "Noin 60 % vuodoista alkaa vesijohdoista ja kodinkoneista. Pysy lähellä, kun pesukone ja astianpesukone käyvät ensimmäisen kerran, ja tarkista, tippuuko liitoksista vettä.",
    },
    photos: {
      title: "Valokuvaa tavarasi ja uuden kodin kunto",
      body: "Kun otat kuvat heti saapuessasi, mahdollisen muuttovahingon korvaus käsitellään nopeammin. Kuvat näyttävät myös, missä kunnossa koti oli, kun sait avaimet.",
    },
    smokeAlarm: {
      title: "Testaa palovaroittimet",
      body: "Asunnossa pitää olla vähintään yksi palovaroitin jokaisen kerroksen alkavaa 60 neliömetriä kohti. Testaa palovaroittimet ensimmäisellä viikolla. Taloyhtiössä palovaroittimet huoltaa taloyhtiö, joten ilmoita viallisesta varoittimesta tai loppuneesta paristosta sille heti.",
    },
    pipeHistory: {
      houseTitle: "Selvitä, milloin putket on viimeksi uusittu",
      apartmentTitle: "Kysy taloyhtiöltä putkiremontin suunnitelmasta",
      houseBody: (year: number) =>
        `Talosi on rakennettu vuonna ${year}. Katso myyjän asiakirjoista tai huoltokirjasta, milloin putkiremontti on viimeksi tehty. Jos putkiremonttia ei ole tehty, ala suunnitella sitä.`,
      apartmentBody: (year: number) =>
        `Rakennus on valmistunut vuonna ${year}. Kysy taloyhtiöltä, milloin putkiremontti on suunniteltu, niin tiedät, mitä on tulossa.`,
    },
    leakSensor: {
      title: "Asenna vuotovahti astianpesukoneen ja tiskialtaan alle",
      body: "Vuotovahingot olivat Suomessa vuonna 2021 yleisin kotivakuutuksesta korvattu vahinkolaji: 34 800 vahinkoa, joiden kustannukset olivat 171 miljoonaa euroa. Kun vuotovahti hälyttää jo ensimmäisistä pisaroista, ehdit sulkea veden ennen kuin vahinko leviää.",
    },
    heating: {
      title: "Säädä huonelämpötilat ja pidä ilmanvaihtoventtiilit auki",
      body: "Olohuoneissa noin 21 °C riittää, makuuhuoneissa 18–20 °C. Jokainen aste vähemmän säästää noin 5 % lämmitysenergiaa. Älä sulje ilmanvaihtoventtiilejä, koska se aiheuttaa kosteutta ja hometta.",
    },
    waste: {
      title: "Selvitä jätteiden lajittelu uudessa osoitteessa",
      body: "Jäteastiat vaihtelevat taloyhtiöittäin ja kunnittain. Tarkista, mitä jätelajeja kiinteistöltä kerätään ja missä on lähin kierrätyspiste.",
      link: "Etsi kierrätyspiste",
    },
    frost: {
      title: (city: string, date: string, temp: string) => `Pakkasta ennustettu: ${city}, ${date} (${temp} °C)`,
      house:
        "Pidä kellari, ryömintätila ja tyhjät huoneet lämpiminä. Tyhjennä ulkohana ja puutarhaletku. Jäätyneet putket halkeavat, kun ne sulavat.",
      apartment:
        "Pidä lämmitys päällä kaikissa huoneissa, myös niissä, jotka ovat vielä täynnä laatikoita. Sulje ikkunat, jotka jäivät auki muuton aikana.",
    },
    wind: {
      title: (date: string, speed: string) => `Kovaa tuulta ennustettu: ${date} (jopa ${speed} m/s)`,
      body: "Kiinnitä puutarhakalusteet ja kaikki, mitä on jäänyt ulos muuton jälkeen. Tuo parvekkeella säilytetyt muuttolaatikot sisälle.",
    },
    rain: {
      title: (date: string, mm: string) => `Rankkasadetta ennustettu: ${date} (${mm} mm)`,
      house: "Tarkista, etteivät rännit ja syöksytorvet ole tukossa ja että vesi ohjautuu poispäin sokkelista.",
      apartment: "Nosta varastossa olevat laatikot irti lattiasta ja sulje parvekelasit.",
    },
    season: {
      title: "Ensimmäinen talvi uudessa kodissa",
      house: "Selvitä ennen ensimmäisiä pakkasia, miten kellari ja ryömintätila lämmitetään, ja tyhjennä ulkohanat.",
      apartment: "Tarkista ennen ensimmäisiä pakkasia, että patterit toimivat kaikissa huoneissa.",
    },
    forecastCheck: {
      title: "Tarkista sääennuste kaksi päivää ennen muuttoa",
      body: "Ennusteet ulottuvat vain muutaman päivän eteenpäin. Tarkista kaksi päivää ennen muuttoa, onko tulossa sadetta (suojaa laatikot), pakkasta (pidä lämmitys päällä) tai kovaa tuulta.",
    },
    weatherFmi: "Ennuste: Ilmatieteen laitos.",
    weatherSaved: "Tallennettu Ilmatieteen laitoksen ennuste (ajantasaista tietoa ei saatavilla).",
    weatherSample: "Esimerkkiennuste (ajantasaista tietoa ei saatavilla).",
  },
};
