import { Filters, toURLSearchParams } from "~/modules/ledger/types/filters";
import { Transaction } from "~/modules/ledger/types/transactions";

export async function list(filters: Filters): Promise<Transaction[]> {
  const query = new URLSearchParams(toURLSearchParams(filters))

  const response = await fetch(
    `/api/transactions?${query.toString()}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
    }
  )

  if (response.ok) return response.json()

  throw response
}