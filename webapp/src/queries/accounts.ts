import { staleTimeDefault } from "./Client"
import {
    getArchivedDebtCreditAccounts,
    getArchivedDebtLoanAccounts,
    getArchivedExternalExpenseAccounts,
    getArchivedExternalIncomeAccounts,
    getDebtCreditAccounts,
    getDebtLoanAccounts,
    getExternalExpenseAccounts,
    getExternalIncomeAccounts
} from "@api/accounts"

export const activeAccountsQueries = {
    debt: {
        credit: {
            queryKey: ['accounts', 'debt', 'credit', 'active'],
            queryFn: getDebtCreditAccounts,
            staleTime: staleTimeDefault
        },
        loans: {
            queryKey: ['accounts', 'debt', 'loans', 'active'],
            queryFn: getDebtLoanAccounts,
            staleTime: staleTimeDefault
        }
    },
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
    debt: {
        credit: {
            queryKey: ['accounts', 'debt', 'credit', 'archived'],
            queryFn: getArchivedDebtCreditAccounts,
            staleTime: staleTimeDefault
        },
        loans: {
            queryKey: ['accounts', 'debt', 'loans', 'archived'],
            queryFn: getArchivedDebtLoanAccounts,
            staleTime: staleTimeDefault
        }
    },
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