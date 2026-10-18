import type { Card, Forecast, MoveInput, Phase } from "./types";
import { esc, formatDate } from "./util";

const PHASES: { id: Phase; title: string; when: (i: MoveInput) => string }[] = [
  { id: "before", title: "Before the move", when: () => "Now until moving day" },
  { id: "moving-day", title: "Moving day", when: (i) => formatDate(i.moveDate) },
  { id: "first-30", title: "First 30 days", when: () => "In the new home" },
];

const TAG_LABEL: Record<NonNullable<Card["tag"]>, string> = {
  insurance: "Cover",
  leak: "Leak risk",
  weather: "Weather",
  admin: "Admin",
  safety: "Safety",
};

export function renderLoading(root: HTMLElement, city: string): void {
  root.innerHTML = `
    <section class="screen" aria-busy="true">
      <p class="step">Step 2 of 3</p>
      <h1 tabindex="-1">Building your plan…</h1>
      <p class="lead" role="status">Checking the weather in ${esc(city)}.</p>
    </section>`;
}

export function renderPlan(
  root: HTMLElement,
  input: MoveInput,
  forecast: Forecast | null,
  cards: Card[],
  done: Set<string>,
  actions: { onToggle: (id: string) => void; onBack: () => void; onNext: () => void },
): void {
  const high = cards.filter((c) => c.priority === "high").length;
  const doneCount = cards.filter((c) => done.has(c.id)).length;

  root.innerHTML = `
    <section class="screen wide">
      <p class="step">Step 2 of 3</p>
      <h1 tabindex="-1">Your move to ${esc(input.city)}</h1>
      <p class="lead">${cards.length} things to do, ${high} of them important for your home.
        ${forecastNote(forecast)}</p>
      <p class="sr-only" role="status" aria-live="polite">${doneCount} of ${cards.length} done.</p>

      <div class="timeline">
        ${PHASES.map((p) => {
          const phaseCards = cards
            .filter((c) => c.phase === p.id)
            .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "high" ? -1 : 1));
          return `
          <section class="phase" aria-labelledby="phase-${p.id}">
            <header>
              <h2 id="phase-${p.id}">${p.title}</h2>
              <span class="when">${esc(p.when(input))}</span>
            </header>
            <ul class="cards">${phaseCards.map((c) => cardHtml(c, done.has(c.id))).join("")}</ul>
          </section>`;
        }).join("")}
      </div>

      <div class="actions">
        <button type="button" class="secondary" id="back">Change answers</button>
        <button type="button" class="primary" id="next">See summary</button>
      </div>
    </section>`;

  root.querySelectorAll<HTMLInputElement>("input[data-card]").forEach((box) =>
    box.addEventListener("change", () => actions.onToggle(box.dataset.card!)),
  );
  root.querySelector("#back")!.addEventListener("click", actions.onBack);
  root.querySelector("#next")!.addEventListener("click", actions.onNext);
}

function cardHtml(card: Card, isDone: boolean): string {
  const id = `card-${esc(card.id)}`;
  const links = [
    card.link
      ? `<a href="${esc(card.link.href)}" target="_blank" rel="noopener">${esc(card.link.label)}<span class="sr-only"> (opens in a new tab)</span> ↗</a>`
      : "",
    card.source
      ? `<a class="source" href="${esc(card.source.href)}" target="_blank" rel="noopener">Source: ${esc(card.source.label)}<span class="sr-only"> (opens in a new tab)</span></a>`
      : "",
  ].filter(Boolean);

  return `
    <li class="card ${card.priority === "high" ? "high" : ""} ${isDone ? "done" : ""}">
      <span class="check">
        <input type="checkbox" id="${id}-check" data-card="${esc(card.id)}" ${isDone ? "checked" : ""}
               aria-labelledby="${id}-title" aria-describedby="${id}-body" />
      </span>
      <div>
        ${card.tag ? `<span class="tag tag-${card.tag}">${TAG_LABEL[card.tag]}</span>` : ""}
        ${card.priority === "high" ? `<span class="important">Important</span>` : ""}
        <h3 id="${id}-title">${esc(card.title)}</h3>
        <p id="${id}-body">${esc(card.body)}</p>
        ${links.length ? `<div class="links">${links.join("")}</div>` : ""}
      </div>
    </li>`;
}

function forecastNote(forecast: Forecast | null): string {
  if (!forecast) return "Weather forecast unavailable.";
  if (forecast.source === "fmi") return "Live weather from the Finnish Meteorological Institute.";
  return "Live weather unavailable, so the plan uses a saved forecast.";
}
