import { create as createStore } from "zustand";
import { list as listAccountsQuery } from "../api/queries/accounts/list";
import { list as listTransactionsQuery } from "../api/queries/transactions/list";
import { Account } from "../types/accounts";
import { Filters, Transaction, Transactions } from "../types/transactions";

interface TransactionsState {
  transactions: Transactions
  accounts: Map<number, Account>
  list: (filters: Filters, signal: AbortSignal) => Promise<void>
  listAccounts: () => Promise<void>
}

const useTransactionsStore = createStore<TransactionsState>((set) => ({
  transactions: [],
  accounts: new Map(),
  list: async (filters, signal) => {
    const transactions = await listTransactionsQuery(filters, signal)

    if (signal.aborted) return;

    set({
      transactions: Object.entries(transactions.filter(({ executedAt }) => !!executedAt)
        .reduce<Record<string, Transaction[]>>((acc, transaction) => {
          if (!acc[transaction.executedAt!]) acc[transaction.executedAt!] = [{ ...transaction }]
          else acc[transaction.executedAt!].push({ ...transaction })

          return acc
        }, {}))
        .sort((a, b) => Date.parse(b[0]) - Date.parse(a[0]))
    })
  },
  listAccounts: async () => {
    const accounts = await listAccountsQuery()

    set({ accounts: new Map(accounts.map((account) => [account.id, account])) })
  },
}))

export { useTransactionsStore };
