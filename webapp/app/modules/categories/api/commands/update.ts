import { Category } from "../../types/category";
import { Update } from "../../types/update";

export async function update(data: Update): Promise<Category> {
  const response = await fetch(`/api/categories/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}
