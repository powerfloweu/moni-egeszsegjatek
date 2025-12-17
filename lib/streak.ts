import { addDays } from "./date";
import { DailyEntry } from "./storage";

export const calculateStreak = (
  entriesByDate: Record<string, DailyEntry>,
  today: string
): number => {
  const todayEntry = entriesByDate[today];
  if (!todayEntry || !todayEntry.done) return 0;

  let streak = 0;
  let cursor = today;

  while (true) {
    const entry = entriesByDate[cursor];
    if (!entry || !entry.done) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};
