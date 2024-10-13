import { Active, SavingsGoal } from "@/types/SavingsGoal";

async function getActiveSavingsGoals(): Promise<Active[]> {
    const response = await fetch("/api/savings_goals/active")

    if (!response) throw response

    return response.json()
}

async function deleteGoal(id: number): Promise<SavingsGoal> {
    const response = await fetch(`/api/savings-goals/${id}`, { method: "DELETE" })

    if (!response.ok) throw response

    return response.json()
}

export { deleteGoal, getActiveSavingsGoals };
