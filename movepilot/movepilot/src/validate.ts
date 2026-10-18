import type { MoveInput } from "./types";
import { isIsoDate } from "./util";

// Letters (incl. å, ä, ö), spaces and hyphens only; the server checks the same pattern.
export const CITY_PATTERN = /^[\p{L} -]{2,40}$/u;

export type InputProblem = "date" | "city" | "year" | "age";

const validAge = (age: unknown) => age === null || (Number.isInteger(age) && (age as number) >= 0 && (age as number) <= 40);

/** First problem with the answers, or null when they're fine. Also used to check saved data. */
export function inputProblem(input: MoveInput): InputProblem | null {
  if (!isIsoDate(input.moveDate)) return "date";
  if (typeof input.city !== "string" || !CITY_PATTERN.test(input.city)) return "city";
  if (!Number.isInteger(input.buildingYear) || input.buildingYear < 1800 || input.buildingYear > 2030) return "year";
  if (!validAge(input.washerAge) || !validAge(input.dishwasherAge)) return "age";
  return null;
}

/** Type guard for data read back from local storage. */
export function isMoveInput(value: unknown): value is MoveInput {
  if (!value || typeof value !== "object") return false;
  const v = value as MoveInput;
  return (
    (v.homeType === "apartment" || v.homeType === "house") &&
    (v.knowsCover === "yes" || v.knowsCover === "no" || v.knowsCover === "unsure") &&
    inputProblem(v) === null
  );
}
