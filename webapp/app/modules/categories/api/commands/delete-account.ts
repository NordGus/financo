import { Deleted } from "../../types/delete";

export async function deleteCategory(id: number): Promise<Deleted> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json; charset=UTF-8" }
  })

  if (!response.ok) throw response

  return response.json()
}