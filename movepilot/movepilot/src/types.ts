export type HomeType = "apartment" | "house";
export type CoverKnowledge = "yes" | "no" | "unsure";
export type Phase = "before" | "moving-day" | "first-30";
export type Tag = "insurance" | "leak" | "weather" | "admin" | "safety" | "green";
export type Lang = "en" | "fi" | "sv";
export type Screen = "form" | "loading" | "plan" | "summary";

export interface MoveInput {
  moveDate: string; // YYYY-MM-DD
  city: string;
  homeType: HomeType;
  buildingYear: number;
  washerAge: number | null; // years, null = no washing machine
  dishwasherAge: number | null; // years, null = no dishwasher
  knowsCover: CoverKnowledge;
}

export interface ForecastDay {
  date: string; // YYYY-MM-DD, Helsinki time
  minTemp: number | null; // °C
  maxWind: number | null; // m/s
  rainMm: number | null; // daily total
}

export interface Forecast {
  city: string;
  source: "fmi" | "saved" | "sample";
  savedAt?: string;
  days: ForecastDay[];
}

export interface Card {
  id: string;
  phase: Phase;
  priority: "high" | "normal";
  tag: Tag;
  title: string;
  body: string;
  due: string; // YYYY-MM-DD, the suggested last day to do it
  link?: { label: string; href: string };
  source?: { label: string; href: string };
}

/** Facts about the new home the user writes down on moving day. */
export interface HomeNotes {
  waterValve: string;
  fuseBox: string;
  maintenancePhone: string;
  electricityMeter: string;
  waterMeter: string;
}
