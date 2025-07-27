import {
  endOfYear,
  format,
  getDayOfYear,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isSameDay,
  isSameWeek,
  isSaturday,
  isSunday,
  lastDayOfYear,
  startOfYear
} from "date-fns"
import { URLSearchParamsInit } from "react-router"
import { Kind, KINDS } from "~/modules/shared/types/achievement"

export {
  defaultFilters,
  filtersFromURLSearchParams,
  filtersToURLSearchParams,
  isDefaultFilters
}
export type { Filters, Period, Periods }

export const DATE_FORMAT = "yyyy-MM-dd"

type Filters = {
  period: Period
  from?: Date
  to?: Date
  kinds: Kind[]
}

const _periods = {
  UNLIMITED: "unlimited",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  CUSTOM: "custom",
} as const

type Periods = typeof _periods

type Period =
  Periods["UNLIMITED"] |
  Periods["DAILY"] |
  Periods["WEEKLY"] |
  Periods["MONTHLY"] |
  Periods["YEARLY"] |
  Periods["CUSTOM"]

function estimatePeriod(from?: Date | null, to?: Date | null): Period {
  if (!from) return "custom"
  if (!to) return "custom"

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

const FiltersSearchParamsKeys = {
  FROM: "from",
  TO: "to",
  PERIOD: "period",
  KINDS: "kinds"
} as const

function toOptionalDate(value?: string | null) {
  if (!value) return undefined
  return new Date(value)
}

function toPeriod(value: string | null | undefined, from?: Date, to?: Date): Period {
  switch (value) {
    case _periods.CUSTOM:
      return "custom"
    case _periods.DAILY:
      return "daily"
    case _periods.WEEKLY:
      return "weekly"
    case _periods.MONTHLY:
      return "monthly"
    case _periods.YEARLY:
      return "yearly"
    case _periods.UNLIMITED:
      return "unlimited"
    default:
      return estimatePeriod(from, to)
  }
}

function toKinds(values: string[]): Kind[] {
  const kinds: Kind[] = Object.values(KINDS)

  return values.filter(value => kinds.includes(value as Kind)) as Kind[]
}

function filtersFromURLSearchParams(params: URLSearchParams): Filters {
  const defaults = defaultFilters()

  if (!params.get(FiltersSearchParamsKeys.PERIOD)) return defaults

  const from = toOptionalDate(params.get(FiltersSearchParamsKeys.FROM)) ?? defaults.from
  const to = toOptionalDate(params.get(FiltersSearchParamsKeys.TO)) ?? defaults.to
  const kinds = toKinds(params.getAll(FiltersSearchParamsKeys.KINDS)) ?? defaults.kinds
  const period = toPeriod(params.get(FiltersSearchParamsKeys.PERIOD), from, to)

  return { kinds, from, to, period }
}

function optionalDateToParam(date?: Date | null) {
  if (!date) return undefined
  return format(date, DATE_FORMAT)
}

function kindsToParam(values: Kind[]): string[] | undefined {
  if (values.length === 0) return undefined

  // I do not care about the type, a kind is a string in the end.
  return values as string[]
}

function filtersToURLSearchParams(filters: Filters): URLSearchParams
function filtersToURLSearchParams({ kinds, period, to, from }: Filters): URLSearchParamsInit {
  return Object.fromEntries([
    [FiltersSearchParamsKeys.PERIOD, period],
    [FiltersSearchParamsKeys.FROM, optionalDateToParam(from)],
    [FiltersSearchParamsKeys.TO, optionalDateToParam(to)],
    [FiltersSearchParamsKeys.KINDS, kindsToParam(kinds)],
  ].filter(([, val]) => !!val))
}

function defaultFilters(): Filters {
  const today = new Date()

  return {
    period: "yearly",
    from: startOfYear(today),
    to: endOfYear(today),
    kinds: []
  }
}

function isDefaultFilters(filters: Filters): boolean {
  const { from, to, period, kinds } = defaultFilters()

  return (
    filters.from?.toDateString() === from?.toDateString() &&
    filters.to?.toDateString() === to?.toDateString() &&
    filters.period === period &&
    filters.kinds.length === kinds.length &&
    filters.kinds.every(kind => kinds.includes(kind))
  )
}
