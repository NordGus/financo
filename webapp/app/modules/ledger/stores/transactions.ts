import { create as createStore } from "zustand";
import { list as listAccountsQuery } from "../api/queries/accounts/list";
import { list as listTransactionsQuery } from "../api/queries/transactions/list";
import { Account } from "../types/accounts";
import { Filters, Transaction, Transactions } from "../types/transactions";

interface TransactionsState {
  transactions: Transactions
  accounts: Map<number, Account>
  init: (filters: Filters, signal: AbortSignal) => Promise<void>,
  list: (filters: Filters, signal: AbortSignal) => Promise<void>
}

const useTransactionsStore = createStore<TransactionsState>((set) => ({
  transactions: [],
  accounts: new Map(),
  init: async (filters, signal) => {
    const [transactions, accounts] = await Promise.allSettled([
      listTransactionsQuery(filters, signal),
      listAccountsQuery(),
    ])

    if (signal.aborted) return;
    if (transactions.status !== "fulfilled") throw transactions
    if (accounts.status !== "fulfilled") throw accounts

    set({
      transactions: Object.entries(transactions.value.filter(({ executedAt }) => !!executedAt)
        .reduce<Record<string, Transaction[]>>((acc, transaction) => {
          if (!acc[transaction.executedAt!]) acc[transaction.executedAt!] = [{ ...transaction }]
          else acc[transaction.executedAt!].push({ ...transaction })

          return acc
        }, {}))
        .sort((a, b) => Date.parse(b[0]) - Date.parse(a[0])),
      accounts: new Map(accounts.value.map((account) => [account.id, account]))
    })
  },
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
}))

export { useTransactionsStore };
