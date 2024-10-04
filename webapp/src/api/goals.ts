import { Goal } from "@/types/Goal";

export function getGoal(id: string): () => Promise<Goal> {
    return async () => {
        const response = await fetch(`/api/goals/${id}`)

        if (!response.ok) throw response

        return response.json()
    }
}

export async function getGoals(): Promise<Goal[]> {
    const response = await fetch("/api/goals")

    if (!response.ok) throw response

    return response.json()
}

export async function getArchivedGoals(): Promise<Goal[]> {
    const response = await fetch("/api/goals/archived")

    if (!response.ok) throw response

    return response.json()
}

export async function getReachedGoals(): Promise<Goal[]> {
    const response = await fetch("/api/goals/reached")

    if (!response.ok) throw response

    return response.json()
}

export async function deleteGoal(id: number): Promise<Goal> {
    const response = await fetch(`/api/savings-goals/${id}`, { method: "DELETE" })

    if (!response.ok) throw response

    return response.json()
}