import { MarkAsAchieved } from "../../types/commands";
import { SavingsGoal } from "../../types/savings-goal";

export async function markAsAchieved(data: MarkAsAchieved): Promise<SavingsGoal> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/savings-goals/${data.id}/mark-as-achieved`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) throw response

  return response.json()
}