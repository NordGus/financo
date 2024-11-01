import { Summary } from "@/types/Summary";

export async function getPaidForAccountSummary(id: number): Promise<Summary[]> {
    const response = await fetch(`/api/summaries/for_account/${id}/paid`)

    if (!response.ok) throw response

    return response.json()
}

export async function getDailyBalanceForAccountSummary(id: number): Promise<Summary[]> {
    const response = await fetch(`/api/summaries/for_account/${id}/daily_balance`)

    if (!response.ok) throw response

    return response.json()
}