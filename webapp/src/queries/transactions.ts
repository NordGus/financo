import moment from "moment";
import { staleTimeDefault } from "./Client";
import { getPendingTransactions, getTransaction, getTransactions } from "@api/transactions";

export const transactionsQueries = {
    pending: {
        queryKey: ['transactions', 'pending'],
        queryFn: getPendingTransactions,
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

export function currentMonthsTransactionsForAccountQuery(accountID: number) {
    return {
        queryKey: ['account', accountID, 'transactions'],
        queryFn: getTransactions({
            executedFrom: moment().format('YYYY-MM-DD'),
            executedUntil: moment().endOf('month').format('YYYY-MM-DD'),
            account: [accountID]
        }),
        staleTime: staleTimeDefault
    }
}