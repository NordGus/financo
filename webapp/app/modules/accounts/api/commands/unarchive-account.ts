import { Unarchived } from "../../types/unarchived";

export async function unarchiveAccount(id: number): Promise<Unarchived> {
  const response = await fetch(`/api/accounts/${id}/unarchive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })

  if (!response.ok) throw response

  return response.json()
}