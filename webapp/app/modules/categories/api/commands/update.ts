import { Category } from "../../types/category";
import { OldUpdate } from "../../types/update";

export async function update(data: OldUpdate): Promise<Category> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}
