import { Account } from "../../types/accounts";
import { ListFilters, listFiltersToURLSearchParams } from "../../types/filters";

async function list(filters: ListFilters): Promise<Account[]> {
  const query = new URLSearchParams(listFiltersToURLSearchParams(filters))

  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/accounts?${query.toString()}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }
  )

  if (response.ok) return response.json()

  throw response
}

export { list };
