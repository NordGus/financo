import { Active, SavingsGoal } from "@/types/savings-goal";
import { Currency } from "dinero.js";

async function getActiveSavingsGoals(): Promise<Active[]> {
    const response = await fetch("/api/savings-goals/active")

    if (!response) throw response

    return response.json()
}

async function reorderSavingsGoals(currency: Currency, goals: SavingsGoal[]): Promise<SavingsGoal[]> {
    const response = await fetch(`/api/savings-goals/reorder`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, goals })
    })

    if (!response.ok) throw response

    return response.json()
}

async function deleteGoal(id: number): Promise<SavingsGoal> {
    const response = await fetch(`/api/savings-goals/${id}`, { method: "DELETE" })

    if (!response.ok) throw response

    return response.json()
}

export { deleteGoal, getActiveSavingsGoals, reorderSavingsGoals };
