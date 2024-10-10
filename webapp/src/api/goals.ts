import { SavingsGoal } from "@/types/SavingsGoal";

export function getGoal(id: string): () => Promise<SavingsGoal> {
    return async () => {
        const response = await fetch(`/api/goals/${id}`)

        if (!response.ok) throw response

        return response.json()
    }
}

export async function getGoals(): Promise<SavingsGoal[]> {
    const response = await fetch("/api/goals")

    if (!response.ok) throw response

    return response.json()
}

export async function getArchivedGoals(): Promise<SavingsGoal[]> {
    const response = await fetch("/api/goals/archived")

    if (!response.ok) throw response

    return response.json()
}

export async function getReachedGoals(): Promise<SavingsGoal[]> {
    const response = await fetch("/api/goals/reached")

    if (!response.ok) throw response

    return response.json()
}

export async function deleteGoal(id: number): Promise<SavingsGoal> {
    const response = await fetch(`/api/savings-goals/${id}`, { method: "DELETE" })

    if (!response.ok) throw response

    return response.json()
}