import { Category } from "../../types/category";
import { ListFilters, listFiltersToURLSearchParams } from "../../types/filters";

export async function list(filters: ListFilters): Promise<Category[]> {
  const query = new URLSearchParams(listFiltersToURLSearchParams(filters))

  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/categories?${query.toString()}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }
  )

  if (response.ok) return response.json()

  throw response
}