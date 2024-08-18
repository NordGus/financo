import Transaction, { Create, Update } from "@/types/Transaction"

import isEmptyParam from "@helpers/isEmptyParam"

export interface ListFilters {
    executedFrom?: string
    executedUntil?: string

    account?: number[]
}

export async function getTransactions(filters: ListFilters): Promise<Transaction[]> {
    const params = new URLSearchParams(Object.entries(filters).filter(([_, value]) => !isEmptyParam(value)))
    const response = await fetch(`/api/transactions?${params.toString()}`)

    if (!response.ok) throw response

    return response.json()
}

export async function getTransactionsForAccount(id: number, filters: ListFilters): Promise<Transaction[]> {
    const params = new URLSearchParams(Object.entries(filters).filter(([_, value]) => !isEmptyParam(value)))
    const response = await fetch(`/api/transactions/for_account/${id}?${params.toString()}`)

    if (!response.ok) throw response

    return response.json()
}

export interface PendingFilters {
    account?: number[]
}

export async function getPendingTransactions(filters: PendingFilters): Promise<Transaction[]> {
    const params = new URLSearchParams(Object.entries(filters).filter(([_, value]) => !isEmptyParam(value)))
    const response = await fetch(`/api/transactions/pending?${params.toString()}`)

    if (!response.ok) throw response

    return response.json()
}

export async function getPendingTransactionsForAccount(id: number, filters: ListFilters): Promise<Transaction[]> {
    const params = new URLSearchParams(Object.entries(filters).filter(([_, value]) => !isEmptyParam(value)))
    const response = await fetch(`/api/transactions/pending/for_account/${id}?${params.toString()}`)

    if (!response.ok) throw response

    return response.json()
}

export async function createTransaction(data: Create): Promise<Transaction> {
    const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) throw response

    return response.json()
}

export async function updateTransaction(id: number, data: Update): Promise<Transaction> {
    const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!response.ok) throw response

    return response.json()
}

export async function deleteTransaction(id: number): Promise<Transaction> {
    const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" })

    if (!response.ok) throw response

    return response.json()
}