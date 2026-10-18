import "./styles.css";
import { renderForm } from "./form";
import { renderLoading, renderPlan, type Filter } from "./plan";
import { renderSummary } from "./summary";
import { renderFooter, renderHeader, updateNav, updateThemeSwitch, visibleLangPicker } from "./shell";
import { createTour } from "./tour";
import { buildPlan } from "./rules";
import { buildIcs, downloadFile } from "./ics";
import { currentLang, detectLang, locale, setLang, t } from "./i18n";
import { emptyNotes, enableOffline, forget, loadSaved, save } from "./storage";
import { chosenTheme, currentTheme, onSystemThemeChange, setTheme } from "./theme";
import { todayIso } from "./util";
import type { Card, Forecast, HomeNotes, Lang, MoveInput, Screen } from "./types";

const state = {
  screen: "form" as Screen,
  input: null as MoveInput | null,
  forecast: null as Forecast | null,
  cards: [] as Card[],
  done: new Set<string>(),
  notes: emptyNotes(),
  filter: "all" as Filter,
  remember: false,
  // The tour invitation is shown until it is used or dismissed. Remembered only when saving is on.
  tourSeen: false,
};

// Each forecast request gets a number; a slower, older response is ignored.
let forecastRequest = 0;

const root = document.querySelector<HTMLElement>("#app")!;
const header = document.querySelector<HTMLElement>("#top")!;
const footer = document.querySelector<HTMLElement>("#foot")!;
const live = document.querySelector<HTMLElement>("#live")!;

/** Tells screen-reader users about changes that don't move focus. */
function announce(text: string): void {
  live.textContent = "";
  // A fresh text node in the next frame makes repeated messages announce again.
  requestAnimationFrame(() => (live.textContent = text));
}

const tour = createTour({
  screen: () => state.screen,
  goTo: (screen) => {
    // Re-showing the form (to start the tour) keeps what the user has typed so far.
    const draft = screen === "form" && state.screen === "form" ? snapshotForm() : [];
    go(screen);
    restoreForm(draft);
  },
  submit: () => {
    const form = root.querySelector<HTMLFormElement>("#move-form");
    form?.requestSubmit();
    return state.screen === "loading"; // the submit handler starts loading only when the answers are valid
  },
  onEnd: markTourSeen,
});

function markTourSeen(): void {
  state.tourSeen = true;
  persist();
}

function go(screen: Screen): void {
  state.screen = screen;
  render();
  // During the tour, the tour scrolls to its step and moves focus to its dialog instead.
  if (tour.active()) return;
  window.scrollTo({ top: 0 });
  // Move focus to the new heading so screen-reader and keyboard users hear the screen change.
  root.querySelector<HTMLElement>("h1")?.focus();
}

function render(): void {
  draw();
  updateNav(header, state.screen, state.cards.length > 0);
  tour.sync();
}

function draw(): void {
  if (state.screen === "loading" && state.input) {
    renderLoading(root, state.input.city);
    return;
  }
  if (state.screen === "form" || !state.input) {
    renderForm(root, state.input, submit, {
      tourBanner: !state.tourSeen && !tour.active(),
      onStartTour: () => tour.start(),
      onDismissTour: () => {
        markTourSeen();
        render();
        root.querySelector<HTMLElement>("h1")?.focus();
      },
    });
    return;
  }
  if (state.screen === "plan") {
    renderPlan(
      root,
      {
        input: state.input,
        forecast: state.forecast,
        cards: state.cards,
        done: state.done,
        filter: state.filter,
        remember: state.remember,
        today: todayIso(),
      },
      {
        onToggle: toggle,
        onFilter: setFilter,
        onRemember: setRemember,
        onCalendar: exportCalendar,
        onPrint: printPlan,
        onBack: () => go("form"),
        onNext: () => go("summary"),
      },
    );
    return;
  }
  renderSummary(
    root,
    { input: state.input, cards: state.cards, done: state.done, notes: state.notes, remember: state.remember },
    { onNote: updateNote, onBack: () => go("plan"), onRestart: restart },
  );
}

function renderShell(): void {
  renderHeader(header, {
    onLang: changeLang,
    onNav: (screen) => {
      // Ignored while a plan is loading (its result would pull the user back), and for the current tool.
      if (state.screen === "loading" || screen === state.screen) return;
      if (screen === "form" || state.cards.length) go(screen);
    },
    onTour: () => {
      if (state.screen !== "loading") tour.start();
    },
    onTheme: toggleTheme,
  });
  updateThemeSwitch(header, currentTheme() === "dark");
  renderFooter(footer);
}

function toggleTheme(): void {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
  updateThemeSwitch(header, currentTheme() === "dark");
  persist();
}

function rebuild(): void {
  if (state.input) state.cards = buildPlan(state.input, state.forecast, t(), locale());
}

function persist(): void {
  if (!state.remember || !state.input) return;
  save({
    input: state.input,
    done: [...state.done],
    notes: state.notes,
    lang: currentLang(),
    theme: chosenTheme(),
    tourSeen: state.tourSeen,
  });
}

/** Fetches the forecast for the current answers and shows the plan, unless a newer request took over. */
async function loadPlan(input: MoveInput): Promise<void> {
  const request = ++forecastRequest;
  state.input = input;
  go("loading");
  const forecast = await getForecast(input.city);
  if (request !== forecastRequest) return;
  state.forecast = forecast;
  rebuild();
  persist();
  go("plan");
}

function submit(input: MoveInput): void {
  void loadPlan(input);
}

function toggle(id: string): void {
  if (state.done.has(id)) state.done.delete(id);
  else state.done.add(id);
  persist();
  render();
  // Keep keyboard focus on the checkbox that was just toggled.
  root.querySelector<HTMLInputElement>(`input[data-card="${CSS.escape(id)}"]`)?.focus();
  const done = state.cards.filter((c) => state.done.has(c.id)).length;
  announce(t().plan.progress(done, state.cards.length));
}

function setFilter(filter: Filter): void {
  state.filter = filter;
  render();
  root.querySelector<HTMLButtonElement>(`button[data-filter="${CSS.escape(filter)}"]`)?.focus();
  const shown = state.cards.filter((c) => filter === "all" || c.tag === filter).length;
  announce(t().plan.filterShown(shown));
}

async function setRemember(on: boolean): Promise<void> {
  state.remember = on;
  if (on) {
    persist();
    void enableOffline(); // in the background; the switch responds at once
  } else {
    await forget();
  }
  render();
  root.querySelector<HTMLInputElement>("#remember")?.focus();
  announce(on ? t().plan.rememberOn : t().plan.rememberOff);
}

function exportCalendar(): void {
  if (!state.input) return;
  const open = state.cards.filter((c) => !state.done.has(c.id));
  if (!open.length) return; // the button is disabled then; a calendar file must have at least one event
  const ics = buildIcs(open, t().plan.calendarName(state.input.city));
  const slug = state.input.city.toLowerCase().replace(/[^\p{L}]+/gu, "-");
  downloadFile(`muutokaveri-${slug}.ics`, ics, "text/calendar;charset=utf-8");
  announce(t().plan.calendarDone);
}

// The printout is the moving-day checklist, so it always has every card, whatever filter is on screen.
function showAllForPrint(): void {
  if (state.screen === "plan" && state.filter !== "all") {
    state.filter = "all";
    render();
  }
}

function printPlan(): void {
  showAllForPrint();
  window.print();
}

function updateNote(key: keyof HomeNotes, value: string): void {
  state.notes[key] = value.slice(0, 120);
  persist();
}

async function restart(): Promise<void> {
  if (!window.confirm(t().summary.restartConfirm)) return;
  forecastRequest++;
  state.input = null;
  state.forecast = null;
  state.cards = [];
  state.done.clear();
  state.notes = emptyNotes();
  state.filter = "all";
  if (state.remember) {
    state.remember = false;
    await forget();
  }
  go("form");
}

type FieldValue = { name: string; value: string; checked: boolean };

/** What the user has typed in the form so far, so a re-render (language change) doesn't lose it. */
function snapshotForm(): FieldValue[] {
  return [...root.querySelectorAll<HTMLInputElement>("#move-form input[name]")].map((el) => ({
    name: el.name,
    value: el.value,
    checked: el.checked,
  }));
}

function restoreForm(values: FieldValue[]): void {
  for (const v of values) {
    const el = [...root.querySelectorAll<HTMLInputElement>(`#move-form input[name="${CSS.escape(v.name)}"]`)].find(
      (input) => input.type !== "radio" || input.value === v.value,
    );
    if (!el) continue;
    if (el.type === "radio") el.checked = v.checked || el.checked;
    else el.value = v.value;
  }
}

async function changeLang(next: Lang): Promise<void> {
  const draft = state.screen === "form" ? snapshotForm() : [];
  try {
    if (!(await setLang(next))) return; // a later choice replaced this one
  } catch {
    // The language file couldn't load (offline): keep the current language and say so in the picker.
    header.querySelectorAll<HTMLSelectElement>("select[data-lang]").forEach((s) => (s.value = currentLang()));
    return;
  }
  rebuild();
  renderShell();
  render();
  restoreForm(draft);
  persist();
  visibleLangPicker(header)?.focus();
}

async function getForecast(city: string): Promise<Forecast | null> {
  try {
    const res = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const data = (await res.json()) as Forecast;
    return Array.isArray(data?.days) ? data : null;
  } catch {
    return null;
  }
}

async function start(): Promise<void> {
  window.addEventListener("beforeprint", showAllForPrint);
  const saved = loadSaved();
  if (saved?.theme) setTheme(saved.theme);
  // While no mode is chosen, the switch follows the system setting as it changes (e.g. at sunset).
  onSystemThemeChange(() => updateThemeSwitch(header, currentTheme() === "dark"));
  try {
    await setLang(saved?.lang ?? detectLang());
  } catch {
    await setLang("en");
  }
  renderShell();

  if (!saved) {
    render();
    // Nothing saved, so nothing may stay on the device: remove an offline cache left behind earlier.
    void forget();
    return;
  }
  state.remember = true;
  state.tourSeen = saved.tourSeen;
  state.done = new Set(saved.done);
  state.notes = saved.notes;
  void enableOffline();
  await loadPlan(saved.input);
}

void start();
