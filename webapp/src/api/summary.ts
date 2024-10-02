import { Summary } from "@/types/Summary";

export async function getCapitalSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/capital")

    if (!response.ok) throw response

    return response.json()
}

export async function getDebtsSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/debts")

    if (!response.ok) throw response

    return response.json()
}

export async function getNetWorthSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/net_worth")

    if (!response.ok) throw response

    return response.json()
}

export async function getAvailableCreditSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/available_credit")

    if (!response.ok) throw response

    return response.json()
}

export async function getBalanceForAccountSummary(id: number): Promise<Summary[]> {
    const response = await fetch(`/api/summary/for_account/${id}/balance`)

    if (!response.ok) throw response

    return response.json()
}

export async function getPaidForAccountSummary(id: number): Promise<Summary[]> {
    const response = await fetch(`/api/summary/for_account/${id}/paid`)

    if (!response.ok) throw response

    return response.json()
}

export async function getDailyBalanceForAccountSummary(id: number): Promise<Summary[]> {
    const response = await fetch(`/api/summary/for_account/${id}/daily_balance`)

    if (!response.ok) throw response

    return response.json()
}