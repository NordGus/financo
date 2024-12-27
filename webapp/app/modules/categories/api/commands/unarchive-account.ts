import { Unarchived } from "../../types/unarchived";

export async function unarchiveCategory(id: number): Promise<Unarchived> {
  const response = await fetch(`/api/categories/${id}/unarchive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })

  if (!response.ok) throw response

  return response.json()
}