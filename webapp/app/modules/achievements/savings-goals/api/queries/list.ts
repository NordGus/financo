import { Filters, filtersToURLSearchParams } from "../../types/filters";
import { SavingsGoalsGroup } from "../../types/savings-goal";


async function list(filters: Filters): Promise<SavingsGoalsGroup[]> {
  const query = new URLSearchParams(filtersToURLSearchParams(filters))

  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/savings-goals?${query.toString()}`,
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
