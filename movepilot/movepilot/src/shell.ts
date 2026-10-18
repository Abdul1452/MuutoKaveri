import type { Lang } from "./types";
import { LANGS, currentLang, isLang, t } from "./i18n";
import { icon } from "./icons";
import { esc } from "./util";

const LOGO = `<svg class="logo" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
  <rect width="32" height="32" rx="9" fill="#7a35ff"/>
  <path d="M8 16.5 16 9.5l8 7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.5 15v7.5h11V15" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="18.5" r="2" fill="#fff"/>
</svg>`;

export function renderHeader(el: HTMLElement, onLang: (lang: Lang) => void): void {
  const m = t();
  el.innerHTML = `
    <div class="topbar-inner">
      <span class="brand">
        ${LOGO}
        <span class="brand-text"><strong>MovePilot</strong><span class="tagline">${esc(m.shell.tagline)}</span></span>
      </span>
      <div class="lang-picker">
        <label for="lang" class="sr-only">${esc(m.shell.language)}</label>
        ${icon("globe", "icon icon-sm lang-icon")}
        <select id="lang">
          ${LANGS.map(
            (l) => `<option value="${l.id}" lang="${l.id}" ${l.id === currentLang() ? "selected" : ""}>${l.label}</option>`,
          ).join("")}
        </select>
      </div>
    </div>`;

  el.querySelector<HTMLSelectElement>("#lang")!.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    if (isLang(value)) onLang(value);
  });
}

/** Three-step progress indicator shown at the top of each screen. */
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
  const f = t().footer;
  const newTab = t().plan.newTab;
  el.innerHTML = `
    <details>
      <summary>${icon("lock", "icon icon-sm")} ${esc(f.summary)}</summary>
      <div class="foot-grid">
        <section>
          <h2>${esc(f.privacyTitle)}</h2>
          <p>${esc(f.privacy)}</p>
          <p>${esc(f.privacySaved)}</p>
        </section>
        <section>
          <h2>${esc(f.accessibilityTitle)}</h2>
          <p>${esc(f.accessibility)}</p>
        </section>
        <section>
          <h2>${esc(f.sourcesTitle)}</h2>
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
      <p class="disclaimer">${esc(f.disclaimer)}</p>
    </details>`;
}
