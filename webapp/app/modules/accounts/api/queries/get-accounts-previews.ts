import { Account } from "../../types/preview";

async function getAccountsPreviews(): Promise<Account[]> {
  const response = await fetch("/api/accounts")

  if (response.ok) return response.json()

  throw response
}

export { getAccountsPreviews };
