import { add, differenceInDays, endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear, sub } from "date-fns";
import { Period } from "../types/transactions";

type Range = {
  from: Date
  to: Date
}

export enum Movement {
  Forwards,
  Backwards
}

export function calculateDateRangeMovement(direction: Movement.Forwards, from: Date, to: Date, period: Period): Range
export function calculateDateRangeMovement(direction: Movement.Backwards, to: Date, from: Date, period: Period): Range
export function calculateDateRangeMovement(direction: Movement, from: Date, to: Date, period: Period): Range {
  const operation = direction === Movement.Forwards ? add : sub
  let start = new Date(from.toISOString())
  let end = new Date(to.toISOString())

  if (period === "yearly") {
    const point = operation(to, { months: 1 })

    start = startOfYear(point)
    end = endOfYear(point)
  } else if (period === "monthly") {
    const point = operation(to, { weeks: 1 })

    start = startOfMonth(point)
    end = endOfMonth(point)
  } else if (period === "weekly") {
    const point = operation(to, { days: 1 })

    start = startOfWeek(point)
    end = endOfWeek(point)
  } else if (period === "daily") {
    start = operation(from, { days: 1 })
    end = operation(to, { days: 1 })
  } else if (direction === Movement.Backwards) {
    const diff = differenceInDays(end, start)
    const point = operation(to, { days: 1 })

    start = operation(point, { days: Math.abs(diff) })
    end = point
  } else {
    const diff = differenceInDays(end, start)
    const point = operation(to, { days: 1 })

    start = point
    end = operation(point, { days: Math.abs(diff) })
  }

  return { from: start, to: end }
}