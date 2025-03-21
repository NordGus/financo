import { Category } from "../../types/category";

export async function destroy(id: number): Promise<Category> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json; charset=UTF-8" }
  })

  if (!response.ok) throw response

  return response.json()
}