import { Create } from "../../types/commands";
import { SavingsGoal } from "../../types/savings-goal";

export async function create(data: Create): Promise<SavingsGoal> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/savings-goals`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) throw response

  return response.json()
}