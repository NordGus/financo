import { Child as ChildCategory } from "../../types/category";

export async function unarchiveChild(parentId: number, id: number): Promise<ChildCategory> {
  const response = await fetch(`/api/categories/${parentId}/children/${id}/unarchive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ id, parentId })
  })

  if (!response.ok) throw response

  return response.json()
}