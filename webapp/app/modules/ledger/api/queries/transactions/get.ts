import { Transaction } from "~/modules/ledger/types/transactions";

export async function get(id: number): Promise<Transaction> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/transactions/${id}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
    }
  )

  if (response.ok) return response.json()

  throw response
}