import { staleTimeDefault } from "./Client";
import { getPendingTransactions } from "@api/transactions";

export const transactionsQueries = {
    pending: {
        queryKey: ['transactions', 'pending'],
        queryFn: getPendingTransactions,
        staleTime: staleTimeDefault
    }
}