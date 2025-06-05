import { ListFilters, listFiltersFromURLSearchParams } from "../types/filters";

export function getListFilters(request: Request): ListFilters {
  const searchParams = new URL(request.url).searchParams

  return listFiltersFromURLSearchParams(searchParams)
}
