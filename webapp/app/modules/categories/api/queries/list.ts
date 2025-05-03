import { Category } from "../../types/category";

export async function list(): Promise<Category[]> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/categories`, { headers: { "Content-Type": "application/json; charset=UTF-8" } })

  if (response.ok) return response.json()

  throw response
}