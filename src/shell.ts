import type { Lang, Screen } from "./types";
import { LANGS, currentLang, isLang, t } from "./i18n";
import { icon, type IconName } from "./icons";
import { IF_MOVE_NOTICE } from "./rules";
import { esc } from "./util";

const LOGO = `<svg class="logo" viewBox="0 0 32 32" width="40" height="40" aria-hidden="true" focusable="false">
  <rect width="32" height="32" rx="16" fill="#7a35ff"/>
  <path d="M8 16.5 16 9.5l8 7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5 15v7.5h11V15" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="18.5" r="2" fill="#fff"/>
</svg>`;

/** The three tools a user moves between, in order. */
export const NAV: { screen: Exclude<Screen, "loading">; icon: IconName }[] = [
  { screen: "form", icon: "file" },
  { screen: "plan", icon: "calendar" },
  { screen: "summary", icon: "check" },
];

export interface HeaderActions {
  onLang: (lang: Lang) => void;
  onNav: (screen: Exclude<Screen, "loading">) => void;
  onTour: () => void;
  onTheme: () => void;
}

// Two-tier header, as on large Finnish insurance sites: a utility bar (tagline, tour, language, insurance)
// above a main bar (logo and tools). On phones it becomes one 64px bar with icon buttons and a menu.
export function renderHeader(el: HTMLElement, actions: HeaderActions): void {
  const m = t();
  const s = m.shell;
  const newTab = `<span class="sr-only"> ${esc(m.plan.newTab)}</span>`;
  const options = LANGS.map(
    (l) => `<option value="${l.id}" lang="${l.id}" ${l.id === currentLang() ? "selected" : ""}>${l.label}</option>`,
  ).join("");
  const short = LANGS.find((l) => l.id === currentLang())?.short ?? "EN";

  el.classList.remove("menu-open");
  el.innerHTML = `
    <div class="utility">
      <div class="container utility-inner">
        <span class="utility-tagline">${esc(s.tagline)}</span>
        <div class="utility-actions">
          <button type="button" class="utility-btn" data-tour-start>${icon("help", "icon icon-sm")} ${esc(s.tour)}</button>
          <div class="prefs" id="prefs">
            <div class="lang-picker">
              <label for="lang" class="sr-only">${esc(s.language)}</label>
              ${icon("globe", "icon icon-sm lang-icon")}
              <select id="lang" data-lang>${options}</select>
            </div>
            <button type="button" class="utility-btn theme-switch" role="switch" aria-checked="false" data-theme-switch>
              ${icon("moon", "icon icon-sm")} ${esc(s.darkMode)}<span class="switch-track" aria-hidden="true"></span>
            </button>
          </div>
          <a class="utility-cta" href="${IF_MOVE_NOTICE}" target="_blank" rel="noopener">${icon("shield", "icon icon-sm")} ${esc(s.insurance)}${newTab}</a>
        </div>
      </div>
    </div>
    <div class="mainbar">
      <div class="container mainbar-inner">
        <span class="brand">${LOGO}<span class="brand-name">MuutoKaveri</span></span>
        <nav class="mainnav" id="mainnav" aria-label="${esc(s.mainNav)}">
          <ul>
            ${NAV.map(
              (n, i) => `
              <li>
                <button type="button" class="nav-item" data-nav="${n.screen}" data-hint="${esc(s.navLocked)}">
                  ${icon(n.icon, "icon icon-sm nav-icon")}
                  <span>${esc(m.steps.names[i] ?? "")}</span>
                  <span class="sr-only nav-locked"> (${esc(s.navLocked)})</span>
                  ${icon("chevronRight", "icon icon-sm nav-chevron")}
                </button>
              </li>`,
            ).join("")}
          </ul>
          <a class="mobile-only menu-cta" href="${IF_MOVE_NOTICE}" target="_blank" rel="noopener">${icon("shield", "icon icon-sm")} ${esc(s.insurance)}${newTab}${icon("external", "icon icon-xs")}</a>
        </nav>
        <div class="mobile-actions">
          <div class="prefs" id="prefs-m">
            <div class="icon-label lang-compact">
              ${icon("globe")}
              <span aria-hidden="true">${short}</span>
              <label for="lang-m" class="sr-only">${esc(s.language)} ${short}</label>
              <select id="lang-m" data-lang>${options}</select>
            </div>
            <button type="button" class="icon-label theme-switch" role="switch" aria-checked="false" aria-label="${esc(s.darkMode)}" data-theme-switch>
              ${icon("moon")}<span>${esc(s.darkShort)}</span>
            </button>
          </div>
          <button type="button" class="icon-label" data-tour-start>${icon("help")}<span>${esc(s.tour)}</span></button>
          <button type="button" class="icon-label" id="menu-btn" aria-expanded="false" aria-controls="mainnav">
            ${icon("menu", "icon menu-open")}${icon("close", "icon menu-close")}<span>${esc(s.menu)}</span>
          </button>
        </div>
      </div>
    </div>`;

  el.querySelectorAll<HTMLSelectElement>("select[data-lang]").forEach((select) =>
    select.addEventListener("change", () => {
      if (isLang(select.value)) actions.onLang(select.value);
    }),
  );
  el.querySelectorAll<HTMLButtonElement>("[data-tour-start]").forEach((b) => b.addEventListener("click", actions.onTour));
  el.querySelectorAll<HTMLButtonElement>("[data-theme-switch]").forEach((b) => b.addEventListener("click", actions.onTheme));

  const menuBtn = el.querySelector<HTMLButtonElement>("#menu-btn")!;
  menuBtn.addEventListener("click", () => setMenu(el, menuBtn.getAttribute("aria-expanded") !== "true"));
  el.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.getAttribute("aria-disabled") === "true") return;
      setMenu(el, false);
      actions.onNav(b.dataset.nav as Exclude<Screen, "loading">);
    }),
  );

  // The header element itself survives re-renders, so its own listeners are added only once.
  if (el.dataset.bound) return;
  el.dataset.bound = "true";
  el.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !el.classList.contains("menu-open")) return;
    e.preventDefault();
    e.stopPropagation(); // closing the menu shouldn't also end the guided tour
    setMenu(el, false);
    el.querySelector<HTMLButtonElement>("#menu-btn")?.focus();
  });
  // Close the menu when focus moves on to the page, so it never covers the focused element.
  el.addEventListener("focusout", (e) => {
    const next = e.relatedTarget as Node | null;
    if (next && !el.contains(next)) setMenu(el, false);
  });
}

function setMenu(el: HTMLElement, open: boolean): void {
  el.querySelector("#menu-btn")?.setAttribute("aria-expanded", String(open));
  el.classList.toggle("menu-open", open);
}

/** Marks the current tool and locks the ones that need a plan, without re-rendering the header. */
export function updateNav(el: HTMLElement, screen: Screen, hasPlan: boolean): void {
  const current = screen === "loading" ? "plan" : screen;
  el.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((b) => {
    const target = b.dataset.nav;
    // Locked tools stay focusable (aria-disabled, not disabled), so the reason can be read and seen.
    const locked = target !== "form" && !hasPlan;
    if (locked) b.setAttribute("aria-disabled", "true");
    else b.removeAttribute("aria-disabled");
    b.classList.toggle("locked", locked);
    if (target === current) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
}

/** Shows on both theme switches whether dark mode is on. */
export function updateThemeSwitch(el: HTMLElement, dark: boolean): void {
  el.querySelectorAll("[data-theme-switch]").forEach((b) => b.setAttribute("aria-checked", String(dark)));
}

/** The visible language picker (desktop or phone layout). */
export function visibleLangPicker(el: HTMLElement): HTMLSelectElement | null {
  return [...el.querySelectorAll<HTMLSelectElement>("select[data-lang]")].find((s) => s.getClientRects().length > 0) ?? null;
}

/** Three-step progress trail shown at the top of each screen, styled like breadcrumbs. */
export function stepper(current: 1 | 2 | 3): string {
  const m = t();
  return `
    <ol class="stepper" aria-label="${esc(m.steps.label)}">
      ${m.steps.names
        .map((name, i) => {
          const n = i + 1;
          const state = n < current ? "done" : n === current ? "current" : "todo";
          return `
          <li class="step step-${state}" ${n === current ? 'aria-current="step"' : ""}>
            <span class="step-dot" aria-hidden="true">${n < current ? icon("check", "icon icon-xs") : n}</span>
            <span class="step-name"><span class="sr-only">${esc(m.steps.of(n, m.steps.names.length))}: </span>${esc(name)}${n < current ? `<span class="sr-only"> (${esc(m.steps.done)})</span>` : ""}</span>
          </li>`;
        })
        .join("")}
    </ol>`;
}

export function renderFooter(el: HTMLElement): void {
  const m = t();
  const f = m.footer;
  const newTab = m.plan.newTab;
  el.innerHTML = `
    <div class="container">
      <h2 class="sr-only">${esc(f.summary)}</h2>
      <div class="foot-brand">${LOGO}<span><strong>MuutoKaveri</strong><span>${esc(m.shell.tagline)}</span></span></div>
      <div class="foot-grid">
        <section>
          <h3>${esc(f.privacyTitle)}</h3>
          <p>${esc(f.privacy)}</p>
          <p>${esc(f.privacySaved)}</p>
        </section>
        <section>
          <h3>${esc(f.accessibilityTitle)}</h3>
          <p>${esc(f.accessibility)}</p>
        </section>
        <section>
          <h3>${esc(f.sourcesTitle)}</h3>
          <ul>
            ${f.sourceItems
              .map(
                (s) =>
                  `<li>${esc(s.topic)}: <a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}<span class="sr-only"> ${esc(newTab)}</span></a></li>`,
              )
              .join("")}
          </ul>
        </section>
      </div>
      <p class="foot-bottom">${esc(f.disclaimer)}</p>
    </div>`;
}
