import { URLSearchParamsInit } from "react-router"
import { ListFilters } from "~/modules/accounts/types/filters"
import { KINDS, Kind } from "~/modules/shared/types/achievement"
import { Currency } from "~/modules/shared/types/currency"

export { filtersFromURLSearchParams, filtersToURLSearchParams }
export type { Filters }

type Filters = {
  kinds: Kind[]
  currencies: Currency[]
}

const FiltersSearchParamsKeys = {
  KINDS: "kinds",
  KIND: "kind",
  ARCHIVED: "archived",
  CURRENCIES: "currencies"
} as const

function toKinds(values: string[]): Kind[] {
  const kinds: Kind[] = Object.values(KINDS)

  return values.filter(value => kinds.includes(value as Kind)) as Kind[]
}

function toCurrencies(values: string[]): Currency[] {
  const currencies: Currency[] = ["CAD", "USD", "EUR", "CHF", "GBP"]

  return values.filter(value => currencies.includes(value as Currency)) as Currency[]
}

function filtersFromURLSearchParams(params: URLSearchParams): Filters {
  const defaults = defaultListFilters()

  const kinds = toKinds(params.getAll(FiltersSearchParamsKeys.KINDS)) ?? defaults.kinds
  const currencies = toCurrencies(params.getAll(FiltersSearchParamsKeys.CURRENCIES)) ?? defaults.currencies

  return { kinds, currencies }
}

function kindsToParam(values: Kind[]): string[] | undefined {
  if (values.length === 0) return undefined

  // I do not care about the type, a kind is a string in the end.
  return values as string[]
}

function currenciesToParam(values: Currency[]): string[] | undefined {
  if (values.length === 0) return undefined

  // I do not care about the type, a kind is a string in the end.
  return values as string[]
}

function filtersToURLSearchParams(filters: Filters): URLSearchParams
function filtersToURLSearchParams({ kinds, currencies }: Filters): URLSearchParamsInit {
  return Object.fromEntries([
    [FiltersSearchParamsKeys.KINDS, kindsToParam(kinds)],
    [FiltersSearchParamsKeys.CURRENCIES, currenciesToParam(currencies)],
  ].filter(([, val]) => !!val))
}

function defaultListFilters(): ListFilters {
  return {
    kinds: [],
    currencies: []
  }
}
