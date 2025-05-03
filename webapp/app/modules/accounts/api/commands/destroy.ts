import { Account } from "../../types/account";

export async function destroy(id: number): Promise<Account> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/accounts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json; charset=UTF-8" }
  })

  if (!response.ok) throw response

  return response.json()
}