import { URLSearchParamsInit } from "react-router"
import { CurrenciesForZodEnum, Currency } from "~/modules/shared/types/currency"

export {
  defaultFilters,
  filtersFromURLSearchParams,
  filtersToURLSearchParams,
  isDefaultFilters
}
export type { Filters }

type Filters = {
  currency?: Currency
  currencies: Currency[]
}

const FiltersSearchParamsKeys = {
  CURRENCY: "currency",
  CURRENCIES: "currencies"
} as const

function toCurrency(value: string | null): Currency | undefined {
  if (!value) return undefined
  if (!CurrenciesForZodEnum.includes(value as Currency)) return undefined

  return value as Currency
}

function toCurrencies(values: string[]): Currency[] {
  return values.filter(value => CurrenciesForZodEnum.includes(value as Currency)) as Currency[]
}

function filtersFromURLSearchParams(params: URLSearchParams): Filters {
  const defaults = defaultFilters()

  const currency = toCurrency(params.get(FiltersSearchParamsKeys.CURRENCY))
  const currencies = toCurrencies(params.getAll(FiltersSearchParamsKeys.CURRENCIES)) ?? defaults.currencies

  return { currency, currencies }
}

function currencyToParam(value: Currency | undefined): string | undefined {
  if (!value) return undefined

  // I do not care about the type, a kind is a string in the end.
  return value as string
}

function currenciesToParam(values: Currency[]): string[] | undefined {
  if (values.length === 0) return undefined

  // I do not care about the type, a kind is a string in the end.
  return values as string[]
}

function filtersToURLSearchParams(filters: Filters): URLSearchParams
function filtersToURLSearchParams({ currency, currencies }: Filters): URLSearchParamsInit {
  return Object.fromEntries([
    [FiltersSearchParamsKeys.CURRENCY, currencyToParam(currency)],
    [FiltersSearchParamsKeys.CURRENCIES, currenciesToParam(currencies)],
  ].filter(([, val]) => !!val))
}

function defaultFilters(): Filters {
  return {
    currency: undefined,
    currencies: []
  }
}

function isDefaultFilters(filters: Filters): boolean {
  const { currency, currencies } = defaultFilters()

  return (
    filters.currency === currency &&
    filters.currencies.length === currencies.length &&
    filters.currencies.every(currency => currencies.includes(currency))
  )
}
