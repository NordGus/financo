import { Milestone } from "../../types/milestone";

async function get(id: number): Promise<Milestone> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/trophies/${id}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }
  )

  if (response.ok) return response.json()

  throw response
}

export { get };
