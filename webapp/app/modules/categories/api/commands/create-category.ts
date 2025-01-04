import { Create, Created } from "../../types/create";

export async function createCategory(data: Create): Promise<Created> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (response.ok) return response.json()

  throw response
}