import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns"
import { use, useCallback } from "react"
import { Period } from "~/modules/ledger/types/filters"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "~/modules/shared/components/ui/sidebar"
import { FiltersContext } from "../../../contexts/filters-context"
import { ByPeriod } from "../period"
import { ByDay } from "./by-day"
import { ByMonth } from "./by-month"
import { ByRange } from "./by-range"
import { ByWeek } from "./by-week"
import { ByYear } from "./by-year"

export function DateFilters() {
  const { filters, setFilters } = use(FiltersContext)

  const onPeriodChange = useCallback((period: Period) => {
    setFilters(prev => ({
      ...prev,
      period,
      from: period === "unlimited" ? undefined : prev.from,
      to: period === "unlimited" ? undefined : prev.to
    }))
  }, [setFilters])

  const onDateChange = useCallback((from: Date | undefined, to: Date | undefined) => {
    setFilters(prev => ({ ...prev, from, to }))
  }, [setFilters])

  return (
    <SidebarGroup className="m-0">
      <SidebarGroupLabel>
        Filter by Date
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col justify-center items-center">
        <ByPeriod
          value={filters.period}
          onChange={onPeriodChange}
        />
        <ByDate
          period={filters.period}
          from={filters.from}
          to={filters.to}
          onChange={onDateChange}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

interface ByDateProps {
  period: Period
  from?: Date
  to?: Date
  onChange: (from: Date | undefined, to: Date | undefined) => void
}

function ByDate({ from, to, period, onChange }: ByDateProps) {
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
        <ByMonth
          value={to}
          onChange={(date) => onChange(startOfMonth(date), endOfMonth(date))}
        />
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