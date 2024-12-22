import { Account } from "../../type/preview";

export async function getCategoriesPreviews(): Promise<Account[]> {
  const response = await fetch("/api/categories")

  if (response.ok) return response.json()

  throw response
}