import { Filters, fromURLSearchParams } from "../types/filters";

export function getFilters(request: Request): Filters {
  const searchParams = new URL(request.url).searchParams

  return fromURLSearchParams(searchParams)
}