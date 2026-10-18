import type { Card, Forecast, MoveInput, Phase, Tag } from "./types";
import { locale, t } from "./i18n";
import { icon, type IconName } from "./icons";
import { isFrost, isHeavyRain, isStrongWind, moveWindow } from "./rules";
import { stepper } from "./shell";
import { daysBetween, esc, formatDate, formatNumber } from "./util";

export type Filter = Tag | "all";

export const TAG_ICON: Record<Tag, IconName> = {
  insurance: "shield",
  leak: "drop",
  weather: "cloud",
  admin: "file",
  safety: "alarm",
  green: "leaf",
};

const TAG_ORDER: Tag[] = ["leak", "insurance", "weather", "green", "admin", "safety"];
const PHASES: Phase[] = ["before", "moving-day", "first-30"];

export interface PlanView {
  input: MoveInput;
  forecast: Forecast | null;
  cards: Card[];
  done: Set<string>;
  filter: Filter;
  remember: boolean;
  today: string;
}

export interface PlanActions {
  onToggle: (id: string) => void;
  onFilter: (filter: Filter) => void;
  onRemember: (on: boolean) => void;
  onCalendar: () => void;
  onPrint: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function renderLoading(root: HTMLElement, city: string): void {
  const m = t();
  root.innerHTML = `
    <div class="page">
      ${stepper(2)}
      <section class="loading panel" aria-busy="true">
        <span class="spinner" aria-hidden="true"></span>
        <h1 tabindex="-1">${esc(m.loading.title)}</h1>
        <p class="lead">${esc(m.loading.status(city))}</p>
        <ul class="skeleton" aria-hidden="true"><li></li><li></li><li></li></ul>
      </section>
    </div>`;
}

export function renderPlan(root: HTMLElement, view: PlanView, actions: PlanActions): void {
  const m = t();
  const p = m.plan;
  const { input, cards, done } = view;
  const high = cards.filter((c) => c.priority === "high").length;
  const doneCount = cards.filter((c) => done.has(c.id)).length;
  const openHigh = cards.filter((c) => c.priority === "high" && !done.has(c.id)).length;
  const days = daysBetween(view.today, input.moveDate);
  const tags = TAG_ORDER.filter((tag) => cards.some((c) => c.tag === tag));
  const visible = (c: Card) => view.filter === "all" || c.tag === view.filter;

  root.innerHTML = `
    <div class="page wide">
      ${stepper(2)}

      <header class="plan-hero">
        <div class="plan-hero-text">
          <p class="chip chip-on-dark">${icon("clock", "icon icon-sm")} ${esc(p.countdown(days))} · ${esc(formatDate(input.moveDate, locale()))}</p>
          <h1 tabindex="-1">${esc(p.title(input.city))}</h1>
          <p class="lead">${esc(p.lead(cards.length, high))} ${esc(forecastNote(view.forecast))}</p>
        </div>
        <div class="progress-card">
          <div class="progress-head">
            <span id="progress-label">${esc(p.progressLabel)}</span>
            <strong>${esc(p.progress(doneCount, cards.length))}</strong>
          </div>
          <progress max="${cards.length}" value="${doneCount}" aria-labelledby="progress-label"></progress>
          <p class="progress-sub">${icon(openHigh ? "alert" : "check", "icon icon-sm")} ${esc(p.openImportant(openHigh))}</p>
        </div>
      </header>

      ${forecastStrip(view)}

      <div class="toolbar">
        <div class="filters" role="group" aria-label="${esc(p.filterLabel)}">
          ${filterButton("all", p.filterAll, cards.length, view.filter)}
          ${tags.map((tag) => filterButton(tag, m.tags[tag], cards.filter((c) => c.tag === tag).length, view.filter)).join("")}
        </div>
        <div class="tools">
          <button type="button" class="btn btn-ghost" id="calendar" ${doneCount === cards.length ? "disabled" : ""}>${icon("calendar")} ${esc(p.calendar)}</button>
          <button type="button" class="btn btn-ghost" id="print">${icon("printer")} ${esc(p.print)}</button>
        </div>
      </div>

      <div class="remember panel-soft">
        <label class="switch">
          <input type="checkbox" role="switch" id="remember" aria-describedby="remember-hint" ${view.remember ? "checked" : ""} />
          <span class="switch-track" aria-hidden="true"></span>
          <span class="switch-label">${esc(p.remember)}</span>
        </label>
        <p class="hint" id="remember-hint">${esc(p.rememberHint)}</p>
      </div>

      <div class="timeline">
        ${PHASES.map((phase) => {
          const all = cards.filter((c) => c.phase === phase).sort(byDue);
          const shown = all.filter(visible);
          const phaseDone = all.filter((c) => done.has(c.id)).length;
          return `
          <section class="phase phase-${phase}" aria-labelledby="phase-${phase}">
            <header class="phase-head">
              <div>
                <h2 id="phase-${phase}">${esc(phaseTitle(phase))}</h2>
                <p class="when">${esc(phaseWhen(phase, input))}</p>
              </div>
              <span class="phase-count">${esc(p.phaseCount(phaseDone, all.length))}</span>
            </header>
            ${
              shown.length
                ? `<ul class="cards">${shown.map((c) => cardHtml(c, done.has(c.id), view.today)).join("")}</ul>`
                : `<p class="empty">${esc(p.empty)}</p>`
            }
          </section>`;
        }).join("")}
      </div>

      <div class="actions">
        <button type="button" class="btn btn-secondary" id="back">${icon("arrowLeft")} ${esc(p.back)}</button>
        <button type="button" class="btn btn-primary" id="next">${esc(p.next)} ${icon("arrowRight")}</button>
      </div>
    </div>`;

  root.querySelectorAll<HTMLInputElement>("input[data-card]").forEach((box) =>
    box.addEventListener("change", () => actions.onToggle(box.dataset.card!)),
  );
  root.querySelectorAll<HTMLButtonElement>("button[data-filter]").forEach((btn) =>
    btn.addEventListener("click", () => actions.onFilter(btn.dataset.filter as Filter)),
  );
  root.querySelector<HTMLInputElement>("#remember")!.addEventListener("change", (e) =>
    actions.onRemember((e.target as HTMLInputElement).checked),
  );
  root.querySelector("#calendar")!.addEventListener("click", actions.onCalendar);
  root.querySelector("#print")!.addEventListener("click", actions.onPrint);
  root.querySelector("#back")!.addEventListener("click", actions.onBack);
  root.querySelector("#next")!.addEventListener("click", actions.onNext);
}

const byDue = (a: Card, b: Card) =>
  a.due.localeCompare(b.due) || (a.priority === b.priority ? 0 : a.priority === "high" ? -1 : 1);

function phaseTitle(phase: Phase): string {
  const ph = t().phases;
  return phase === "before" ? ph.before.title : phase === "moving-day" ? ph.movingDay.title : ph.first30.title;
}

function phaseWhen(phase: Phase, input: MoveInput): string {
  const ph = t().phases;
  return phase === "before" ? ph.before.when : phase === "moving-day" ? formatDate(input.moveDate, locale()) : ph.first30.when;
}

function filterButton(value: Filter, label: string, count: number, current: Filter): string {
  return `
    <button type="button" class="filter ${value === "all" ? "" : `tag-${value}`}" data-filter="${value}" aria-pressed="${value === current}">
      ${value === "all" ? "" : icon(TAG_ICON[value], "icon icon-sm")}
      <span>${esc(label)}</span><span class="count">${count}</span>
    </button>`;
}

function dueLabel(card: Card, isDone: boolean, today: string): { text: string; overdue: boolean } {
  const p = t().plan;
  const date = formatDate(card.due, locale());
  if (!isDone && card.due < today) return { text: p.overdue(date), overdue: true };
  if (card.due === today) return { text: p.dueToday, overdue: false };
  return { text: p.dueBy(date), overdue: false };
}

function cardHtml(card: Card, isDone: boolean, today: string): string {
  const m = t();
  const id = `card-${esc(card.id)}`;
  const due = dueLabel(card, isDone, today);
  const newTab = `<span class="sr-only"> ${esc(m.plan.newTab)}</span>`;
  const links = [
    card.link
      ? `<a href="${esc(card.link.href)}" target="_blank" rel="noopener">${esc(card.link.label)}${newTab}${icon("external", "icon icon-xs")}</a>`
      : "",
    card.source
      ? `<a class="source" href="${esc(card.source.href)}" target="_blank" rel="noopener">${esc(m.plan.source)}: ${esc(card.source.label)}${newTab}</a>`
      : "",
  ].filter(Boolean);

  return `
    <li class="card tag-${card.tag} ${card.priority === "high" ? "high" : ""} ${isDone ? "done" : ""}">
      <input type="checkbox" class="check" id="${id}-check" data-card="${esc(card.id)}" ${isDone ? "checked" : ""}
             aria-describedby="${id}-meta ${id}-body" />
      <div class="card-main">
        <div class="card-meta" id="${id}-meta">
          <span class="tag tag-${card.tag}">${icon(TAG_ICON[card.tag], "icon icon-xs")} ${esc(m.tags[card.tag])}</span>
          ${card.priority === "high" ? `<span class="badge">${esc(m.plan.important)}</span>` : ""}
          <span class="due ${due.overdue ? "overdue" : ""}">${icon("clock", "icon icon-xs")} ${esc(due.text)}</span>
        </div>
        <h3><label for="${id}-check">${esc(card.title)}</label></h3>
        <p id="${id}-body">${esc(card.body)}</p>
        ${links.length ? `<div class="links">${links.join("")}</div>` : ""}
      </div>
    </li>`;
}

function forecastStrip(view: PlanView): string {
  const p = t().plan;
  const days = moveWindow(view.input, view.forecast);
  if (!days.length) return "";
  const loc = locale();
  const num = (n: number | null, unit: string) => (n === null ? "–" : `${formatNumber(n, loc)} ${unit}`);

  return `
    <section class="forecast" aria-labelledby="forecast-title">
      <h2 id="forecast-title">${icon("cloud", "icon icon-sm")} ${esc(p.forecastTitle)}</h2>
      <ul class="forecast-days">
        ${days
          .map((d) => {
            const alerts = [
              isFrost(d) ? p.alertFrost : "",
              isStrongWind(d) ? p.alertWind : "",
              isHeavyRain(d) ? p.alertRain : "",
            ].filter(Boolean);
            const isMoveDay = d.date === view.input.moveDate;
            return `
            <li class="forecast-day ${alerts.length ? "alert" : ""} ${isMoveDay ? "move-day" : ""}">
              <span class="forecast-date">${esc(formatDate(d.date, loc))}${isMoveDay ? ` · ${esc(t().phases.movingDay.title)}` : ""}</span>
              <span class="forecast-row">${icon("thermo", "icon icon-xs")} ${esc(p.forecastLow)} <strong>${esc(num(d.minTemp, "°C"))}</strong></span>
              <span class="forecast-row">${icon("wind", "icon icon-xs")} ${esc(p.forecastWind)} <strong>${esc(num(d.maxWind, "m/s"))}</strong></span>
              <span class="forecast-row">${icon("rain", "icon icon-xs")} ${esc(p.forecastRain)} <strong>${esc(num(d.rainMm, "mm"))}</strong></span>
              ${alerts.length ? `<span class="forecast-alerts">${alerts.map((a) => `<span class="pill">${icon("alert", "icon icon-xs")} ${esc(a)}</span>`).join("")}</span>` : ""}
            </li>`;
          })
          .join("")}
      </ul>
    </section>`;
}

function forecastNote(forecast: Forecast | null): string {
  const p = t().plan;
  if (!forecast) return p.forecastNone;
  return forecast.source === "fmi" ? p.forecastFmi : p.forecastSaved;
}
