import {
    Create,
    CreateResponse,
    DeleteResponse,
    Detailed,
    Kind,
    Preview,
    Select,
    Update
} from "@/types/Account"
import isEmptyParam from "@helpers/isEmptyParam"

export function getAccount(id: number): () => Promise<Detailed> {
    return async () => {
        const response = await fetch(`/api/accounts/${id}`)

        if (!response.ok) throw response

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
            Object.entries(filters).filter(([_key, value]) => !isEmptyParam(value))
        )
        const response = await fetch(`/api/accounts?${params.toString()}`)

        if (!response.ok) throw response

        return response.json()
    }
}

export async function getSelectableAccounts(): Promise<Select[]> {
    const response = await fetch(`/api/accounts/select`)

    if (!response.ok) throw response

    return response.json()
}

export async function getArchivedSelectableAccounts(): Promise<Select[]> {
    const response = await fetch(`/api/accounts/select?archived=true`)

    if (!response.ok) throw response

    return response.json()
}

export async function createAccount(data: Create): Promise<CreateResponse> {
    const response = await fetch(`/api/accounts`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) throw response

    return response.json()
}

export async function updateAccount(id: number, data: Update): Promise<Detailed> {
    const response = await fetch(`/api/accounts/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) throw response

    return response.json()
}

export async function deleteAccount(id: number): Promise<DeleteResponse> {
    const response = await fetch(`/api/accounts/${id}`, { method: "DELETE" })

    if (!response.ok) throw response

    return response.json()
}