import type { MoveInput } from "./types";
import { t } from "./i18n";
import { icon, type IconName } from "./icons";
import { stepper } from "./shell";
import { addDays, esc, todayIso } from "./util";
import { inputProblem, type InputProblem } from "./validate";

const BENEFIT_ICONS: IconName[] = ["calendar", "drop", "leaf", "lock"];

// Which field to mark when validation finds a problem.
const PROBLEM_FIELD: Record<InputProblem, string> = {
  date: "moveDate",
  city: "city",
  year: "buildingYear",
  age: "washerAge",
};

export function renderForm(
  root: HTMLElement,
  initial: MoveInput | null,
  onSubmit: (input: MoveInput) => void,
): void {
  const f = t().form;
  const v: MoveInput = initial ?? {
    // Two days ahead keeps the move inside FMI's forecast range, so the demo shows live weather.
    moveDate: addDays(todayIso(), 2),
    city: "Turku",
    homeType: "house",
    buildingYear: 1985,
    washerAge: 8,
    dishwasherAge: 5,
    knowsCover: "unsure",
  };

  const radio = (name: string, value: string, checked: boolean) =>
    `<input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""} />`;

  root.innerHTML = `
    <div class="page">
      ${stepper(1)}
      <div class="form-layout">
        <section class="intro">
          <p class="eyebrow">${esc(f.eyebrow)}</p>
          <h1 tabindex="-1">${esc(f.title)}</h1>
          <p class="lead">${esc(f.lead)}</p>
          <h2 class="sr-only">${esc(f.benefitsTitle)}</h2>
          <ul class="benefits">
            ${f.benefits
              .map(
                (b, i) => `
              <li>
                <span class="benefit-icon">${icon(BENEFIT_ICONS[i] ?? "check")}</span>
                <span><strong>${esc(b.title)}</strong><span>${esc(b.body)}</span></span>
              </li>`,
              )
              .join("")}
          </ul>
        </section>

        <form id="move-form" class="panel form" novalidate>
          <fieldset class="group">
            <legend>${esc(f.sectionMove)}</legend>
            <div class="row">
              <div class="field">
                <label for="f-date">${esc(f.moveDate)}</label>
                <input id="f-date" type="date" name="moveDate" required value="${esc(v.moveDate)}" />
              </div>
              <div class="field">
                <label for="f-city">${esc(f.city)}</label>
                <input id="f-city" type="text" name="city" required maxlength="40" autocomplete="address-level2"
                       value="${esc(v.city)}" placeholder="${esc(f.cityPlaceholder)}" />
              </div>
            </div>
          </fieldset>

          <fieldset class="group">
            <legend>${esc(f.sectionHome)}</legend>
            <fieldset class="field">
              <legend class="label">${esc(f.homeType)}</legend>
              <div class="tiles">
                <label class="tile">
                  ${radio("homeType", "apartment", v.homeType === "apartment")}
                  <span class="tile-body">
                    ${icon("building", "icon icon-lg")}
                    <span><strong>${esc(f.apartment)}</strong><small>${esc(f.apartmentHint)}</small></span>
                  </span>
                </label>
                <label class="tile">
                  ${radio("homeType", "house", v.homeType === "house")}
                  <span class="tile-body">
                    ${icon("house", "icon icon-lg")}
                    <span><strong>${esc(f.house)}</strong><small>${esc(f.houseHint)}</small></span>
                  </span>
                </label>
              </div>
            </fieldset>
            <div class="field">
              <label for="f-year">${esc(f.buildingYear)}</label>
              <input id="f-year" type="number" name="buildingYear" inputmode="numeric" required min="1800" max="2030"
                     aria-describedby="f-year-hint" value="${esc(v.buildingYear)}" />
              <p class="hint" id="f-year-hint">${esc(f.buildingYearHint)}</p>
            </div>
          </fieldset>

          <fieldset class="group">
            <legend>${esc(f.sectionAppliances)}</legend>
            <div class="row">
              <div class="field">
                <label for="f-washer">${esc(f.washerAge)}</label>
                <input id="f-washer" type="number" name="washerAge" inputmode="numeric" min="0" max="40"
                       aria-describedby="age-hint" value="${v.washerAge ?? ""}" placeholder="${esc(f.agePlaceholder)}" />
              </div>
              <div class="field">
                <label for="f-dishwasher">${esc(f.dishwasherAge)}</label>
                <input id="f-dishwasher" type="number" name="dishwasherAge" inputmode="numeric" min="0" max="40"
                       aria-describedby="age-hint" value="${v.dishwasherAge ?? ""}" placeholder="${esc(f.agePlaceholder)}" />
              </div>
            </div>
            <p class="hint" id="age-hint">${esc(f.ageHint)}</p>
          </fieldset>

          <fieldset class="group">
            <legend>${esc(f.sectionCover)}</legend>
            <fieldset class="field">
              <legend class="label">${esc(f.knowsCover)}</legend>
              <div class="segmented">
                <label>${radio("knowsCover", "yes", v.knowsCover === "yes")} ${esc(f.coverYes)}</label>
                <label>${radio("knowsCover", "unsure", v.knowsCover === "unsure")} ${esc(f.coverUnsure)}</label>
                <label>${radio("knowsCover", "no", v.knowsCover === "no")} ${esc(f.coverNo)}</label>
              </div>
            </fieldset>
          </fieldset>

          <p class="error" id="form-error" role="alert" tabindex="-1" hidden></p>
          <button type="submit" class="btn btn-primary btn-lg btn-block">${esc(f.submit)} ${icon("arrowRight")}</button>
          <p class="hint privacy">${icon("lock", "icon icon-sm")}<span>${esc(f.privacy)}</span></p>
        </form>
      </div>
    </div>`;

  const form = root.querySelector<HTMLFormElement>("#move-form")!;
  const errorEl = root.querySelector<HTMLParagraphElement>("#form-error")!;
  const messages: Record<InputProblem, string> = {
    date: f.errorDate,
    city: f.errorCity,
    year: f.errorYear,
    age: f.errorAge,
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const optionalAge = (key: string) => {
      const raw = String(data.get(key) ?? "").trim();
      return raw === "" ? null : Number(raw);
    };

    const input: MoveInput = {
      moveDate: String(data.get("moveDate") ?? ""),
      city: String(data.get("city") ?? "").trim(),
      homeType: data.get("homeType") === "apartment" ? "apartment" : "house",
      buildingYear: Number(data.get("buildingYear")),
      washerAge: optionalAge("washerAge"),
      dishwasherAge: optionalAge("dishwasherAge"),
      knowsCover: (data.get("knowsCover") as MoveInput["knowsCover"]) ?? "unsure",
    };

    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    const problem = inputProblem(input);
    if (problem) {
      // An age problem points at the dishwasher field when the washing machine age is fine.
      const field =
        problem === "age" && inputProblem({ ...input, dishwasherAge: null }) === null
          ? "dishwasherAge"
          : PROBLEM_FIELD[problem];
      form.querySelector(`[name="${field}"]`)?.setAttribute("aria-invalid", "true");
      errorEl.textContent = messages[problem];
      errorEl.hidden = false;
      errorEl.focus();
      return;
    }
    errorEl.hidden = true;
    onSubmit(input);
  });
}
