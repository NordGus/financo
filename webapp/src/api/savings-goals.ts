import { Active, Create, Created, Reorder, SavingsGoal, Update, Updated } from "@/types/savings-goal";

async function getActiveSavingsGoals(): Promise<Active[]> {
    const response = await fetch("/api/savings-goals/active")

    if (!response) throw response

    return response.json()
}

async function reorderSavingsGoals(data: Reorder): Promise<Reorder> {
    const response = await fetch(`/api/savings-goals/reorder`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) throw response

    return response.json()
}

async function createSavingsGoal(data: Create): Promise<Created> {
    const response = await fetch(`/api/savings-goals`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) throw response

    return response.json()
}

async function updateSavingsGoal(data: Update): Promise<Updated> {
    const response = await fetch(`/api/savings-goals/${data.id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) throw response

    return response.json()
}

async function deleteGoal(id: number): Promise<SavingsGoal> {
    const response = await fetch(`/api/savings-goals/${id}`, { method: "DELETE" })

    if (!response.ok) throw response

    return response.json()
}

export {
    createSavingsGoal,
    deleteGoal,
    getActiveSavingsGoals,
    reorderSavingsGoals,
    updateSavingsGoal
};

