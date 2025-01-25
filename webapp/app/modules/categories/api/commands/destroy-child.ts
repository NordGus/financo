import { Child as ChildCategory } from "../../types/category";

export async function destroyChild(parentId: number, id: number): Promise<ChildCategory> {
  const response = await fetch(`/api/categories/${parentId}/children/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json; charset=UTF-8" }
  })

  if (!response.ok) throw response

  return response.json()
}