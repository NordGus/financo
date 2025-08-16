import { Reorder } from "../../types/commands";
import { SavingsGoalsGroup } from "../../types/savings-goal";

export async function reorder(data: Reorder): Promise<SavingsGoalsGroup> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/savings-goals/reorder`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) throw response

  return response.json()
}