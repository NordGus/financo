import { Account } from "../../types/account";

async function list(): Promise<Account[]> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/accounts`, { headers: { "Content-Type": "application/json; charset=UTF-8" } })

  if (response.ok) return response.json()

  throw response
}

export { list };
