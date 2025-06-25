import { Account } from "../../types/accounts";

async function get(id: number): Promise<Account> {

  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/accounts/${id}`,
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }
  )

  if (response.ok) return response.json()

  throw response
}

export { get };
