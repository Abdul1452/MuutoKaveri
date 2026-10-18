import type { MoveInput } from "./types";
import { esc, todayIso } from "./util";

export function renderForm(
  root: HTMLElement,
  initial: MoveInput | null,
  onSubmit: (input: MoveInput) => void,
): void {
  const v = initial ?? {
    moveDate: todayIso(),
    city: "Turku",
    homeType: "house",
    buildingYear: 1985,
    washerAge: 8,
    dishwasherAge: 5,
    knowsCover: "unsure",
  };

  root.innerHTML = `
    <section class="screen">
      <p class="step">Step 1 of 3</p>
      <h1 tabindex="-1">Moving soon? Tell us about the new home.</h1>
      <p class="lead">Two minutes of answers give you a plan for the move and your first 30 days.</p>

      <form id="move-form" class="form" novalidate>
        <label>Move date
          <input type="date" name="moveDate" required value="${esc(v.moveDate)}" />
        </label>

        <label>New city
          <input type="text" name="city" required aria-describedby="form-error" maxlength="40" autocomplete="address-level2"
                 value="${esc(v.city)}" placeholder="e.g. Turku" />
        </label>

        <fieldset>
          <legend>Home type</legend>
          <div class="segmented">
            <label><input type="radio" name="homeType" value="apartment" ${v.homeType === "apartment" ? "checked" : ""}/> Apartment</label>
            <label><input type="radio" name="homeType" value="house" ${v.homeType === "house" ? "checked" : ""}/> Detached house</label>
          </div>
        </fieldset>

        <label>Year the building was built
          <input type="number" name="buildingYear" required aria-describedby="form-error" min="1800" max="2030" value="${esc(v.buildingYear)}" />
        </label>

        <div class="row">
          <label>Washing machine age (years)
            <input type="number" name="washerAge" aria-describedby="age-hint" min="0" max="40" value="${v.washerAge ?? ""}" placeholder="none" />
          </label>
          <label>Dishwasher age (years)
            <input type="number" name="dishwasherAge" aria-describedby="age-hint" min="0" max="40" value="${v.dishwasherAge ?? ""}" placeholder="none" />
          </label>
        </div>
        <p class="hint" id="age-hint">Leave empty if you don't have one.</p>

        <fieldset>
          <legend>Do you know what your home insurance covers during a move?</legend>
          <div class="segmented">
            <label><input type="radio" name="knowsCover" value="yes" ${v.knowsCover === "yes" ? "checked" : ""}/> Yes</label>
            <label><input type="radio" name="knowsCover" value="unsure" ${v.knowsCover === "unsure" ? "checked" : ""}/> Not sure</label>
            <label><input type="radio" name="knowsCover" value="no" ${v.knowsCover === "no" ? "checked" : ""}/> No</label>
          </div>
        </fieldset>

        <p class="error" id="form-error" role="alert" tabindex="-1" hidden></p>
        <button type="submit" class="primary">Build my move plan</button>
        <p class="hint">Nothing you enter leaves this page except the city name, used for the weather forecast. No cookies, no tracking.</p>
      </form>
    </section>`;

  const form = root.querySelector<HTMLFormElement>("#move-form")!;
  const errorEl = root.querySelector<HTMLParagraphElement>("#form-error")!;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const optionalAge = (key: string) => {
      const raw = String(data.get(key) ?? "").trim();
      return raw === "" ? null : Math.max(0, Math.round(Number(raw)));
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

    const problem = validate(input);
    if (problem) {
      errorEl.textContent = problem;
      errorEl.hidden = false;
      errorEl.focus();
      return;
    }
    onSubmit(input);
  });
}

function validate(input: MoveInput): string | null {
  if (!input.moveDate) return "Pick a move date.";
  if (!/^[\p{L} -]{2,40}$/u.test(input.city)) return "Enter the city name, for example Turku.";
  if (!Number.isFinite(input.buildingYear) || input.buildingYear < 1800 || input.buildingYear > 2030)
    return "Enter the building year, for example 1985.";
  return null;
}
