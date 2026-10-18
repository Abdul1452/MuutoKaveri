import type { Lang } from "../types";
import { en, type Messages } from "./en";

export type { Messages };

export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "fi", label: "Suomi", short: "FI" },
  { id: "sv", label: "Svenska", short: "SV" },
];

// Formatting locale for dates and numbers. Swedish uses the Finland-Swedish variant.
const LOCALES: Record<Lang, string> = { en: "en-GB", fi: "fi-FI", sv: "sv-FI" };

// English ships in the main bundle; Finnish and Swedish load only when chosen,
// so nobody downloads texts in languages they don't use.
const loaders: Record<Lang, () => Promise<Messages>> = {
  en: async () => en,
  fi: () => import("./fi").then((m) => m.fi),
  sv: () => import("./sv").then((m) => m.sv),
};

let messages: Messages = en;
let lang: Lang = "en";

export const t = (): Messages => messages;
export const currentLang = (): Lang => lang;
export const locale = (): string => LOCALES[lang];

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "fi" || value === "sv";
}

let request = 0;

/** Switches language. Returns false when a later call took over while this one was loading. */
export async function setLang(next: Lang): Promise<boolean> {
  const mine = ++request;
  const loaded = await loaders[next]();
  if (mine !== request) return false;
  messages = loaded;
  lang = next;
  document.documentElement.lang = next;
  document.title = messages.htmlTitle;
  document.querySelector('meta[name="description"]')?.setAttribute("content", messages.metaDescription);
  const skip = document.querySelector(".skip-link");
  if (skip) skip.textContent = messages.shell.skip;
  return true;
}

/** First of the browser's preferred languages that we support, else English. */
export function detectLang(): Lang {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLang(base)) return base;
  }
  return "en";
}
