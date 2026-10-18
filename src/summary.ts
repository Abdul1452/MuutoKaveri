import type { Card, HomeNotes, MoveInput } from "./types";
import { locale, t } from "./i18n";
import { icon, type IconName } from "./icons";
import { IF_MOVE_NOTICE, leakRiskReasons } from "./rules";
import { TAG_ICON } from "./plan";
import { stepper } from "./shell";
import { esc, formatDate } from "./util";

export interface SummaryView {
  input: MoveInput;
  cards: Card[];
  done: Set<string>;
  notes: HomeNotes;
  remember: boolean;
}

export interface SummaryActions {
  onNote: (key: keyof HomeNotes, value: string) => void;
  onBack: () => void;
  onRestart: () => void;
}

export function renderSummary(root: HTMLElement, view: SummaryView, actions: SummaryActions): void {
  const m = t();
  const s = m.summary;
  const { input, cards, done, notes } = view;
  const openHigh = cards.filter((c) => c.priority === "high" && !done.has(c.id));
  const doneCount = cards.filter((c) => done.has(c.id)).length;
  const reasons = leakRiskReasons(input, m);
  const newTab = `<span class="sr-only"> ${esc(m.plan.newTab)}</span>`;

  const noteField = (key: keyof HomeNotes, label: string, iconName: IconName, opts: { placeholder?: string; type?: string; inputmode?: string } = {}) => `
    <div class="field">
      <label for="note-${key}">${icon(iconName, "icon icon-sm")} ${esc(label)}</label>
      <input id="note-${key}" data-note="${key}" type="${opts.type ?? "text"}" maxlength="120" autocomplete="off"
             ${opts.inputmode ? `inputmode="${opts.inputmode}"` : ""}
             ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ""} value="${esc(notes[key])}" />
    </div>`;

  root.innerHTML = `
    <div class="page">
      ${stepper(3)}

      <header class="summary-hero">
        <p class="eyebrow">${esc(s.eyebrow)}</p>
        <h1 tabindex="-1">${esc(s.title(formatDate(input.moveDate, locale())))}</h1>
        <p class="lead">${esc(s.progress(doneCount, cards.length))}</p>
        <progress max="${cards.length}" value="${doneCount}" aria-label="${esc(m.plan.progressLabel)}"></progress>
      </header>

      ${
        openHigh.length
          ? `<section class="panel open-items" aria-labelledby="open-title">
              <h2 id="open-title">${icon("alert", "icon")} ${esc(s.openTitle(openHigh.length))}</h2>
              <ul class="open-list">
                ${openHigh
                  .map((c) => `<li>${icon(TAG_ICON[c.tag], "icon icon-sm")}<span>${esc(c.title)}</span></li>`)
                  .join("")}
              </ul>
            </section>`
          : `<p class="panel all-done">${icon("check", "icon")} ${esc(s.allDone)}</p>`
      }

      <section class="cta" aria-labelledby="cta-title">
        <div>
          <h2 id="cta-title">${esc(s.ctaTitle)}</h2>
          <p>${esc(s.ctaBody)}</p>
        </div>
        <a class="btn btn-light btn-lg" href="${IF_MOVE_NOTICE}" target="_blank" rel="noopener">${esc(s.ctaButton)}${newTab} ${icon("external")}</a>
      </section>

      <div class="summary-grid">
        <section class="panel notes" aria-labelledby="notes-title">
          <h2 id="notes-title">${icon("house", "icon")} ${esc(s.notesTitle)}</h2>
          <p class="muted">${esc(s.notesLead)}</p>
          <div class="notes-fields">
            ${noteField("waterValve", s.notesWaterValve, "drop", { placeholder: s.notesWaterValvePlaceholder })}
            ${noteField("fuseBox", s.notesFuseBox, "bolt", { placeholder: s.notesFuseBoxPlaceholder })}
            ${noteField("maintenancePhone", s.notesMaintenance, "phone", { type: "tel" })}
            <div class="row">
              ${noteField("electricityMeter", s.notesElectricityMeter, "bolt", { inputmode: "decimal" })}
              ${noteField("waterMeter", s.notesWaterMeter, "drop", { inputmode: "decimal" })}
            </div>
          </div>
          <p class="hint">${icon("lock", "icon icon-xs")} ${esc(view.remember ? s.notesSavedHint : s.notesUnsavedHint)}</p>
        </section>

        <section class="panel emergency" aria-labelledby="emergency-title">
          <h2 id="emergency-title">${icon("alert", "icon")} ${esc(s.emergencyTitle)}</h2>
          <ol class="steps">
            ${s.emergencySteps.map((step) => `<li>${esc(step)}</li>`).join("")}
          </ol>
        </section>
      </div>

      ${
        reasons.length
          ? `<aside class="panel offer" aria-labelledby="offer-title">
              <span class="tag tag-leak">${icon("drop", "icon icon-xs")} ${esc(s.offerTag)}</span>
              <h2 id="offer-title">${esc(s.offerTitle)}</h2>
              <p class="muted">${esc(s.offerWhy)}</p>
              <ul class="reasons">${reasons.map((r) => `<li class="pill">${esc(r)}</li>`).join("")}</ul>
              <p>${esc(s.offerBody)}</p>
            </aside>`
          : ""
      }

      <div class="actions">
        <button type="button" class="btn btn-secondary" id="back">${icon("arrowLeft")} ${esc(s.back)}</button>
        <button type="button" class="btn btn-secondary" id="print">${icon("printer")} ${esc(s.print)}</button>
        <button type="button" class="btn btn-ghost" id="restart">${icon("restart")} ${esc(s.restart)}</button>
      </div>
    </div>`;

  root.querySelectorAll<HTMLInputElement>("input[data-note]").forEach((field) =>
    field.addEventListener("input", () => actions.onNote(field.dataset.note as keyof HomeNotes, field.value)),
  );
  root.querySelector("#back")!.addEventListener("click", actions.onBack);
  root.querySelector("#print")!.addEventListener("click", () => window.print());
  root.querySelector("#restart")!.addEventListener("click", actions.onRestart);
}
