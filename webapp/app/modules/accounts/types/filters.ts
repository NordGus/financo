import { URLSearchParamsInit } from "react-router"
import { Currency } from "~/modules/shared/types/currency"
import { Kind } from "./accounts"

export {
  defaultListFilters,
  listFiltersFromURLSearchParams,
  listFiltersToURLSearchParams
}
export type { ListFilters }

const ListFiltersSearchParamsKeys = {
  KINDS: "kinds",
  KIND: "kind",
  ARCHIVED: "archived",
  CURRENCIES: "currencies"
} as const

type ListFilters = {
  kinds: Kind[],
  kind?: Kind,
  archived?: boolean,
  currencies: Currency[]
}

function kindsToParam(values: Kind[]): string[] | undefined {
  if (values.length === 0) return undefined

  // I do not care about the type, a kind is a string in the end.
  return values as string[]
}

function archivedToParam(value: boolean | undefined): string | undefined {
  if (value) return "true"

  return "false"
}

function currenciesToParam(values: Currency[]): string[] | undefined {
  if (values.length === 0) return undefined

  // I do not care about the type, a kind is a string in the end.
  return values as string[]
}

function listFiltersToURLSearchParams(filters: ListFilters): URLSearchParams
function listFiltersToURLSearchParams({ kinds, kind, archived, currencies }: ListFilters): URLSearchParamsInit {
  return Object.fromEntries([
    [ListFiltersSearchParamsKeys.KINDS, kindsToParam(kinds)],
    [ListFiltersSearchParamsKeys.KIND, kind],
    [ListFiltersSearchParamsKeys.ARCHIVED, archivedToParam(archived)],
    [ListFiltersSearchParamsKeys.CURRENCIES, currenciesToParam(currencies)],
  ].filter(([, val]) => !!val))
}

function toKinds(values: string[]): Kind[] {
  const kinds: Kind[] = ["capital", "savings", "debt", "credit"]

  return values.filter(value => kinds.includes(value as Kind)) as Kind[]
}

function toKind(value: string | null | undefined): Kind | undefined {
  switch (value) {
    case "capital":
    case "savings":
    case "debt":
    case "credit":
      return value
    default:
      return undefined
  }
}

function toArchived(value: string | null | undefined): boolean | undefined {
  return value === "true"
}

function toCurrencies(values: string[]): Currency[] {
  const currencies: Currency[] = ["CAD", "USD", "EUR", "CHF", "GBP"]

  return values.filter(value => currencies.includes(value as Currency)) as Currency[]
}

function listFiltersFromURLSearchParams(params: URLSearchParams): ListFilters {
  const defaults = defaultListFilters()

  const kinds = toKinds(params.getAll(ListFiltersSearchParamsKeys.KINDS)) ?? defaults.kinds
  const kind = toKind(params.get(ListFiltersSearchParamsKeys.KIND)) ?? defaults.kind
  const archived = toArchived(params.get(ListFiltersSearchParamsKeys.ARCHIVED)) ?? defaults.archived
  const currencies = toCurrencies(params.getAll(ListFiltersSearchParamsKeys.CURRENCIES)) ?? defaults.currencies

  return { kinds, kind, archived, currencies }
}

function defaultListFilters(): ListFilters {
  return {
    kinds: [],
    kind: undefined,
    archived: false,
    currencies: []
  }
}
