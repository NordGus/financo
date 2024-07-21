import Account, { Kind, Preview } from "@/types/Account"
import isEmptyParam from "@helpers/isEmptyParam"

export function getAccount(id: string): () => Promise<Account> {
    return async () => {
        const response = await fetch(`/api/accounts/${id}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}

export interface ListFilters {
    kind: Kind[],
    archived?: boolean
}

export function getAccounts(filters: ListFilters): () => Promise<Preview[]> {
    return async () => {
        const params = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => !isEmptyParam(value))
        )
        const response = await fetch(`/api/accounts?${params.toString()}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}
