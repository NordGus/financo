import { format } from "date-fns";
import { Filters, Transaction } from "~/modules/ledger/types/transactions";

export async function list(filters: Filters, signal: AbortSignal): Promise<Transaction[]> {
  const params = Object.entries(filters)
    .filter(([__key, value]) => {
      if (!value) return false
      if (value instanceof Date) return true
      return value.length > 0
    })
    .map(([key, value]) => {
      if (value instanceof Date) return [key, format(value, "yyyy-MM-dd")]
      return [key, value.map((val) => val.toString())]
    })

  const query = new URLSearchParams(Object.fromEntries(params))

  const response = await fetch(
    `/api/transactions?${query.toString()}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      signal,
    }
  )

  if (response.ok) return response.json()

  throw response
}