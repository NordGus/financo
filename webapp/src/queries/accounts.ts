import { getArchivedExternalExpenseAccounts, getArchivedExternalIncomeAccounts, getExternalExpenseAccounts, getExternalIncomeAccounts } from "@api/accounts"
import { staleTimeDefault } from "./Client"

export const activeAccountsQueries = {
    external: {
        expenses: {
            queryKey: ['accounts', 'external', 'expenses', 'active'],
            queryFn: getExternalExpenseAccounts,
            staleTime: staleTimeDefault
        },
        income: {
            queryKey: ['accounts', 'external', 'income', 'active'],
            queryFn: getExternalIncomeAccounts,
            staleTime: staleTimeDefault
        }
    }
}

export const archivedAccountsQueries = {
    external: {
        expenses: {
            queryKey: ['accounts', 'external', 'expenses', 'archived'],
            queryFn: getArchivedExternalExpenseAccounts,
            staleTime: staleTimeDefault
        },
        income: {
            queryKey: ['accounts', 'external', 'income', 'archived'],
            queryFn: getArchivedExternalIncomeAccounts,
            staleTime: staleTimeDefault
        }
    }
}