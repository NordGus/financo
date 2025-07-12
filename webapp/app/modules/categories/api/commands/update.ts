import { Category } from "../../types/category";
import { OldUpdate, Update } from "../../types/update";

export async function oldUpdate(data: OldUpdate): Promise<Category> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}

export async function update(data: Update): Promise<Category> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}