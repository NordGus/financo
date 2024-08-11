import Transaction from "@/types/Transaction"

import isEmptyParam from "@helpers/isEmptyParam"

export function getTransaction(id: string): () => Promise<Transaction> {
    return async () => {
        const response = await fetch(`/api/transactions/${id}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}

export interface ListFilters {
    executedFrom?: string
    executedUntil?: string

    account?: number[]
}

export function getTransactions(filters: ListFilters): () => Promise<Transaction[]> {
    return async () => {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => !isEmptyParam(value))
        )
        const response = await fetch(`/api/transactions?${params.toString()}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}

export interface UpcomingFilters {
    executedUntil?: string

    account?: number[]
}

export function getUpcomingTransactions(filters: UpcomingFilters): () => Promise<Transaction[]> {
    return async () => {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => !isEmptyParam(value))
        )
        const response = await fetch(`/api/transactions/upcoming?${params.toString()}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}

export interface PendingFilters {
    account?: number[]
}

export function getPendingTransactions(filters: PendingFilters): () => Promise<Transaction[]> {
    return async () => {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => !isEmptyParam(value))
        )
        const response = await fetch(`/api/transactions/pending?${params.toString()}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}

export async function deleteTransaction(id: number): Promise<Transaction> {
    const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" })

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}