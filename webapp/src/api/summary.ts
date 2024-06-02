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

export async function getTotalSummary(): Promise<Summary[]> {
    const response = await fetch("/api/summary/total")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}