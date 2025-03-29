import { format } from "date-fns"
import { URLSearchParamsInit } from "react-router"

export { fromURLSearchParams, toURLSearchParamsInit }
export type { Filters }

type Filters = {
  from?: Date
  to?: Date
  accounts: number[]
  categories: number[]
}

/* URLSearchParams mapping */

// URLSearchParams keys
const FROM = "from"
const TO = "to"
const ACCOUNTS = "accounts"
const CATEGORIES = "categories"

// Date format strings
const DATE_FORMAT = "yyyy-MM-dd"

function toOptionalDate(value: string | null | undefined) {
  if (!value) return undefined
  return new Date(value)
}

function toNumbers(values: string[] | null | undefined) {
  if (!values) return []
  if (values.length === 0) return []
  return values.map(val => Number(val))
}

function optionalDateToParam(date: Date | undefined | null) {
  if (!date) return undefined
  return format(date, DATE_FORMAT)
}

function numbersToParam(numbers: number[]) {
  if (numbers.length > 0) return numbers.map(n => n.toString())
  return undefined
}

function toURLSearchParamsInit({ from, to, accounts, categories }: Filters): URLSearchParamsInit {
  return Object.fromEntries([
    [FROM, optionalDateToParam(from)],
    [TO, optionalDateToParam(to)],
    [ACCOUNTS, numbersToParam(accounts)],
    [CATEGORIES, numbersToParam(categories)]
  ].filter(([, val]) => !!val))
}

function fromURLSearchParams(params: URLSearchParams): Filters {
  return {
    from: toOptionalDate(params.get(FROM)),
    to: toOptionalDate(params.get(TO)),
    accounts: toNumbers(params.getAll(ACCOUNTS)),
    categories: toNumbers(params.getAll(CATEGORIES))
  }
}
