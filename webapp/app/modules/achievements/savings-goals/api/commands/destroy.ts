import { SavingsGoal } from "../../types/savings-goal";

export async function destroy(id: number): Promise<SavingsGoal> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/savings-goals/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    }
  )

  if (!response.ok) throw response

  return response.json()
}