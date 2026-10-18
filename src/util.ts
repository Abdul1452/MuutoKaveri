/** Escapes text before it goes into innerHTML. Use for everything the user typed. */
export function esc(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Dates are plain YYYY-MM-DD strings. They are read at noon UTC and formatted in UTC,
// so a date never shifts by a day because of the user's time zone.
const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function formatDate(iso: string, locale = "en-GB"): string {
  return toDate(iso).toLocaleDateString(locale, {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatNumber(value: number, locale = "en-GB"): string {
  return value.toLocaleString(locale, { maximumFractionDigits: 1 });
}

export function addDays(iso: string, days: number): string {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86_400_000);
}

export function monthOf(iso: string): number {
  return toDate(iso).getUTCMonth() + 1;
}

export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Helsinki" }).format(new Date());
}

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  // Round-trip, so impossible dates such as 2026-02-31 (which Date rolls over to March) are rejected.
  const d = toDate(value);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
