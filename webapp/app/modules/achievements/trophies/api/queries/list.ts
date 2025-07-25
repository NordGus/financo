import { Filters, filtersToURLSearchParams } from "../../types/filters";
import { Milestone } from "../../types/milestone";

async function list(filters: Filters): Promise<Milestone[]> {
  const query = new URLSearchParams(filtersToURLSearchParams(filters))

  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/trophies/timeline?${query.toString()}`,
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
