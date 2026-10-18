// Swedish (Finland-Swedish) texts. Same shape as en.ts; see the rules for translators there.
import type { Messages } from "./en";

export const sv: Messages = {
  htmlTitle: "MovePilot – planera din flytt",
  metaDescription:
    "Ett stöd vid flytten som gör om ditt flyttdatum till en personlig plan för flytten och dina första 30 dagar.",

  shell: {
    skip: "Hoppa till innehållet",
    tagline: "Ditt stöd vid flytten",
    language: "Språk",
  },

  steps: {
    label: "Framsteg",
    of: (n: number, total: number) => `Steg ${n} av ${total}`,
    names: ["Din flytt", "Din plan", "Klart"],
    done: "klart",
  },

  form: {
    eyebrow: "Planera din flytt",
    title: "Flyttar du snart? Berätta om ditt nya hem.",
    lead: "Det tar två minuter att svara på frågorna, och sedan får du en personlig plan för flytten och dina första 30 dagar. Kontroller av läckagerisk, väder och försäkring ingår.",
    sectionMove: "Flytten",
    moveDate: "Flyttdag",
    city: "Ny ort",
    cityPlaceholder: "t.ex. Turku",
    sectionHome: "Det nya hemmet",
    homeType: "Typ av bostad",
    apartment: "Lägenhet",
    apartmentHint: "Flervåningshus eller radhus i ett husbolag",
    house: "Egnahemshus",
    houseHint: "Du sköter själv om byggnaden",
    buildingYear: "Byggnadsår",
    buildingYearHint: "I äldre byggnader läcker rören oftare.",
    sectionAppliances: "Hushållsmaskiner",
    washerAge: "Tvättmaskinens ålder (år)",
    dishwasherAge: "Diskmaskinens ålder (år)",
    ageHint: "Lämna tomt om du inte har någon.",
    agePlaceholder: "ingen",
    sectionCover: "Försäkring",
    knowsCover: "Vet du vad din hemförsäkring täcker under flytten?",
    coverYes: "Ja",
    coverUnsure: "Osäker",
    coverNo: "Nej",
    submit: "Skapa min flyttplan",
    privacy:
      "Inget av det du fyller i lämnar den här sidan, utom ortens namn. Det används för väderprognosen. Inga kakor, ingen spårning.",
    errorDate: "Välj flyttdag.",
    errorCity: "Skriv ortens namn, till exempel Turku.",
    errorYear: "Skriv byggnadsåret, till exempel 1985.",
    errorAge: "Skriv maskinens ålder i hela år från 0 till 40, eller lämna fältet tomt.",
    benefitsTitle: "Det här får du",
    benefits: [
      { title: "En personlig tidslinje", body: "Före flytten, på flyttdagen och under de första 30 dagarna, med ett datum för varje uppgift." },
      { title: "Kontroll av läckage och frost", body: "Utgående från byggnadens ålder, dina hushållsmaskiner och den aktuella prognosen från Meteorologiska institutet." },
      { title: "En grönare flytt", body: "Färre lådor och resor, mindre avfall och mindre energi för uppvärmning i det nya hemmet." },
      { title: "Inbyggt integritetsskydd", body: "Inget konto och ingen spårning. Fungerar på engelska, finska och svenska." },
    ],
  },

  loading: {
    title: "Vi skapar din plan…",
    status: (city: string) => `Vi kontrollerar väderprognosen för ${city}.`,
  },

  phases: {
    before: { title: "Före flytten", when: "Från nu till flyttdagen" },
    movingDay: { title: "Flyttdagen" },
    first30: { title: "De första 30 dagarna", when: "I det nya hemmet" },
  },

  tags: {
    insurance: "Försäkring",
    leak: "Läckagerisk",
    weather: "Väder",
    admin: "Ärenden",
    safety: "Säkerhet",
    green: "Hållbart",
  },

  plan: {
    eyebrow: "Din plan",
    title: (city: string) => `Din flytt till ${city}`,
    countdown: (days: number) =>
      days > 1
        ? `${days} dagar kvar`
        : days === 1
          ? "Flyttdagen är i morgon"
          : days === 0
            ? "Flyttdagen är i dag"
            : days === -1
              ? "Du flyttade i går"
              : `Du flyttade för ${-days} dagar sedan`,
    lead: (total: number, high: number) =>
      `${total} ${total === 1 ? "sak" : "saker"} att göra, varav ${high} ${high === 1 ? "viktig" : "viktiga"} för ditt hem.`,
    forecastFmi: "Aktuellt väder från Meteorologiska institutet.",
    forecastSaved: "Det gick inte att hämta aktuellt väder, så planen använder en sparad prognos.",
    forecastNone: "Det gick inte att hämta någon väderprognos.",
    progressLabel: "Planens framsteg",
    progress: (done: number, total: number) => `Klart: ${done} av ${total}`,
    openImportant: (n: number) =>
      n === 0
        ? "Alla viktiga uppgifter är klara"
        : n === 1
          ? "1 viktig uppgift kvar"
          : `${n} viktiga uppgifter kvar`,
    filterLabel: "Visa",
    filterAll: "Alla",
    filterShown: (n: number) => (n === 1 ? "Visar 1 uppgift" : `Visar ${n} uppgifter`),
    calendar: "Lägg till i kalendern",
    print: "Skriv ut",
    phaseCount: (done: number, total: number) => `Klart: ${done} av ${total}`,
    empty: "Inget att visa med det här filtret.",
    important: "Viktigt",
    dueBy: (date: string) => `Senast ${date}`,
    dueToday: "I dag",
    overdue: (date: string) => `Gör det nu (rekommenderat senast ${date})`,
    source: "Källa",
    newTab: "(öppnas i en ny flik)",
    back: "Ändra svaren",
    next: "Visa sammanfattningen",
    forecastTitle: "Vädret kring flytten",
    forecastLow: "Lägsta",
    forecastWind: "Vind",
    forecastRain: "Regn",
    alertFrost: "Frost",
    alertWind: "Hård vind",
    alertRain: "Kraftigt regn",
    remember: "Spara på den här enheten",
    rememberHint:
      "Sparar din plan, dina anteckningar och själva appen på den här enheten, så att de fungerar utan internetförbindelse på flyttdagen. Avstängt som standard. Stäng av funktionen för att radera allt.",
    rememberOn: "Sparat på den här enheten.",
    rememberOff: "Raderat från den här enheten.",
    calendarName: (city: string) => `Flytt till ${city}`,
    calendarDone: "Kalenderfilen har laddats ner. Öppna den för att lägga till de återstående uppgifterna i din kalender.",
  },

  summary: {
    eyebrow: "Klart",
    title: (date: string) => `Redo för flytten: ${date}`,
    progress: (done: number, total: number) => `Klart: ${done} av ${total}.`,
    openTitle: (n: number) =>
      n === 1 ? "1 viktig uppgift är fortfarande kvar" : `${n} viktiga uppgifter är fortfarande kvar`,
    allDone: "Alla viktiga uppgifter är klara.",
    ctaTitle: "Uppdatera din hemförsäkring i ett steg",
    ctaBody:
      "Det sista steget är att meddela ditt försäkringsbolag den nya adressen. Då är det nya hemmet försäkrat från första natten.",
    ctaButton: "Öppna flyttanmälan hos If",
    notesTitle: "Viktig information om ditt nya hem",
    notesLead:
      "Fyll i det här på flyttdagen. Vid ett läckage eller ett strömavbrott hittar du informationen här eller på utskriften.",
    notesWaterValve: "Huvudkranen för vattnet finns",
    notesWaterValvePlaceholder: "t.ex. under diskbänken",
    notesFuseBox: "Proppskåpet finns",
    notesFuseBoxPlaceholder: "t.ex. i skåpet i tamburen",
    notesMaintenance: "Telefonnummer till fastighetsskötseln eller jouren",
    notesElectricityMeter: "Elmätarens ställning",
    notesWaterMeter: "Vattenmätarens ställning",
    notesSavedHint: "Dina anteckningar sparas på den här enheten.",
    notesUnsavedHint:
      "Anteckningarna försvinner när du stänger fliken, om du inte slår på ”Spara på den här enheten” i planen.",
    emergencyTitle: "Om det läcker vatten",
    emergencySteps: [
      "Stäng av vattnet med huvudkranen eller med maskinens egen kran.",
      "Slå av strömmen i utrymmet om vattnet når eluttag eller apparater.",
      "Ring husbolagets fastighetsskötsel, eller en rörmokare om du bor i ett egnahemshus. Ring 112 om någon är i fara.",
      "Fotografera skadan, torka det du kan och anmäl skadan till ditt försäkringsbolag så snart som möjligt.",
    ],
    offerTag: "Erbjudandekoncept",
    offerTitle: "Läckagevakt för det nya köket",
    offerWhy: "Visas eftersom ditt hem har förhöjd läckagerisk:",
    offerBuilding: (year: number) => `Byggnad från ${year}`,
    offerWasher: (age: number) => `Tvättmaskinen är ${age} år gammal`,
    offerDishwasher: (age: number) => `Diskmaskinen är ${age} år gammal`,
    offerBody:
      "En vakt under diskmaskinen och diskbänken larmar vid de första dropparna. Den erbjuds bara till hem med förhöjd läckagerisk, så ingen apparat säljs där den inte behövs. Välj en med utbytbart batteri, och lämna den till en insamlingsplats för elektronikavfall när den är uttjänt.",
    back: "Tillbaka till planen",
    print: "Skriv ut",
    restart: "Börja om",
    restartConfirm: "Vill du börja om? Dina svar, markeringar och anteckningar raderas.",
  },

  footer: {
    summary: "Dataskydd, tillgänglighet och källor",
    privacyTitle: "Dataskydd",
    privacy:
      "MovePilot har inga konton, kakor, analysverktyg eller spårning. Som standard stannar dina svar i den här webbläsarfliken och försvinner när du stänger den. Bara ortens namn skickas till vår server. Servern skickar det vidare till Meteorologiska institutet för att hämta väderprognosen och håller ortens prognos i minnet i 30 minuter. Namnet loggas inte och kopplas inte till dig.",
    privacySaved:
      "Om du slår på ”Spara på den här enheten” sparas dina svar, markeringar och anteckningar i webbläsarens lokala lagring, och appen sparas i cacheminnet så att den fungerar utan internetförbindelse. Inget skickas någonstans. När du stänger av funktionen raderas allt.",
    accessibilityTitle: "Tillgänglighet",
    accessibility:
      "MovePilot är byggd för att uppfylla WCAG 2.1 på nivå AA: den fungerar med tangentbord och skärmläsare, färgerna uppfyller kontrastkraven och den följer din inställning för ljust eller mörkt läge. Har du hittat ett problem? Skapa ett ärende (issue) i projektets kodförråd.",
    sourcesTitle: "Källor",
    sourceItems: [
      { topic: "Flyttares kunskap om försäkringar", label: "Enkät av If, MTV Uutiset", href: "https://www.mtvuutiset.fi/artikkeli/tata-moni-ei-tieda-korvaako-kotivakuutus-muutoissa-sattuvat-vahingot/4737448" },
      { topic: "Läckageskador i Finland 2021", label: "Finanssiala via STT", href: "https://www.sttinfo.fi/tiedote/69941993/vuotovahingot-kaantyivat-nousuun-putkiremontin-suunnittelu-kannattaa-aloittaa-jo-ennen-kuin-putket-vanhenevat-kasiin" },
      { topic: "Orsaker till läckage och byggnadens ålder", label: "Pohjola, Verkkouutiset 2021", href: "https://www.verkkouutiset.fi/a/vuotovahingoista-voi-tulla-omakotiasujalle-huikea-lasku/" },
      { topic: "Hushållsmaskinernas ålder och genomsnittlig kostnad för en läckageskada", label: "Pohjola, Verkkouutiset 2024", href: "https://www.verkkouutiset.fi/a/yleinen-kodinkone-voi-aiheuttaa-jopa-100000-euron-vahingot/" },
      { topic: "Uppvärmningsenergi och rumstemperatur", label: "Motiva", href: "https://www.motiva.fi/tietopankki/kodin-energiatehokas-sahkolammitys/" },
      { topic: "Brandvarnare", label: "Inrikesministeriets förordning 300/2025, Finlex", href: "https://www.finlex.fi/fi/lainsaadanto/2025/300" },
      { topic: "Väderprognos", label: "Meteorologiska institutets öppna data, CC BY 4.0", href: "https://en.ilmatieteenlaitos.fi/open-data" },
    ],
    disclaimer:
      "Byggd under JunctionX Turku 2026. Planen ger allmän information, inte försäkringsrådgivning. Det är villkoren i din egen försäkring som avgör vad som ersätts.",
  },

  sources: {
    ifSurvey: "Enkät av If (MTV Uutiset)",
    leakClaims2021: "Läckagestatistik 2021 från Finanssiala (STT)",
    leakCauses: "Läckagedata från Pohjola (Verkkouutiset 2021)",
    applianceAge: "Data om hushållsmaskiner från Pohjola (Verkkouutiset 2024)",
    fmi: "Meteorologiska institutet, CC BY 4.0",
    motiva: "Motiva",
    smokeAlarm: "Förordning om brandvarnare 300/2025 (Finlex)",
  },

  cards: {
    coverCheck: {
      title: "Kontrollera att dina saker är försäkrade under flytten",
      known:
        "Du vet vilken nivå ditt försäkringsskydd har. Kontrollera att det täcker saker som går sönder under flytten. Vissa försäkringar täcker det bara på en bredare nivå.",
      unknown:
        "I en enkät av If trodde 38 % av dem som flyttat att deras saker inte var försäkrade under den senaste flytten. Kontrollera nivån på din försäkring före flyttdagen: saker som går sönder under flytten ersätts bara på vissa nivåer.",
    },
    declutter: {
      title: "Sälj, skänk eller återvinn det du inte tar med",
      body: "Varje låda som du inte flyttar sparar arbete med packningen, plats i flyttbilen och bränsle. Ge användbara saker till en återvinningscentral eller sälj dem. Lämna elektronik, batterier och gammal färg till en avgiftsfri insamlingsplats.",
      link: "Hitta en insamlingsplats",
    },
    boxes: {
      title: "Hyr flyttlådor som kan återanvändas",
      body: "Hyrda plastlådor används om och om igen, är säkra att stapla och hämtas efter flytten. Om du använder flyttkartonger, skaffa begagnade och lämna dem till kartonginsamlingen efteråt.",
    },
    officialNotice: {
      title: "Gör din officiella flyttanmälan",
      body: "Med en enda anmälan uppdateras uppgifterna i befolkningsdatasystemet och hos Posti. Du kan göra anmälan tidigast en månad före flytten och senast en vecka efter den.",
      link: "Flyttanmälan hos Posti",
    },
    insurerNotice: {
      title: "Meddela ditt försäkringsbolag den nya adressen och flyttdagen",
      body: "Din hemförsäkring bör gälla för båda hemmen på flyttdagen. Uppdatera adressen så att det nya hemmet är försäkrat från första natten.",
      link: "Flyttanmälan hos If",
    },
    electricity: {
      title: "Teckna elavtal för det nya hemmet",
      body: "Utan avtal kan strömmen vara avstängd när du kommer. Gör det senast en vecka före flytten. Att välja el från förnybara källor är en av de enklaste klimatåtgärderna i hemmet.",
    },
    internet: {
      title: "Beställ bredband eller flytta ditt abonnemang",
      body: "Kontrollera vilka anslutningar som finns på den nya adressen. En ny installation kan ta ett par veckor.",
    },
    washerOld: {
      title: (age: number) => `Din tvättmaskin är ${age} år gammal: byt slangarna innan du kopplar in den igen`,
    },
    dishwasherOld: {
      title: (age: number) => `Din diskmaskin är ${age} år gammal: byt slangarna innan du kopplar in den igen`,
    },
    applianceOldBody:
      "Risken för läckage från tvättmaskiner och diskmaskiner ökar från ungefär det fjärde året. Nya tilloppsslangar kostar lite jämfört med en genomsnittlig läckageskada i ett egnahemshus, cirka 8 500 euro.",
    washerCheck: { title: (age: number) => `Kontrollera slangarna på tvättmaskinen (${age} år gammal)` },
    dishwasherCheck: { title: (age: number) => `Kontrollera slangarna på diskmaskinen (${age} år gammal)` },
    applianceCheckBody:
      "Leta efter sprickor och stela ställen i tillopps- och avloppsslangen medan maskinen ändå är frånkopplad.",
    waterValve: {
      houseTitle: "Leta reda på huvudkranen för vattnet",
      apartmentTitle: "Leta reda på avstängningskranen för vattnet i din lägenhet",
      houseBody: (oldYear: number | null) =>
        `Vid ett läckage räknas varje minut. ${oldYear ? `Ditt hus är från ${oldYear}: nästan 70 % av läckagen sker i hus som byggts på 1980-talet eller tidigare. ` : ""}Leta reda på kranen innan du packar upp, och se till att alla i hemmet vet var den finns.`,
      apartmentBody:
        "Många lägenheter har en egen kran under diskbänken eller i badrummet. Om du inte hittar någon, fråga husbolaget vem du ska ringa vid ett läckage.",
    },
    meters: {
      title: "Läs av mätarna och kontrollera om det finns dolda läckor",
      houseBody:
        "Skriv ner elmätarens och vattenmätarens ställning för dina första räkningar. Stäng sedan alla kranar och håll ögonen på vattenmätaren i några minuter. Om den fortfarande rör sig kan det finnas en dold läcka.",
      apartmentBody:
        "Skriv ner elmätarens ställning för ditt elavtal. Om lägenheten har en egen vattenmätare, stäng alla kranar och håll ögonen på mätaren i några minuter. Om den fortfarande rör sig kan det finnas en dold läcka.",
    },
    reconnect: {
      title: "Koppla in maskinerna igen och håll koll på den första körningen",
      body: "Cirka 60 % av läckagen börjar i vattenrör och hushållsmaskiner. Stanna i närheten under den första tvätten och det första diskprogrammet, och kontrollera att det inte droppar vid anslutningarna.",
    },
    photos: {
      title: "Fotografera dina saker och skicket i det nya hemmet",
      body: "Med foton som du tar när du kommer fram går det snabbare att anmäla skador från flytten. De visar också hur hemmet såg ut när du fick nycklarna.",
    },
    smokeAlarm: {
      title: "Testa brandvarnarna",
      body: "En bostad ska ha minst en brandvarnare för varje påbörjad 60 kvadratmeter på varje våning. Testa dem under den första veckan. I ett husbolag sköter bolaget brandvarnarna, så anmäl en trasig brandvarnare eller ett urladdat batteri till husbolaget genast.",
    },
    pipeHistory: {
      houseTitle: "Ta reda på när rören senast förnyades",
      apartmentTitle: "Fråga husbolaget om planen för rörrenovering",
      houseBody: (year: number) =>
        `Ditt hus är från ${year}. Leta i säljarens handlingar eller i husets servicebok efter när den senaste rörrenoveringen gjordes. Om ingen har gjorts, planera en.`,
      apartmentBody: (year: number) =>
        `Byggnaden är från ${year}. Fråga när rörrenoveringen är planerad, så att du vet vad som väntar.`,
    },
    leakSensor: {
      title: "Placera en läckagevakt under diskmaskinen och diskbänken",
      body: "Läckageskador var den vanligaste skadetypen inom hemförsäkringen i Finland 2021: 34 800 skadefall som kostade 171 miljoner euro. En vakt som larmar vid de första dropparna gör att du hinner stänga av vattnet innan skadan sprider sig.",
    },
    heating: {
      title: "Ställ in rumstemperaturen och håll luftventilerna öppna",
      body: "Cirka 21 °C räcker i vardagsrum och 18–20 °C i sovrum. Varje grad lägre sparar cirka 5 % av uppvärmningsenergin. Stäng inte luftventilerna, eftersom det leder till fukt och mögel.",
    },
    waste: {
      title: "Lär dig avfallssorteringen på den nya adressen",
      body: "Kärlen skiljer sig mellan husbolag och kommuner. Kontrollera vilka avfallsslag som samlas in vid fastigheten och var närmaste återvinningspunkt finns.",
      link: "Hitta en återvinningspunkt",
    },
    frost: {
      title: (city: string, date: string, temp: string) => `Frost väntas i ${city}: ${date} (${temp} °C)`,
      house:
        "Håll källaren, krypgrunden och tomma rum uppvärmda, och töm utekranen och trädgårdsslangen på vatten. Frusna rör spricker när de tinar.",
      apartment:
        "Håll värmen på i alla rum, även i dem som ännu är fulla av lådor, och stäng fönster som stått öppna under flytten.",
    },
    wind: {
      title: (date: string, speed: string) => `Hård vind väntas: ${date} (upp till ${speed} m/s)`,
      body: "Förankra trädgårdsmöblerna och allt annat som lämnats ute efter flytten, och ta in flyttlådor som förvaras på balkongen.",
    },
    rain: {
      title: (date: string, mm: string) => `Kraftigt regn väntas: ${date} (${mm} mm)`,
      house: "Kontrollera att takrännor och stuprör är fria och att vattnet rinner bort från grunden.",
      apartment: "Ställ inte lådor direkt på golvet i förråden, och stäng balkonginglasningen.",
    },
    season: {
      title: "Den första vintern i det nya hemmet",
      house: "Ta reda på hur källaren och krypgrunden värms upp, och töm utekranarna innan den första frosten kommer.",
      apartment: "Kontrollera att elementen fungerar i alla rum innan den första frosten kommer.",
    },
    forecastCheck: {
      title: "Kontrollera väderprognosen två dagar före",
      body: "Prognoserna sträcker sig bara några dagar framåt. Kontrollera två dagar före flytten om det väntas regn (skydda lådorna), frost (håll värmen på) eller hård vind.",
    },
    weatherFmi: "Prognos: Meteorologiska institutet.",
    weatherSaved: "Sparad prognos från Meteorologiska institutet (aktuella data kunde inte hämtas).",
    weatherSample: "Exempelprognos (aktuella data kunde inte hämtas).",
  },
};
