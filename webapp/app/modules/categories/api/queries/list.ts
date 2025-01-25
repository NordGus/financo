import { Category } from "../../types/category";

export async function list(): Promise<Category[]> {
  const response = await fetch("/api/categories", { headers: { "Content-Type": "application/json; charset=UTF-8" } })

  if (response.ok) return response.json()

  throw response
}