// First-time user tour: walks through every tool, from the move form to the finished summary.
// It is not modal: the page stays usable, a spotlight ring marks the tool and a small dialog explains it.
// Focus moves to the dialog's heading on each step; Esc leaves the tour.
import type { Screen } from "./types";
import { t, type Messages } from "./i18n";
import { esc } from "./util";

type StepKey = keyof Messages["tour"]["steps"];

interface Step {
  key: StepKey;
  screen: Exclude<Screen, "loading">;
  /** Selectors tried in order; the first visible match is highlighted. None = centred dialog. */
  targets?: string[];
  /** Skip the step when nothing matches (e.g. no forecast for a move far away). */
  optional?: boolean;
  /** What "Next" does on this step, if more than moving on. */
  action?: "submit" | "summary";
}

const STEPS: Step[] = [
  { key: "welcome", screen: "form" },
  { key: "language", screen: "form", targets: ["#lang", "#lang-m"] },
  { key: "nav", screen: "form", targets: ["#mainnav ul", "#menu-btn"] },
  { key: "form", screen: "form", targets: ["#move-form"] },
  { key: "submit", screen: "form", targets: ["#move-form button[type=submit]"], action: "submit" },
  { key: "progress", screen: "plan", targets: [".progress-card"] },
  { key: "forecast", screen: "plan", targets: [".forecast"], optional: true },
  { key: "filters", screen: "plan", targets: [".filters"] },
  { key: "card", screen: "plan", targets: [".cards .card"] },
  { key: "tools", screen: "plan", targets: [".tools"] },
  { key: "remember", screen: "plan", targets: [".remember"] },
  { key: "next", screen: "plan", targets: ["#next"], action: "summary" },
  { key: "open", screen: "summary", targets: [".open-items", ".all-done"] },
  { key: "cta", screen: "summary", targets: [".cta"] },
  { key: "notes", screen: "summary", targets: [".notes"] },
  { key: "emergency", screen: "summary", targets: [".emergency"] },
  { key: "done", screen: "summary" },
];

export interface TourHost {
  screen: () => Screen;
  goTo: (screen: Exclude<Screen, "loading">) => void;
  /** Submits the move form; returns true when the plan started building. */
  submit: () => boolean;
  onEnd: () => void;
}

export interface Tour {
  start: () => void;
  stop: () => void;
  /** Call after every render: re-attaches the highlight to the new DOM. */
  sync: () => void;
  active: () => boolean;
}

const visible = (el: Element) => el.getClientRects().length > 0;

export function createTour(host: TourHost): Tour {
  let index = -1;
  let focusPending = false;
  let spot: HTMLDivElement | null = null;
  let pop: HTMLDivElement | null = null;
  let frame = 0;
  let opener: HTMLElement | null = null;

  const active = () => index >= 0;
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function target(step: Step): HTMLElement | null {
    for (const selector of step.targets ?? []) {
      const found = [...document.querySelectorAll<HTMLElement>(selector)].find(visible);
      if (found) return found;
    }
    return null;
  }

  function mount(): void {
    if (pop) return;
    spot = document.createElement("div");
    spot.className = "tour-spot";
    spot.setAttribute("aria-hidden", "true");
    pop = document.createElement("div");
    pop.className = "tour-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-modal", "false");
    pop.setAttribute("aria-labelledby", "tour-title");
    pop.setAttribute("aria-describedby", "tour-count tour-body");
    document.body.append(spot, pop);
    pop.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
  }

  function unmount(): void {
    spot?.remove();
    pop?.remove();
    spot = pop = null;
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule);
  }

  function onKey(e: KeyboardEvent): void {
    if (!active() || e.defaultPrevented) return;
    const focus = document.activeElement;
    const inDialog = !!pop && !!focus && pop.contains(focus);
    // Esc ends the tour only from the dialog (or with focus nowhere), so it never steals Esc from
    // a menu, an autofill list or a form field the user is working in.
    if (e.key === "Escape" && (inDialog || focus === document.body)) {
      e.preventDefault();
      stop();
      return;
    }
    if (e.key === "Tab") tabBetween(e, inDialog);
  }

  /** Tab moves between the dialog and the highlighted tool, as if the dialog sat right after it. */
  function tabBetween(e: KeyboardEvent, inDialog: boolean): void {
    if (!pop) return;
    const el = target(STEPS[index]!);
    const focusables = (root: HTMLElement) =>
      [...root.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex='-1'])")].filter(
        (x) => visible(x) && !x.hasAttribute("disabled"),
      );
    const inPop = focusables(pop);
    const focus = document.activeElement as HTMLElement | null;
    if (inDialog && !e.shiftKey && focus === inPop[inPop.length - 1] && el) {
      const first = el.matches("a[href], button, input, select") ? el : focusables(el)[0];
      if (first) {
        e.preventDefault();
        first.focus();
      }
    } else if (inDialog && e.shiftKey && (focus === inPop[0] || focus?.id === "tour-title") && el) {
      const inTarget = el.matches("a[href], button, input, select") ? [el] : focusables(el);
      const last = inTarget[inTarget.length - 1];
      if (last) {
        e.preventDefault();
        last.focus();
      }
    } else if (!inDialog && !e.shiftKey && el && focus && (focus === el || el.contains(focus))) {
      const inTarget = el.matches("a[href], button, input, select") ? [el] : focusables(el);
      if (focus === inTarget[inTarget.length - 1]) {
        e.preventDefault();
        pop.querySelector<HTMLElement>("#tour-title")?.focus();
      }
    }
  }

  function onClick(e: MouseEvent): void {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-tour]");
    if (!button) return;
    const what = button.dataset.tour;
    if (what === "skip" || what === "finish") stop();
    else if (what === "back") move(-1);
    else if (what === "next") next();
  }

  /** Index of the nearest step in `dir` that can be shown (skips optional steps with no target). */
  function seek(from: number, dir: 1 | -1): number {
    let i = from;
    while (i >= 0 && i < STEPS.length) {
      const step = STEPS[i]!;
      if (!step.optional || step.screen !== host.screen() || target(step)) return i;
      i += dir;
    }
    return Math.max(0, Math.min(STEPS.length - 1, i));
  }

  function next(): void {
    const step = STEPS[index]!;
    if (step.action === "submit") {
      if (!host.submit()) {
        schedule(); // the error message moved the button; stay on this step and follow it
        return;
      }
      index += 1;
      focusPending = true;
      sync(); // hidden while the plan loads; shown again after the plan renders
      return;
    }
    if (step.action === "summary") {
      index += 1;
      focusPending = true;
      host.goTo("summary");
      return;
    }
    move(1);
  }

  function move(dir: 1 | -1): void {
    const wanted = seek(index + dir, dir);
    const step = STEPS[wanted]!;
    index = wanted;
    focusPending = true;
    if (step.screen !== host.screen()) host.goTo(step.screen);
    else sync();
  }

  function start(): void {
    const focus = document.activeElement;
    opener = focus instanceof HTMLElement && focus !== document.body ? focus : null;
    index = 0;
    focusPending = true;
    mount();
    host.goTo("form"); // also redraws the form without the tour invitation
  }

  function stop(): void {
    if (!active()) return;
    index = -1;
    unmount();
    host.onEnd();
    // Back to what opened the tour if it is still on the page, else to the screen's heading.
    if (opener?.isConnected && visible(opener)) opener.focus();
    else document.querySelector<HTMLElement>("main h1")?.focus();
    opener = null;
  }

  function sync(): void {
    if (!active()) return;
    mount();
    const screen = host.screen();
    if (screen === "loading") {
      // The dialog hides while the plan is built; the loading heading takes focus so nothing is lost.
      const hadFocus = !!pop && pop.contains(document.activeElement);
      hide();
      if (hadFocus || document.activeElement === document.body) document.querySelector<HTMLElement>("main h1")?.focus();
      return;
    }
    // The user went to another tool themselves: continue from that tool's first step.
    if (STEPS[index]!.screen !== screen) {
      index = STEPS.findIndex((s) => s.screen === screen);
      focusPending = true;
    }
    index = seek(index, 1);
    render();
  }

  function hide(): void {
    if (pop) pop.hidden = true;
    if (spot) spot.hidden = true;
  }

  function render(): void {
    if (!pop || !spot) return;
    const m = t().tour;
    const step = STEPS[index]!;
    const copy = m.steps[step.key];
    // Count only steps that can be shown: an optional step whose tool isn't on this screen drops out.
    const shown = STEPS.map((s, i) => i).filter((i) => {
      const s = STEPS[i]!;
      return !s.optional || s.screen !== host.screen() || target(s);
    });
    const total = shown.length;
    const position = shown.indexOf(index) + 1;
    const isFirst = index === 0;
    const isLast = index === STEPS.length - 1;
    const nextLabel = step.action === "submit" ? m.buildPlan : step.action === "summary" ? m.openSummary : m.next;

    pop.hidden = false;
    pop.innerHTML = `
      <p class="tour-count" id="tour-count">${esc(m.stepOf(position, total))}</p>
      <h2 id="tour-title" tabindex="-1" aria-describedby="tour-count tour-body">${esc(copy.title)}</h2>
      <p id="tour-body">${esc(copy.body)}</p>
      <div class="tour-progress" aria-hidden="true"><span></span></div>
      <div class="tour-actions">
        ${isLast ? "" : `<button type="button" class="btn-link" data-tour="skip">${esc(m.skip)}</button>`}
        <span class="tour-nav">
          ${isFirst ? "" : `<button type="button" class="btn btn-secondary btn-sm" data-tour="back">${esc(m.back)}</button>`}
          <button type="button" class="btn btn-primary btn-sm" data-tour="${isLast ? "finish" : "next"}">${esc(isLast ? m.finish : nextLabel)}</button>
        </span>
      </div>`;
    // Width set through the CSSOM: the CSP forbids inline style attributes, not this.
    pop.querySelector<HTMLElement>(".tour-progress span")!.style.width = `${(position / total) * 100}%`;

    const el = target(step);
    if (el && focusPending) el.scrollIntoView({ block: "center", behavior: reduceMotion() ? "auto" : "smooth" });
    place();
    if (focusPending) {
      focusPending = false;
      pop.querySelector<HTMLElement>("#tour-title")!.focus({ preventScroll: true });
    }
  }

  function schedule(): void {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(place);
  }

  /** Puts the ring around the target and the dialog next to it, inside the viewport. */
  function place(): void {
    if (!pop || !spot || !active() || pop.hidden) return;
    const el = target(STEPS[index]!);
    const vw = document.documentElement.clientWidth; // without the scrollbar
    const vh = window.innerHeight;
    const gap = 12;
    pop.classList.remove("centered", "docked");

    if (!el) {
      spot.hidden = true;
      pop.classList.add("centered");
      pop.style.left = pop.style.top = "";
      return;
    }

    const r = el.getBoundingClientRect();
    spot.hidden = false;
    const pad = 6;
    const top = Math.max(r.top - pad, 0);
    const bottom = Math.min(r.bottom + pad, vh);
    spot.style.left = `${r.left - pad}px`;
    spot.style.top = `${top}px`;
    spot.style.width = `${r.width + pad * 2}px`;
    spot.style.height = `${Math.max(bottom - top, 0)}px`;

    // Phones: the dialog docks to the bottom edge, like a sheet.
    if (vw < 640) {
      pop.classList.add("docked");
      pop.style.left = pop.style.top = "";
      return;
    }
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    const clampX = (x: number) => Math.min(Math.max(x, gap), vw - pw - gap);
    const clampY = (y: number) => Math.min(Math.max(y, gap), vh - ph - gap);
    let x: number;
    let y: number;
    // Below, above, right, left of the target; never on top of it unless nothing else fits.
    if (r.bottom + gap + ph <= vh - gap) [x, y] = [clampX(r.left), r.bottom + gap];
    else if (r.top - gap - ph >= gap) [x, y] = [clampX(r.left), r.top - gap - ph];
    else if (r.right + gap + pw <= vw - gap) [x, y] = [r.right + gap, clampY(r.top)];
    else if (r.left - gap - pw >= gap) [x, y] = [r.left - gap - pw, clampY(r.top)];
    else [x, y] = [clampX(r.left), vh - ph - 24];
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
  }

  return { start, stop, sync, active };
}
