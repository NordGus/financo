/*
  This module defines types and functions for handling filters in a ledger application.
  It includes period estimation, URL search parameters conversion, and default values.
*/

import {
  add,
  format,
  getDayOfYear,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isSameDay,
  isSameWeek,
  isSaturday,
  isSunday,
  lastDayOfYear
} from "date-fns"
import { URLSearchParamsInit } from "react-router"

export { FiltersSearchParamsKeys, fromURLSearchParams, toURLSearchParamsInit }
export type { Filters, Period }

/**
  Defines the keys in the URLSearchParams that map to Filters.
*/
const FiltersSearchParamsKeys = {
  PERIOD: "period",
  FROM: "from",
  TO: "to",
  ACCOUNTS: "accounts",
  CATEGORIES: "categories",
} as const

// Date format strings
const DATE_FORMAT = "yyyy-MM-dd"

/**
 Filters interface defines the structure of filter parameters used in the ledger application.
*/
type Filters = {
  period: Period
  from?: Date
  to?: Date
  accounts: number[]
  categories: number[]
}

/**
  Defines the possible period values for filtering transactions.
  - UNLIMITED: Entire ledger history
  - DAILY: Transactions within a single day
  - WEEKLY: Transactions within a week
  - MONTHLY: Transactions within a month
  - YEARLY: Transactions within a year
  - CUSTOM: Transactions within a finite none structured date range
*/
const _periods = {
  UNLIMITED: "unlimited",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  CUSTOM: "custom",
} as const

/**
  Defines the possible period values for filtering transactions.
*/
type Periods = typeof _periods

/**
  Period is the different periods that the ledger can be filtered by.
  - unlimited: Entire ledger history
  - daily: Transactions within a single day
  - weekly: Transactions within a week
  - monthly: Transactions within a month
  - yearly: Transactions within a year
  - custom: Transactions within a finite none structured date range
*/
type Period =
  Periods["UNLIMITED"] |
  Periods["DAILY"] |
  Periods["WEEKLY"] |
  Periods["MONTHLY"] |
  Periods["YEARLY"] |
  Periods["CUSTOM"]

/**
  Estimates the period based on the provided date range.
  - If the start date is the first day of the year and the end date is the last day of the year, it returns "yearly".
  - If the start date is the first day of the month and the end date is the last day of the month, it returns "monthly".
  - If the start date is the first day of the week and the end date is the last day of the week, it returns "weekly".
  - If the start date and end date are the same, it returns "daily".
  - Otherwise, it returns "custom".
*/
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

/**
  Converts a given URLSearchParam value to a Period.
  - If the value is "custom", "daily", "weekly", "monthly", "yearly", or "unlimited", it returns the corresponding Period.
  - Otherwise, it estimates the period based on the provided date range.
*/
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

/**
  Converts a given URLSearchParam value to an optional Date.
  - If the value is null or undefined, it returns undefined.
  - Otherwise, it returns a new Date object created from the value.
*/
function toOptionalDate(value?: string | null) {
  if (!value) return undefined
  return new Date(value)
}

/**
  Converts a given URLSearchParam values to an array of numbers.
  - If the value is null or empty, it returns an empty array.
  - Otherwise, transform it to number[].
*/
function toNumbers(values?: string[] | null) {
  if (!values) return []
  if (values.length === 0) return []
  return values.map(val => Number(val))
}

/**
  Converts an optional Date to a URLSearchParam value.
  - If the date is null or undefined, it returns undefined.
  - Otherwise, it returns the date formatted as a string using the DATE_FORMAT format string.
*/
function optionalDateToParam(date?: Date | null) {
  if (!date) return undefined
  return format(date, DATE_FORMAT)
}

/**
  Converts an array of numbers to a URLSearchParam value.
  - If the array is empty, it returns undefined.
  - Otherwise, it returns the values as string[].
*/
function numbersToParam(numbers: number[]) {
  if (numbers.length > 0) return numbers.map(n => n.toString())
  return undefined
}

/**
  Converts Filters to URLSearchParamsInit.
  Filters that are not set are omitted from the URLSearchParams.
*/
function toURLSearchParamsInit({ period, from, to, accounts, categories }: Filters): URLSearchParamsInit {
  return Object.fromEntries([
    [FiltersSearchParamsKeys.PERIOD, period],
    [FiltersSearchParamsKeys.FROM, optionalDateToParam(from)],
    [FiltersSearchParamsKeys.TO, optionalDateToParam(to)],
    [FiltersSearchParamsKeys.ACCOUNTS, numbersToParam(accounts)],
    [FiltersSearchParamsKeys.CATEGORIES, numbersToParam(categories)]
  ].filter(([, val]) => !!val))
}

/**
  Converts URLSearchParams to Filters.
  If the period is not specified, it returns default values.
*/
function fromURLSearchParams(params: URLSearchParams): Filters {
  if (!params.get(FiltersSearchParamsKeys.PERIOD)) return defaultValues()

  const from = toOptionalDate(params.get(FiltersSearchParamsKeys.FROM))
  const to = toOptionalDate(params.get(FiltersSearchParamsKeys.TO))
  const accounts = toNumbers(params.getAll(FiltersSearchParamsKeys.ACCOUNTS))
  const categories = toNumbers(params.getAll(FiltersSearchParamsKeys.CATEGORIES))
  const period = toPeriod(params.get(FiltersSearchParamsKeys.PERIOD), from, to)

  return { period, from, to, accounts, categories }
}

/**
  Returns default values for Filters.
  The default period is "custom", and the date range is set to the last month.
*/
function defaultValues(): Filters {
  return {
    period: "custom",
    from: new Date(),
    to: add(new Date(), { months: -1 }),
    accounts: [],
    categories: []
  }
}
