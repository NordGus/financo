import { Update, Updated } from "../../types/update";

export async function updateAccount(data: Update): Promise<Updated> {
  const response = await fetch(`/api/categories/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data)
  })

  if (!response.ok) throw response

  return response.json()
}
