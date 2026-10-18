import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SECURITY_HEADERS } from "../server/headers";

type VercelConfig = { headers: { source: string; headers: { key: string; value: string }[] }[] };

test("vercel.json sends the same security headers as the Express server", () => {
  const config = JSON.parse(readFileSync("vercel.json", "utf8")) as VercelConfig;
  const all = config.headers.find((h) => h.source === "/(.*)");
  assert.ok(all, "vercel.json needs a header rule for every path");
  assert.deepEqual(Object.fromEntries(all.headers.map((h) => [h.key, h.value])), SECURITY_HEADERS);
});

test("the policy lets the self-hosted font load", () => {
  assert.match(SECURITY_HEADERS["Content-Security-Policy"]!, /font-src 'self'/);
});
