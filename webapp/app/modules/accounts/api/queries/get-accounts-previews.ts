import { Account } from "../../types/account";

async function getAccountsPreviews(): Promise<Account[]> {
  const response = await fetch("/api/accounts", { headers: { "Content-Type": "application/json; charset=UTF-8" } })

  if (response.ok) return response.json()

  throw response
}

export { getAccountsPreviews };
