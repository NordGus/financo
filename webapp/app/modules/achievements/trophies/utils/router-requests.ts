import { Filters, filtersFromURLSearchParams } from "../types/filters";

export function getFilters(request: Request): Filters {
  const searchParams = new URL(request.url).searchParams

  return filtersFromURLSearchParams(searchParams)
}