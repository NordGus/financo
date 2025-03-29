import { add, format, getDayOfYear, isFirstDayOfMonth, isLastDayOfMonth, isSameDay, isSameWeek, isSaturday, isSunday, lastDayOfYear } from "date-fns"
import { URLSearchParamsInit } from "react-router"

export { fromURLSearchParams, toURLSearchParamsInit }
export type { Filters, Period }

// URLSearchParams keys
const PERIOD = "period"
const FROM = "from"
const TO = "to"
const ACCOUNTS = "accounts"
const CATEGORIES = "categories"
// Date format strings
const DATE_FORMAT = "yyyy-MM-dd"

type Filters = {
  period: Period
  from?: Date
  to?: Date
  accounts: number[]
  categories: number[]
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

function toOptionalDate(value?: string | null) {
  if (!value) return undefined
  return new Date(value)
}

function toNumbers(values?: string[] | null) {
  if (!values) return []
  if (values.length === 0) return []
  return values.map(val => Number(val))
}

function optionalDateToParam(date?: Date | null) {
  if (!date) return undefined
  return format(date, DATE_FORMAT)
}

function numbersToParam(numbers: number[]) {
  if (numbers.length > 0) return numbers.map(n => n.toString())
  return undefined
}

function toURLSearchParamsInit({ period, from, to, accounts, categories }: Filters): URLSearchParamsInit {
  return Object.fromEntries([
    [PERIOD, period],
    [FROM, optionalDateToParam(from)],
    [TO, optionalDateToParam(to)],
    [ACCOUNTS, numbersToParam(accounts)],
    [CATEGORIES, numbersToParam(categories)]
  ].filter(([, val]) => !!val))
}

function fromURLSearchParams(params: URLSearchParams): Filters {
  if (!params.get(PERIOD)) return defaultValues()

  const from = toOptionalDate(params.get(FROM))
  const to = toOptionalDate(params.get(TO))
  const accounts = toNumbers(params.getAll(ACCOUNTS))
  const categories = toNumbers(params.getAll(CATEGORIES))
  const period = toPeriod(params.get(PERIOD), from, to)

  return { period, from, to, accounts, categories }
}

function defaultValues(): Filters {
  return {
    period: "custom",
    from: new Date(),
    to: add(new Date(), { months: -1 }),
    accounts: [],
    categories: []
  }
}
