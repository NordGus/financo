import moment from "moment";
import { staleTimeDefault } from "./Client";
import { getPendingTransactions, getTransaction, getTransactions } from "@api/transactions";

export const transactionsQueries = {
    pending: {
        queryKey: ['transactions', 'pending'],
        queryFn: getPendingTransactions({}),
        staleTime: staleTimeDefault
    }
}

export function transactionQuery(id: string) {
    return {
        queryKey: ['transaction', 'details', id],
        queryFn: getTransaction(id),
        staleTime: staleTimeDefault
    }
}

export function monthsTransactionsForAccountQuery(accountID: number) {
    return {
        queryKey: ['account', accountID, 'transactions'],
        queryFn: getTransactions({
            executedFrom: moment().startOf('month').format('YYYY-MM-DD'),
            executedUntil: moment().format('YYYY-MM-DD'),
            account: [accountID]
        }),
        staleTime: staleTimeDefault
    }
}

export function monthsUpcomingTransactionsForAccountQuery(accountID: number) {
    return {
        queryKey: ['account', accountID, 'transactions', 'upcoming'],
        queryFn: getTransactions({
            executedFrom: moment().add({ day: 1 }).format('YYYY-MM-DD'),
            executedUntil: moment().add({ month: 1 }).format('YYYY-MM-DD'),
            account: [accountID]
        }),
        staleTime: staleTimeDefault
    }
}

export function pendingTransactionsForAccountQuery(accountID: number) {
    return {
        queryKey: ['account', accountID, 'transactions', 'pending'],
        queryFn: getPendingTransactions({ account: [accountID] }),
        staleTime: 0
    }
}