// Checks WCAG 2.1 contrast for every colour pair the UI uses, in light and dark mode.
// Reads the tokens straight from src/styles.css, so a colour change that breaks AA fails the check.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const darkStart = css.indexOf("@media (prefers-color-scheme: dark)");
const tokens = (block) => Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]));
const light = tokens(css.slice(0, darkStart));
const dark = { ...light, ...tokens(css.slice(darkStart, css.indexOf("/* ---------- Base", darkStart))) };

// [foreground, background, minimum ratio]. 4.5 for text, 3 for borders and graphics.
const PAIRS = [
  ["ink", "surface", 4.5], ["ink", "mist", 4.5], ["ink", "surface-2", 4.5],
  ["muted", "surface", 4.5], ["muted", "mist", 4.5], ["muted", "surface-2", 4.5],
  ["violet-text", "surface", 4.5], ["violet-text", "mist", 4.5], ["violet-text", "violet-soft", 4.5],
  ["on-violet", "violet", 4.5], ["on-violet", "violet-hover", 4.5], ["on-violet", "violet-deep", 4.5],
  ["on-violet-muted", "violet", 4.5],
  ["risk", "risk-soft", 4.5], ["risk", "surface", 4.5], ["risk", "mist", 4.5],
  ["green", "green-soft", 4.5], ["blue", "blue-soft", 4.5], ["blue", "surface", 4.5],
  ["amber", "amber-soft", 4.5], ["slate", "slate-soft", 4.5],
  ["control", "surface", 3], ["violet", "surface", 3], ["fill", "track", 3], ["focus", "mist", 3], ["focus", "surface", 3],
  ["focus-on-violet", "violet", 3], ["focus-on-violet", "violet-deep", 3],
  ["ink", "mist-2", 4.5], ["muted", "mist-2", 4.5], ["violet-text", "mist-2", 4.5],
  ["ink", "mist-3", 4.5], ["muted", "mist-3", 4.5], ["on-violet", "violet", 4.5],
];

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failures = 0;
for (const [mode, t] of [["light", light], ["dark", dark]]) {
  for (const [fg, bg, min] of PAIRS) {
    if (!t[fg] || !t[bg]) {
      console.error(`${mode}: missing token --${!t[fg] ? fg : bg}`);
      failures++;
      continue;
    }
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(`${ok ? "ok  " : "FAIL"} ${mode.padEnd(5)} --${fg} on --${bg}: ${r.toFixed(2)}:1 (min ${min})`);
  }
}
if (failures) {
  console.error(`\n${failures} contrast problem(s).`);
  process.exit(1);
}
console.log("\nAll colour pairs meet WCAG 2.1 AA.");
