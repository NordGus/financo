import { Account } from "../../types/detailed";

async function getAccount(id: number): Promise<Account> {
  const response = await fetch(`/api/accounts/${id}`)

  if (response.ok) return response.json()

  throw response
}

export { getAccount };
