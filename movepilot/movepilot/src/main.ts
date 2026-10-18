import "./styles.css";
import { renderForm } from "./form";
import { renderLoading, renderPlan } from "./plan";
import { renderSummary } from "./summary";
import { buildPlan } from "./rules";
import type { Card, Forecast, MoveInput } from "./types";

type Screen = "form" | "plan" | "summary";

const state = {
  screen: "form" as Screen,
  input: null as MoveInput | null,
  forecast: null as Forecast | null,
  cards: [] as Card[],
  done: new Set<string>(),
};

const root = document.querySelector<HTMLElement>("#app")!;

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
    renderPlan(root, state.input, state.forecast, state.cards, state.done, {
      onToggle: toggle,
      onBack: () => go("form"),
      onNext: () => go("summary"),
    });
    return;
  }
  renderSummary(root, state.input, state.cards, state.done, {
    onBack: () => go("plan"),
    onRestart: () => {
      state.input = null;
      state.done.clear();
      go("form");
    },
  });
}

async function submit(input: MoveInput): Promise<void> {
  state.input = input;
  renderLoading(root, input.city);
  state.forecast = await getForecast(input.city);
  state.cards = buildPlan(input, state.forecast);
  go("plan");
}

function toggle(id: string): void {
  if (state.done.has(id)) state.done.delete(id);
  else state.done.add(id);
  render();
  // Keep keyboard focus on the checkbox that was just toggled.
  root.querySelector<HTMLInputElement>(`input[data-card="${CSS.escape(id)}"]`)?.focus();
}

async function getForecast(city: string): Promise<Forecast | null> {
  try {
    const res = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
    if (!res.ok) return null;
    return (await res.json()) as Forecast;
  } catch {
    return null;
  }
}

render();
