import type { Theme } from "./types";

// Light or dark mode. The page follows the system setting until the user flips the switch in the header;
// the choice is kept with the saved plan only when "Save on this device" is on, like the language.

// Browser bar colours for each mode; the same values as --mist in styles.css and the metas in index.html.
const BAR_COLOR: Record<Theme, string> = { light: "#f0f2f5", dark: "#0f0e15" };

let chosen: Theme | null = null;

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

export const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

/** The user's own choice, or null while the page follows the system setting. */
export const chosenTheme = (): Theme | null => chosen;

export function currentTheme(): Theme {
  return chosen ?? (darkQuery().matches ? "dark" : "light");
}

export function setTheme(theme: Theme | null): void {
  chosen = theme;
  const root = document.documentElement;
  if (theme) root.dataset.theme = theme;
  else delete root.dataset.theme;
  // The browser's own bar follows the chosen mode too; with no choice, each meta keeps to its media query.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const own: Theme = meta.media.includes("dark") ? "dark" : "light";
    meta.content = BAR_COLOR[theme ?? own];
  });
}

/** Calls back when the system setting changes, so the switch can show the mode now in use. */
export function onSystemThemeChange(callback: () => void): void {
  darkQuery().addEventListener("change", callback);
}
