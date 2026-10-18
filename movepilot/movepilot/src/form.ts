import type { MoveInput } from "./types";
import { t } from "./i18n";
import { icon, type IconName } from "./icons";
import { stepper } from "./shell";
import { addDays, esc, todayIso } from "./util";
import { inputProblem, type InputProblem } from "./validate";

const BENEFIT_ICONS: IconName[] = ["calendar", "drop", "leaf", "lock"];

// Decorative line drawing for the visual panel: boxes and a home. Inline SVG instead of a photo,
// so the page stays light (a hero photo is often 100–300 kB).
const MOVING_ART = `<svg class="hero-art" viewBox="0 0 240 150" aria-hidden="true" focusable="false">
  <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M128 62 172 28l44 34v70h-88z"/><path d="M160 132v-30h24v30M140 74h16v14h-16zM188 74h16v14h-16z"/>
    <path d="M20 96h50v36H20zM20 96l8-12h50l-8 12M70 96l8-12v36l-8 12M38 96v10M52 96v10"/>
    <path d="M58 62h40v34H58zM58 62l6-10h40l-6 10M98 62l6-10v34l-6 10"/>
    <path d="M8 132h224"/>
  </g>
</svg>`;

// Which field to mark when validation finds a problem.
const PROBLEM_FIELD: Record<InputProblem, string> = {
  date: "moveDate",
  city: "city",
  year: "buildingYear",
  age: "washerAge",
};

export interface FormOptions {
  /** Show the invitation to the first-time user tour. */
  tourBanner: boolean;
  onStartTour: () => void;
  onDismissTour: () => void;
}

export function renderForm(
  root: HTMLElement,
  initial: MoveInput | null,
  onSubmit: (input: MoveInput) => void,
  opts: FormOptions,
): void {
  const f = t().form;
  const tour = t().tour;
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

  // Layout follows the product pages of large Finnish insurers: a plain heading and lead,
  // one split box (form panel + visual panel), then full-width bands for reasons and questions.
  root.innerHTML = `
    <div class="page">
      ${stepper(1)}
      <header class="page-head">
        <h1 tabindex="-1">${esc(f.title)}</h1>
        <p class="lead">${esc(f.lead)}</p>
      </header>
      ${
        opts.tourBanner
          ? `<aside class="infobox tour-banner" aria-labelledby="tour-banner-title">
              ${icon("help", "icon infobox-icon")}
              <div>
                <h2 id="tour-banner-title">${esc(tour.bannerTitle)}</h2>
                <p>${esc(tour.bannerBody)}</p>
              </div>
              <div class="infobox-actions">
                <button type="button" class="btn btn-primary btn-sm" id="tour-start">${esc(tour.bannerStart)}</button>
                <button type="button" class="btn-link" id="tour-dismiss">${esc(tour.bannerDismiss)}</button>
              </div>
            </aside>`
          : ""
      }

      <div class="hero-split">
        <form id="move-form" class="hero-form form" novalidate>
          <h2 class="panel-title">${esc(f.eyebrow)}</h2>
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

        <div class="hero-visual">
          <p class="badge-circle"><strong>${esc(f.badgeValue)}</strong><span>${esc(f.badgeLabel)}</span></p>
          <ul class="visual-points">
            ${f.visualPoints.map((point) => `<li>${icon("check", "icon icon-sm")}<span>${esc(point)}</span></li>`).join("")}
          </ul>
          ${MOVING_ART}
        </div>
      </div>
    </div>

    <section class="band band-alt" aria-labelledby="why-title">
      <div class="page">
        <p class="eyebrow-quiet">${esc(f.whyEyebrow)}</p>
        <h2 id="why-title" class="h-section">${esc(f.whyTitle)}</h2>
        <ul class="feature-grid">
          ${f.benefits
            .map(
              (b, i) => `
            <li class="feature-card">
              ${icon(BENEFIT_ICONS[i] ?? "check", "icon icon-xl")}
              <h3>${esc(b.title)}</h3>
              <p>${esc(b.body)}</p>
            </li>`,
            )
            .join("")}
        </ul>
      </div>
    </section>

    <section class="band" aria-labelledby="faq-title">
      <div class="page">
        <h2 id="faq-title" class="h-section">${esc(f.faqTitle)}</h2>
        <div class="faq">
          ${f.faq
            .map(
              (item) => `
            <details>
              <summary>${esc(item.q)}${icon("chevronDown", "icon faq-chevron")}</summary>
              <p>${esc(item.a)}</p>
            </details>`,
            )
            .join("")}
        </div>
      </div>
    </section>`;

  root.querySelector("#tour-start")?.addEventListener("click", opts.onStartTour);
  root.querySelector("#tour-dismiss")?.addEventListener("click", opts.onDismissTour);

  const form = root.querySelector<HTMLFormElement>("#move-form")!;
  const errorEl = root.querySelector<HTMLParagraphElement>("#form-error")!;
  const messages: Record<InputProblem, string> = {
    date: f.errorDate,
    city: f.errorCity,
    year: f.errorYear,
    age: f.errorAge,
  };

  function clearInvalid(): void {
    form.querySelectorAll<HTMLInputElement>("[aria-invalid]").forEach((el) => {
      el.removeAttribute("aria-invalid");
      if (el.dataset.describedby) el.setAttribute("aria-describedby", el.dataset.describedby);
      else el.removeAttribute("aria-describedby");
      delete el.dataset.describedby;
    });
  }

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

    clearInvalid();
    const problem = inputProblem(input);
    if (problem) {
      // An age problem points at the dishwasher field when the washing machine age is fine.
      const name =
        problem === "age" && inputProblem({ ...input, dishwasherAge: null }) === null
          ? "dishwasherAge"
          : PROBLEM_FIELD[problem];
      const field = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      if (field) {
        field.setAttribute("aria-invalid", "true");
        // Link the message to the field, so it is read out when the user tabs back to it.
        field.dataset.describedby = field.getAttribute("aria-describedby") ?? "";
        field.setAttribute("aria-describedby", `${field.dataset.describedby} form-error`.trim());
        field.addEventListener("input", clearInvalid, { once: true });
      }
      errorEl.textContent = messages[problem];
      errorEl.hidden = false;
      errorEl.focus();
      return;
    }
    errorEl.hidden = true;
    onSubmit(input);
  });
}
