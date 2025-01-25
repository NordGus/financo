import { Create, Created } from "../../types/create";

export async function createAccount(data: Create): Promise<Created> {
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}