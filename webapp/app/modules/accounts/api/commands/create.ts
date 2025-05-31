import { Account } from "../../types/accounts";
import { Create } from "../../types/create";

export async function create(data: Create): Promise<Account> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}