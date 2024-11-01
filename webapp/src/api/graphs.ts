import { Summary } from "@/types/graph"

export async function getCapitalSummaryGraph(): Promise<Summary[]> {
    const response = await fetch("/api/graphs/capital")

    if (!response.ok) throw response

    return response.json()
}

export async function getDebtsSummaryGraph(): Promise<Summary[]> {
    const response = await fetch("/api/graphs/debts")

    if (!response.ok) throw response

    return response.json()
}

export async function getNetWorthSummaryGraph(): Promise<Summary[]> {
    const response = await fetch("/api/graphs/net-worth")

    if (!response.ok) throw response

    return response.json()
}

export async function getAvailableCreditSummaryGraph(): Promise<Summary[]> {
    const response = await fetch("/api/graphs/available-credit")

    if (!response.ok) throw response

    return response.json()
}

export async function getBalanceForAccountSummaryGraph(id: number): Promise<Summary[]> {
    const response = await fetch(`/api/graphs/for-account/${id}/balance`)

    if (!response.ok) throw response

    return response.json()
}