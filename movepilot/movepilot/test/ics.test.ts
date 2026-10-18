import { test } from "node:test";
import assert from "node:assert/strict";
import { buildIcs } from "../src/ics";
import type { Card } from "../src/types";

const card: Card = {
  id: "water-valve",
  phase: "moving-day",
  priority: "high",
  tag: "leak",
  due: "2026-10-31",
  title: "Etsi päävesiventtiili; heti, kun saavut",
  body: "Vuodossa jokainen minuutti on tärkeä, joten etsi venttiili ennen kuin puret laatikoita.\nKerro muillekin.",
};

const ics = buildIcs([card], "Muutto: Turku", new Date("2026-10-18T09:30:00Z"));
const lines = ics.split("\r\n");
const unfolded = ics.replace(/\r\n /g, "");

test("all-day event on the due date with a reminder", () => {
  assert.ok(lines.includes("DTSTART;VALUE=DATE:20261031"));
  assert.ok(lines.includes("DTEND;VALUE=DATE:20261101"));
  assert.ok(lines.includes("DTSTAMP:20261018T093000Z"));
  assert.ok(lines.includes("TRIGGER:PT9H"));
  assert.ok(lines.includes("UID:water-valve@movepilot"));
});

test("text values are escaped", () => {
  assert.ok(unfolded.includes("SUMMARY:Etsi päävesiventtiili\\; heti\\, kun saavut"));
  assert.ok(unfolded.includes("tärkeä\\, joten"));
  assert.ok(unfolded.includes("laatikoita.\\nKerro"));
});

test("lines are folded at 75 octets without splitting characters", () => {
  const enc = new TextEncoder();
  for (const line of lines) assert.ok(enc.encode(line).length <= 75, line);
  assert.ok(unfolded.includes("Vuodossa jokainen minuutti on tärkeä"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
});
