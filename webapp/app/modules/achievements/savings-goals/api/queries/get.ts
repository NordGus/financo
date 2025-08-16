import { SavingsGoal } from "../../types/savings-goal";

async function get(id: number): Promise<SavingsGoal> {
  const response = await fetch(
    `${import.meta.env.VITE_API_HOST}/api/savings-goals/${id}`,
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
