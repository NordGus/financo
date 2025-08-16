import { Update } from "../../types/commands";
import { SavingsGoal } from "../../types/savings-goal";

export async function update(data: Update): Promise<SavingsGoal> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/savings-goals/${data.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) throw response

  return response.json()
}