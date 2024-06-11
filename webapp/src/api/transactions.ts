import Transaction from "@/types/Transaction"

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
            Object.entries(filters).filter(([_, value]) => value !== null || value !== undefined)
        )
        const response = await fetch(`/api/transactions?${params.toString()}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}