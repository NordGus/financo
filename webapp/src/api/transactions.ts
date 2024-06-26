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

export interface TransactionsFilters {
    issuedFrom?: string
    issuedUntil?: string

    executedFrom?: string
    executedUntil?: string

    accountIDs?: string[]
    externalAccountIDs?: string[]
}

export function getTransactions(filters: TransactionsFilters): () => Promise<Transaction[]> {
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
    const response = await fetch("/api/transactions?executedAt=null")

    if (!response.ok) {
        console.error(response)
        throw new Error('Network response was not ok')
    }

    return response.json()
}

export function getTransactionsForAccount(
    accountId: string,
    filters: TransactionsFilters
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