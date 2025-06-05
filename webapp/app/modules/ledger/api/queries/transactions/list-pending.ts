import { Filters, toURLSearchParams } from "~/modules/ledger/types/filters";
import { Transaction } from "~/modules/ledger/types/transactions";

export async function list(filters: Filters): Promise<Transaction[]> {
  // removing from and to filters because the endpoint does not use it.
  const query = new URLSearchParams(toURLSearchParams({ ...filters, from: undefined, to: undefined }))

  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/transactions/pending?${query.toString()}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
    }
  )

  if (response.ok) return response.json()

  throw response
}