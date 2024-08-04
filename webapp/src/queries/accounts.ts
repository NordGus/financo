import moment from "moment"

import { staleTimeDefault } from "./Client"

import { getPendingTransactions, getTransactions } from "@api/transactions"
import { getAccount, getAccounts } from "@api/accounts"

export const accountsForOtherContext = {
    queryKey: ['accounts', 'all', 'outside'],
    queryFn: getAccounts({ kind: [] }),
    staleTime: staleTimeDefault
}

export function accountQueryOptions(id: number) {
    return {
        queryKey: ['accounts', 'account', id],
        queryFn: getAccount(id),
        staleTime: staleTimeDefault
    }
}

export function pendingTransactionsQueryOptions(id: number) {
    return {
        queryKey: ["transactions", "pending", "account", id],
        queryFn: getPendingTransactions({ account: [id] }),
        staleTime: staleTimeDefault
    }
}

export function upcomingTransactionsQueryOptions(id: number) {
    return {
        queryKey: ["transactions", "upcoming", "account", id],
        queryFn: getTransactions({
            executedFrom: moment().format('YYYY-MM-DD'),
            executedUntil: moment().add({ month: 1 }).format('YYYY-MM-DD'),
            account: [id]
        }),
        staleTime: staleTimeDefault
    }
}