import { Account } from "../../types/account";

export async function archive(id: number): Promise<Account> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/accounts/${id}/archive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ id })
  })

  if (!response.ok) throw response

  return response.json()
}