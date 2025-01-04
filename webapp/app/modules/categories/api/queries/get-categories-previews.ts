import { Account } from "../../types/preview";

export async function getCategoriesPreviews(): Promise<Account[]> {
  const response = await fetch("/api/categories", { headers: { "Content-Type": "application/json; charset=UTF-8" } })

  if (response.ok) return response.json()

  throw response
}