import { Transaction } from "../../types/transactions"
import { Update } from "../../types/update"

export async function update(id: number, data: Update): Promise<Transaction> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}