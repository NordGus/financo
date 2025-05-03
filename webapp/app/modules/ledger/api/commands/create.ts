import { Create } from "../../types/create";
import { Transaction } from "../../types/transactions";

export async function create(data: Create): Promise<Transaction> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}