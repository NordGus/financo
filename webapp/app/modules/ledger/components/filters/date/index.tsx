import { endOfYear, startOfYear } from "date-fns"
import { Period } from "~/modules/ledger/types/filters"
import { ByDay } from "./by-day"
import { ByRange } from "./by-range"
import { ByWeek } from "./by-week"
import { ByYear } from "./by-year"

interface ByDateProps {
  period: Period
  from?: Date
  to?: Date
  onChange: (from: Date | undefined, to: Date | undefined) => void
}

export function ByDate({ from, to, period, onChange }: ByDateProps) {
  switch (period) {
    case "yearly":
      return (
        <ByYear
          value={to}
          onChange={(date) => onChange(startOfYear(date), endOfYear(date))}
        />
      )
    case "monthly":
      return (
        <span>To be Implemented</span>
      )
    case "weekly":
      return (
        <ByWeek
          value={{ from, to }}
          onChange={(from, to) => onChange(from, to)} // it already comes as a date range within a week
        />
      )
    case "daily":
      return (
        <ByDay
          value={to}
          onChange={(day) => onChange(day, day)}
        />
      )
    case "custom":
      return (
        <ByRange
          value={{ from, to }}
          onChange={(from, to) => onChange(from, to)}
        />
      )
    case "unlimited":
    default:
      return null
  }
}