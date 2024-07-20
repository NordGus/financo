import { isEmpty, isNil } from "lodash"

import Transaction from "@/types/Transaction"

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

    account?: string[]
}

export function getTransactions(filters: ListFilters): () => Promise<Transaction[]> {
    return async () => {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => !isEmpty(value) || !isNil(value))
        )
        const response = await fetch(`/api/transactions?${params.toString()}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}

export async function getPendingTransactions(): Promise<Transaction[]> {
    const response = await fetch("/api/transactions/pending")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export function getTransactionsForAccount(
    accountId: string,
    filters: ListFilters
): () => Promise<Transaction[]> {
    return async () => {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => !isEmpty(value) || !isNil(value))
        )
        const response = await fetch(`/api/accounts/${accountId}/transactions?${params.toString()}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}