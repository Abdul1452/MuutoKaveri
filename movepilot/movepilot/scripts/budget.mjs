// Page-weight budget: fails if the first visit downloads more than BUDGET_KB compressed,
// counting the page, its scripts and styles, and the web font the styles load.
// Run after `npm run build`. Part of the definition of done (docs/SUSTAINABILITY.md, action 6).
import { readFileSync, readdirSync } from "node:fs";
import { gzipSync, brotliCompressSync } from "node:zlib";
import path from "node:path";

// 50 kB for code plus about 10 kB headroom for the self-hosted Latin font subset (29 kB woff2 is already
// compressed, so it counts at its file size).
const BUDGET_KB = 60;
const dist = path.resolve("dist");
const html = readFileSync(path.join(dist, "index.html"), "utf8");

// Files the first visit loads: the page and every asset it links to.
const initial = new Set(["index.html", ...[...html.matchAll(/(?:src|href)="\/(assets\/[^"]+)"/g)].map((m) => m[1])]);
// Fonts the first-visit stylesheets load. Only the Latin subset is referenced, so that is all that loads.
for (const file of [...initial].filter((f) => f.endsWith(".css"))) {
  const css = readFileSync(path.join(dist, file), "utf8");
  for (const m of css.matchAll(/url\((?:")?\/(assets\/[^")]+\.woff2)/g)) initial.add(m[1]);
}
const all = ["index.html", ...readdirSync(path.join(dist, "assets")).map((f) => `assets/${f}`)];

const kb = (n) => (n / 1024).toFixed(1).padStart(6);
let firstVisit = 0;
console.log("file".padEnd(44), "  raw kB   gzip kB   br kB");
for (const file of all) {
  const data = readFileSync(path.join(dist, file));
  // woff2 is already compressed and is sent as is.
  const gz = file.endsWith(".woff2") ? data.length : gzipSync(data, { level: 9 }).length;
  const br = brotliCompressSync(data).length;
  const tag = initial.has(file) ? "" : "  (loaded only when needed)";
  if (initial.has(file)) firstVisit += gz;
  console.log(file.padEnd(44), kb(data.length), "  ", kb(gz), "  ", kb(br), tag);
}

console.log(`\nFirst visit: ${(firstVisit / 1024).toFixed(1)} kB gzip (budget ${BUDGET_KB} kB).`);
if (firstVisit > BUDGET_KB * 1024) {
  console.error("Over the page-weight budget.");
  process.exit(1);
}
