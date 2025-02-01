import { Account } from "~/modules/ledger/types/accounts";

export async function list(): Promise<Account[]> {
  const response = await fetch(
    "/api/transactions/accounts",
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
    },
  )

  if (response.ok) return response.json()

  throw response
}