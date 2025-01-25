import { Child as ChildCategory } from "../../types/category";
import { CreateChild } from "../../types/create";

export async function createChild(parentId: number, data: CreateChild): Promise<ChildCategory> {
  const response = await fetch(`/api/categories/${parentId}/children`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ ...data, parentId })
  })

  if (!response.ok) throw response

  return response.json()
}