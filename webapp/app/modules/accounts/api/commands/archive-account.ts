import { Archived } from "../../types/archived";

export async function archiveAccount(id: number): Promise<Archived> {
  const response = await fetch(`/api/accounts/${id}/archive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ id })
  })

  if (!response.ok) throw response

  return response.json()
}