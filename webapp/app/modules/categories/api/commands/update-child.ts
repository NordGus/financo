import { Child as ChildCategory } from "../../types/category";
import { UpdateChild } from "../../types/update";

export async function updateChild(data: UpdateChild): Promise<ChildCategory> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories/${data.parentId}/children/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}
