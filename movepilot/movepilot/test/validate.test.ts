import { test } from "node:test";
import assert from "node:assert/strict";
import { inputProblem, isMoveInput } from "../src/validate";
import type { MoveInput } from "../src/types";

const ok: MoveInput = {
  moveDate: "2026-10-31",
  city: "Pietarsaari - Jakobstad",
  homeType: "apartment",
  buildingYear: 1972,
  washerAge: null,
  dishwasherAge: 0,
  knowsCover: "yes",
};

test("accepts valid answers, including Nordic letters and hyphens", () => {
  assert.equal(inputProblem(ok), null);
  assert.equal(inputProblem({ ...ok, city: "Mäntsälä" }), null);
});

test("reports the first problem", () => {
  assert.equal(inputProblem({ ...ok, moveDate: "" }), "date");
  assert.equal(inputProblem({ ...ok, moveDate: "2026-02-31" }), "date");
  assert.equal(inputProblem({ ...ok, city: "<script>" }), "city");
  assert.equal(inputProblem({ ...ok, buildingYear: 1700 }), "year");
  assert.equal(inputProblem({ ...ok, buildingYear: 1985.5 }), "year");
  assert.equal(inputProblem({ ...ok, washerAge: -1 }), "age");
  assert.equal(inputProblem({ ...ok, dishwasherAge: 2.5 }), "age");
  assert.equal(inputProblem({ ...ok, dishwasherAge: Number.NaN }), "age");
});

test("rejects tampered saved data", () => {
  assert.ok(isMoveInput(ok));
  assert.ok(!isMoveInput(null));
  assert.ok(!isMoveInput({ ...ok, homeType: "castle" }));
  assert.ok(!isMoveInput({ ...ok, knowsCover: "maybe" }));
  assert.ok(!isMoveInput({ ...ok, city: 42 }));
});
