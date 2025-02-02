import moment from "moment";
import { Filters, Transaction } from "~/modules/ledger/types/transactions";

export async function list(filters: Filters, signal: AbortSignal): Promise<Transaction[]> {
  const query = new URLSearchParams(
    Object.entries(filters)
      .filter(([__key, value]) => !!value)
      .map(([key, value]) => {
        if (value instanceof Date) return [key, moment(value).toISOString()]
        return [key, value.join(",")]
      })
  )

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