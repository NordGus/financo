import Goal from "../types/Goal";

export async function getGoals(): Promise<Goal[]> {
    const response = await fetch("/api/goals")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getArchivedGoals(): Promise<Goal[]> {
    const response = await fetch("/api/goals/archived")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getReachedGoals(): Promise<Goal[]> {
    const response = await fetch("/api/goals/reached")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}