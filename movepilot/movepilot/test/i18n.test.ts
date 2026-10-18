import { test } from "node:test";
import assert from "node:assert/strict";
import { en } from "../src/i18n/en";
import { fi } from "../src/i18n/fi";
import { sv } from "../src/i18n/sv";
import { buildPlan } from "../src/rules";
import type { Forecast, MoveInput } from "../src/types";

type Tree = Record<string, unknown>;

/** Every leaf path with its kind, so two catalogs can be compared. */
function shape(value: unknown, path = ""): string[] {
  if (typeof value === "function") return [`${path}:fn${value.length}`];
  if (Array.isArray(value)) return [`${path}:array${value.length}`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === "object")
    return Object.entries(value as Tree).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  return [`${path}:${typeof value}`];
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value as Tree).flatMap(strings);
  return [];
}

const input: MoveInput = {
  moveDate: "2026-10-20",
  city: "Turku",
  homeType: "house",
  buildingYear: 1985,
  washerAge: 8,
  dishwasherAge: 5,
  knowsCover: "unsure",
};
const forecast: Forecast = {
  city: "Turku",
  source: "fmi",
  days: [{ date: "2026-10-19", minTemp: -1.8, maxWind: 16, rainMm: 12 }],
};

for (const [name, messages, locale] of [["fi", fi, "fi-FI"], ["sv", sv, "sv-FI"]] as const) {
  test(`${name} has the same keys, arrays and function arities as en`, () => {
    assert.deepEqual(shape(messages), shape(en));
  });

  test(`${name} has no empty texts`, () => {
    for (const s of strings(messages)) assert.ok(s.trim().length > 0);
  });

  test(`${name} keeps the source links unchanged`, () => {
    assert.deepEqual(
      messages.footer.sourceItems.map((s) => s.href),
      en.footer.sourceItems.map((s) => s.href),
    );
  });

  test(`${name} builds the same plan as en`, () => {
    const local = buildPlan(input, forecast, messages, locale);
    const english = buildPlan(input, forecast);
    assert.deepEqual(local.map((c) => c.id), english.map((c) => c.id));
    for (const c of local) assert.ok(c.title.trim() && c.body.trim());
  });
}
