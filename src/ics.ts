import type { Card } from "./types";
import { addDays } from "./util";

/**
 * Builds an iCalendar file (RFC 5545) with one all-day event per card on its due date,
 * with a reminder at 9:00. Made in the browser, so the plan never leaves the device.
 */
export function buildIcs(cards: Card[], calendarName: string, now: Date = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MuutoKaveri//Move plan//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${text(calendarName)}`,
  ];

  for (const card of cards) {
    const description = [
      card.body,
      card.link ? `${card.link.label}: ${card.link.href}` : "",
      card.source ? `${card.source.label}: ${card.source.href}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    lines.push(
      "BEGIN:VEVENT",
      // Stable per task, so importing an updated plan replaces events instead of duplicating them.
      `UID:${card.id}@muutokaveri`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(card.due)}`,
      `DTEND;VALUE=DATE:${compact(addDays(card.due, 1))}`,
      `SUMMARY:${text(card.title)}`,
      `DESCRIPTION:${text(description)}`,
      "TRANSP:TRANSPARENT",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "TRIGGER:PT9H",
      `DESCRIPTION:${text(card.title)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

const compact = (iso: string) => iso.replaceAll("-", "");

/** Escapes a TEXT value (RFC 5545 section 3.3.11). */
function text(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

const encoder = new TextEncoder();

/** Folds a content line at 75 octets, never splitting a character (RFC 5545 section 3.1). */
function fold(line: string): string {
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let part = "";
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > limit) {
      parts.push(part);
      part = "";
      bytes = 0;
      limit = 74; // continuation lines start with a space
    }
    part += ch;
    bytes += size;
  }
  parts.push(part);
  return parts.join("\r\n ");
}

export function downloadFile(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
