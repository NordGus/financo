import { Deleted } from "../../types/delete";

export async function deleteAccount(id: number): Promise<Deleted> {
  const response = await fetch(`/api/accounts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  })

  if (!response.ok) throw response

  return response.json()
}