import { getTodayDateString } from "./date";

export type DailyEntry = {
  date: string; // YYYY-MM-DD
  roll?: number; // 1..20, only when source="roll"
  activityId: string;
  source: "roll" | "manual";
  done: boolean;
  minutes?: number;
  km?: number;
  note?: string;
  updatedAt: number;
};

export type AppState = {
  version: 1;
  entriesByDate: Record<string, DailyEntry>;
};

export const STORAGE_KEY = "moni-egeszseg-jatek:v1";

export const emptyState = (): AppState => ({
  version: 1,
  entriesByDate: {},
});

const isValidEntry = (value: any): value is DailyEntry => {
  if (!value || typeof value !== "object") return false;
  const hasRoll = typeof value.roll === "number";
  if (value.source === "roll" && !hasRoll) return false;
  return (
    typeof value.date === "string" &&
    typeof value.activityId === "string" &&
    (value.source === "roll" || value.source === "manual") &&
    typeof value.done === "boolean" &&
    typeof value.updatedAt === "number"
  );
};

export const loadAppState = (): AppState => {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || typeof parsed.entriesByDate !== "object") {
      return emptyState();
    }
    const cleanEntries: Record<string, DailyEntry> = {};
    let migrated = false;

    Object.entries(parsed.entriesByDate).forEach(([date, entry]) => {
      let candidate = entry as any;
      // Migration: add source/updatedAt defaults and allow missing roll for manual entries
      if (!candidate.source) {
        candidate = {
          ...candidate,
          source: typeof candidate.roll === "number" ? "roll" : "manual",
        };
        migrated = true;
      }
      if (typeof candidate.updatedAt !== "number") {
        candidate = { ...candidate, updatedAt: Date.now() };
        migrated = true;
      }

      if (isValidEntry(candidate)) {
        cleanEntries[date] = candidate;
      }
    });

    const finalState: AppState = { version: 1, entriesByDate: cleanEntries };
    if (migrated) {
      saveAppState(finalState);
    }
    return finalState;
  } catch (err) {
    console.error("Failed to parse stored data", err);
    return emptyState();
  }
};

export const saveAppState = (state: AppState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save state", err);
  }
};

export const upsertEntry = (
  state: AppState,
  date: string,
  update: (prev?: DailyEntry) => DailyEntry
): AppState => {
  const prev = state.entriesByDate[date];
  const nextEntry = update(prev);
  return {
    ...state,
    entriesByDate: {
      ...state.entriesByDate,
      [date]: {
        ...nextEntry,
        date,
        updatedAt: Date.now(),
      },
    },
  };
};

export const removeEntry = (state: AppState, date: string): AppState => {
  const nextEntries = { ...state.entriesByDate };
  delete nextEntries[date];
  return { ...state, entriesByDate: nextEntries };
};

export const getTodayEntry = (state: AppState) => {
  const today = getTodayDateString();
  return state.entriesByDate[today];
};
