import { getDayOfYear, isFirstDayOfMonth, isLastDayOfMonth, isSameDay, isSameWeek, isSaturday, isSunday, lastDayOfYear } from "date-fns";
import { Period } from "../types/transactions";

export function estimatePeriod(from: Date, to: Date): Period {
  switch (true) {
    case getDayOfYear(from) === 1 && isSameDay(lastDayOfYear(from), to):
      return "yearly"
    case isFirstDayOfMonth(from) && isLastDayOfMonth(to):
      return "monthly"
    case isSameWeek(from, to) && isSunday(from) && isSaturday(to):
      return "weekly"
    case isSameDay(from, to):
      return "daily"
    default:
      return "custom"
  }
}