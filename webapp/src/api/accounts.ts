import Account from "../types/Account"

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

export function getAccounts(kindSegment: string): () => Promise<Account[]> {
    return async () => {
        const response = await fetch(`/api/accounts/${kindSegment}`)

        if (!response.ok) {
            console.error(response)
            throw new Error('Network response was not ok')
        }

        return response.json()
    }
}
