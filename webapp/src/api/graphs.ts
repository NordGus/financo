import { Summary } from "@/types/graph"

export async function getDebtsSummaryGraph(): Promise<Summary[]> {
    const response = await fetch("/api/graphs/debts")

    if (!response.ok) throw response

    return response.json()
}