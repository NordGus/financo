import Summary from "@/types/Summary";

export async function getCapitalSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/capital")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getDebtsSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/debts")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getNetWorthSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/net_worth")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export async function getAvailableCreditSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/net_worth")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}