import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPlan, leakRiskReasons, moveWindow } from "../src/rules";
import type { Forecast, MoveInput } from "../src/types";

const base: MoveInput = {
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
  days: [
    { date: "2026-10-19", minTemp: -1.8, maxWind: 6.2, rainMm: 0 },
    { date: "2026-10-20", minTemp: 2, maxWind: 16.3, rainMm: 11.4 },
  ],
};

const ids = (input: MoveInput, f: Forecast | null = forecast) => buildPlan(input, f).map((c) => c.id);

test("every card has a unique id and a due date", () => {
  const cards = buildPlan(base, forecast);
  assert.equal(new Set(cards.map((c) => c.id)).size, cards.length);
  for (const c of cards) assert.match(c.due, /^\d{4}-\d{2}-\d{2}$/);
});

test("unknown cover makes the cover check important", () => {
  const card = (k: MoveInput["knowsCover"]) =>
    buildPlan({ ...base, knowsCover: k }, null).find((c) => c.id === "cover-check")!;
  assert.equal(card("unsure").priority, "high");
  assert.equal(card("no").priority, "high");
  assert.equal(card("yes").priority, "normal");
});

test("appliance age picks the right leak card", () => {
  assert.ok(ids(base).includes("appliance-old-washing-machine"));
  assert.ok(ids(base).includes("appliance-check-dishwasher"));
  const none = ids({ ...base, washerAge: null, dishwasherAge: 2 });
  assert.ok(!none.some((id) => id.startsWith("appliance-")));
});

test("old buildings get the pipe card and an important valve card", () => {
  const old = buildPlan(base, null);
  assert.ok(old.some((c) => c.id === "pipe-history"));
  assert.equal(old.find((c) => c.id === "water-valve")!.priority, "high");
  const recent = buildPlan({ ...base, buildingYear: 2015 }, null);
  assert.ok(!recent.some((c) => c.id === "pipe-history"));
  assert.equal(recent.find((c) => c.id === "water-valve")!.priority, "normal");
});

test("weather cards come from forecast days around the move", () => {
  const cards = buildPlan(base, forecast);
  const frost = cards.find((c) => c.id === "weather-frost")!;
  assert.equal(frost.due, "2026-10-19");
  assert.equal(frost.phase, "before");
  assert.equal(cards.find((c) => c.id === "weather-wind")!.phase, "moving-day");
  assert.ok(cards.some((c) => c.id === "weather-rain"));
  assert.ok(!cards.some((c) => c.id === "weather-check"));
});

test("a move beyond the forecast gets a reminder to check it, not stale weather", () => {
  const later = { ...base, moveDate: "2026-12-15" };
  assert.equal(moveWindow(later, forecast).length, 0);
  const got = ids(later);
  assert.ok(got.includes("weather-check"));
  assert.ok(!got.includes("weather-frost"));
  assert.ok(got.includes("weather-season"), "December is a winter move");
});

test("summer moves get no winter card", () => {
  assert.ok(!ids({ ...base, moveDate: "2026-06-15" }, null).includes("weather-season"));
});

test("sustainable move cards are always included", () => {
  const got = ids(base, null);
  for (const id of ["declutter", "boxes", "waste", "heating"]) assert.ok(got.includes(id), id);
});

test("due dates are relative to the move date", () => {
  const cards = buildPlan(base, null);
  const due = (id: string) => cards.find((c) => c.id === id)!.due;
  assert.equal(due("declutter"), "2026-09-29");
  assert.equal(due("water-valve"), "2026-10-20");
  assert.equal(due("pipe-history"), "2026-11-19");
});

test("the leak sensor offer is shown only to homes with a raised risk", () => {
  assert.deepEqual(leakRiskReasons({ ...base, buildingYear: 2015, washerAge: 2, dishwasherAge: null }), []);
  assert.equal(leakRiskReasons(base).length, 2); // 1985 building, 8-year-old washing machine
});
