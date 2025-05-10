import { Transaction } from "../../types/transactions"

export async function destroy(id: number): Promise<Transaction> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/transactions/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json; charset=UTF-8" }
  })

  if (!response.ok) throw response

  return response.json()
}