import { Category } from "../../types/category";

export async function archive(id: number): Promise<Category> {
  const response = await fetch(`/api/categories/${id}/archive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ id })
  })

  if (!response.ok) throw response

  return response.json()
}