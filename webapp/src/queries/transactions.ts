import { staleTimeDefault } from "./Client";
import { getPendingTransactions, getTransaction } from "@api/transactions";

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