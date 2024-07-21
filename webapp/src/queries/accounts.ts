import { staleTimeDefault } from "./Client"
import { Kind } from "@/types/Account"
import { getAccount, getAccounts } from "@api/accounts"

export const activeAccountsQueries = {
    capital: {
        normal: {
            queryKey: ['accounts', 'capital', 'normal', 'active'],
            queryFn: getAccounts({ kind: [Kind.CapitalNormal] }),
            staleTime: staleTimeDefault
        },
        savings: {
            queryKey: ['accounts', 'capital', 'savings', 'active'],
            queryFn: getAccounts({ kind: [Kind.CapitalSavings] }),
            staleTime: staleTimeDefault
        }
    },
    debt: {
        credit: {
            queryKey: ['accounts', 'debt', 'credit', 'active'],
            queryFn: getAccounts({ kind: [Kind.DebtCredit] }),
            staleTime: staleTimeDefault
        },
        loans: {
            queryKey: ['accounts', 'debt', 'loans', 'active'],
            queryFn: getAccounts({ kind: [Kind.DebtLoan, Kind.DebtPersonal] }),
            staleTime: staleTimeDefault
        }
    },
    external: {
        expenses: {
            queryKey: ['accounts', 'external', 'expenses', 'active'],
            queryFn: getAccounts({ kind: [Kind.ExternalExpense] }),
            staleTime: staleTimeDefault
        },
        income: {
            queryKey: ['accounts', 'external', 'income', 'active'],
            queryFn: getAccounts({ kind: [Kind.ExternalIncome] }),
            staleTime: staleTimeDefault
        }
    }
}

export const archivedAccountsQueries = {
    capital: {
        normal: {
            queryKey: ['accounts', 'capital', 'normal', 'archived'],
            queryFn: getAccounts({ kind: [Kind.CapitalNormal], archived: true }),
            staleTime: staleTimeDefault
        },
        savings: {
            queryKey: ['accounts', 'capital', 'savings', 'archived'],
            queryFn: getAccounts({ kind: [Kind.CapitalSavings], archived: true }),
            staleTime: staleTimeDefault
        }
    },
    debt: {
        credit: {
            queryKey: ['accounts', 'debt', 'credit', 'archived'],
            queryFn: getAccounts({ kind: [Kind.DebtCredit], archived: true }),
            staleTime: staleTimeDefault
        },
        loans: {
            queryKey: ['accounts', 'debt', 'loans', 'archived'],
            queryFn: getAccounts({ kind: [Kind.DebtLoan, Kind.DebtPersonal], archived: true }),
            staleTime: staleTimeDefault
        }
    },
    external: {
        expenses: {
            queryKey: ['accounts', 'external', 'expenses', 'archived'],
            queryFn: getAccounts({ kind: [Kind.ExternalExpense], archived: true }),
            staleTime: staleTimeDefault
        },
        income: {
            queryKey: ['accounts', 'external', 'income', 'archived'],
            queryFn: getAccounts({ kind: [Kind.ExternalIncome], archived: true }),
            staleTime: staleTimeDefault
        }
    }
}

export function accountQuery(id: string) {
    return {
        queryKey: ['accounts', 'details', id],
        queryFn: getAccount(id),
        staleTime: staleTimeDefault
    }
}