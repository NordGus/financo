import { Category } from "../../types/category";

export async function unarchive(id: number): Promise<Category> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories/${id}/unarchive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ id })
  })

  if (!response.ok) throw response

  return response.json()
}