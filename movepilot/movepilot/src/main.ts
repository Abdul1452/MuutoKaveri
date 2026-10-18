import "./styles.css";
import { renderForm } from "./form";
import { renderLoading, renderPlan, type Filter } from "./plan";
import { renderSummary } from "./summary";
import { renderFooter, renderHeader } from "./shell";
import { buildPlan } from "./rules";
import { buildIcs, downloadFile } from "./ics";
import { currentLang, detectLang, locale, setLang, t } from "./i18n";
import { emptyNotes, enableOffline, forget, loadSaved, save } from "./storage";
import { todayIso } from "./util";
import type { Card, Forecast, HomeNotes, Lang, MoveInput } from "./types";

type Screen = "form" | "plan" | "summary";

const state = {
  screen: "form" as Screen,
  input: null as MoveInput | null,
  forecast: null as Forecast | null,
  cards: [] as Card[],
  done: new Set<string>(),
  notes: emptyNotes(),
  filter: "all" as Filter,
  remember: false,
};

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

function go(screen: Screen): void {
  state.screen = screen;
  render();
  window.scrollTo({ top: 0 });
  // Move focus to the new heading so screen-reader and keyboard users hear the screen change.
  root.querySelector<HTMLElement>("h1")?.focus();
}

function render(): void {
  if (state.screen === "form" || !state.input) {
    renderForm(root, state.input, submit);
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
  renderHeader(header, changeLang);
  renderFooter(footer);
}

function rebuild(): void {
  if (state.input) state.cards = buildPlan(state.input, state.forecast, t(), locale());
}

function persist(): void {
  if (!state.remember || !state.input) return;
  save({ input: state.input, done: [...state.done], notes: state.notes, lang: currentLang() });
}

async function submit(input: MoveInput): Promise<void> {
  state.input = input;
  renderLoading(root, input.city);
  root.querySelector<HTMLElement>("h1")?.focus();
  state.forecast = await getForecast(input.city);
  rebuild();
  persist();
  go("plan");
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
  const ics = buildIcs(open, t().plan.calendarName(state.input.city));
  const slug = state.input.city.toLowerCase().replace(/[^\p{L}]+/gu, "-");
  downloadFile(`movepilot-${slug}.ics`, ics, "text/calendar;charset=utf-8");
  announce(t().plan.calendarDone);
}

function updateNote(key: keyof HomeNotes, value: string): void {
  state.notes[key] = value.slice(0, 120);
  persist();
}

async function restart(): Promise<void> {
  if (!window.confirm(t().summary.restartConfirm)) return;
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

async function changeLang(next: Lang): Promise<void> {
  try {
    await setLang(next);
  } catch {
    return; // the language file couldn't load (offline); keep the current language
  }
  rebuild();
  renderShell();
  render();
  persist();
  header.querySelector<HTMLSelectElement>("#lang")?.focus();
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
  const saved = loadSaved();
  try {
    await setLang(saved?.lang ?? detectLang());
  } catch {
    await setLang("en");
  }
  renderShell();

  if (saved) {
    state.remember = true;
    state.input = saved.input;
    state.done = new Set(saved.done);
    state.notes = saved.notes;
    renderLoading(root, saved.input.city);
    state.forecast = await getForecast(saved.input.city);
    rebuild();
    state.screen = "plan";
    void enableOffline();
  }
  render();
}

void start();
