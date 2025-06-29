import { URLSearchParamsInit } from "react-router"
import { Kind } from "./category"

export {
  defaultListFilters,
  listFiltersFromURLSearchParams,
  listFiltersToURLSearchParams
}
export type { ListFilters }

const ListFiltersSearchParamsKeys = {
  KINDS: "kinds",
  KIND: "kind",
  ARCHIVED: "archived"
} as const

type ListFilters = {
  kinds: Kind[],
  kind?: Kind,
  archived?: boolean
}

function kindsToParam(values: Kind[]): string[] | undefined {
  if (values.length === 0) return undefined

  // I do not care about the type, a kind is a string in the end.
  return values as string[]
}

function archivedToParam(value: boolean | undefined): string | undefined {
  switch (value) {
    case true:
      return "true"
    case false:
      return "false"
    default:
      return undefined
  }
}

function listFiltersToURLSearchParams(filters: ListFilters): URLSearchParams
function listFiltersToURLSearchParams({ kinds, kind, archived }: ListFilters): URLSearchParamsInit {
  return Object.fromEntries([
    [ListFiltersSearchParamsKeys.KINDS, kindsToParam(kinds)],
    [ListFiltersSearchParamsKeys.KIND, kind],
    [ListFiltersSearchParamsKeys.ARCHIVED, archivedToParam(archived)],
  ].filter(([, val]) => !!val))
}

function toKinds(values: string[]): Kind[] {
  const kinds: Kind[] = ["income", "expense"]

  return values.filter(value => kinds.includes(value as Kind)) as Kind[]
}

function toKind(value: string | null | undefined): Kind | undefined {
  switch (value) {
    case "income":
    case "expense":
      return value
    default:
      return undefined
  }
}

function toArchived(value: string | null | undefined): boolean | undefined {
  switch (value) {
    case "true":
      return true
    case "false":
      return false
    default:
      return undefined
  }
}

function listFiltersFromURLSearchParams(params: URLSearchParams): ListFilters {
  const defaults = defaultListFilters()

  const kinds = toKinds(params.getAll(ListFiltersSearchParamsKeys.KINDS)) ?? defaults.kinds
  const kind = toKind(params.get(ListFiltersSearchParamsKeys.KIND)) ?? defaults.kind
  const archived = toArchived(params.get(ListFiltersSearchParamsKeys.ARCHIVED)) ?? defaults.archived

  return { kinds, kind, archived }
}

function defaultListFilters(): ListFilters {
  return {
    kinds: [],
    kind: undefined,
    archived: undefined
  }
}
