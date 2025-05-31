import { Account } from "../../types/accounts";
import { Update } from "../../types/update";

export async function update(data: Update): Promise<Account> {
  const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/accounts/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}