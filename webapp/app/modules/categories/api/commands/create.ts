import { Category } from "../../types/category";
import { Create } from "../../types/create";

export async function create(data: Create): Promise<Category> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (response.ok) return response.json()

  throw response
}