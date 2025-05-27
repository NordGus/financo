import { Currency } from "~/modules/shared/types/currency"
import { Filters } from "./filters"

export const DATE_FORMAT = "yyyy-MM-dd"

export type TransactionRecord = {
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  issuedAt: Date
  executedAt: Date | null | undefined
  notes: string | null | undefined,
  currency: Currency,
  kind: Kind
}

export const KINDS = {
  expense: "expense",
  income: "income",
  transfer: "transfer"
} as const

export type Kinds = typeof KINDS

export type Kind =
  Kinds["expense"] |
  Kinds["income"] |
  Kinds["transfer"]

export type Metadata = {
  kind: Kind
}

export type Transaction = {
  id: number
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  notes: string | null
  currency: Currency,
  issuedAt: string
  executedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string,
  metadata: Metadata
}

export interface ExecutedTransaction extends Transaction {
  executedAt: string
}

export interface PendingTransaction extends Transaction {
  executedAt: null
}

export type Period = "unlimited" | "daily" | "weekly" | "monthly" | "yearly" | "custom"

export type Transactions = [string, Transaction[]][]
export type ExecutedTransactions = [string, ExecutedTransaction[]][]
export type PendingTransactions = [string, PendingTransaction[]][]

export type SearchAction = (
  filter: Filters,
  abort: AbortSignal,
  success: () => void,
  failure: () => void
) => Promise<void>

export function mapToExecutedTransactions(transactions: Transaction[]): ExecutedTransactions {
  return Object.entries(
    transactions.filter(({ executedAt }) => executedAt !== null)
      .reduce<Record<string, ExecutedTransaction[]>>((acc, transaction) => {
        const executed = transaction as ExecutedTransaction
        const key = executed.executedAt

        if (!acc[key]) acc[key] = [{ ...executed }]
        else acc[key].push({ ...executed })

        return acc
      }, {}))
    .sort((a, b) => Date.parse(b[0]) - Date.parse(a[0]))
}

export function mapToPendingTransactions(transactions: Transaction[]): PendingTransactions {
  return Object.entries(
    transactions.filter(({ executedAt }) => executedAt === null)
      .reduce<Record<string, PendingTransaction[]>>((acc, transaction) => {
        const pending = transaction as PendingTransaction
        const key = pending.issuedAt

        if (!acc[key]) acc[key] = [{ ...pending }]
        else acc[key].push({ ...pending })

        return acc
      }, {}))
    .sort((a, b) => Date.parse(a[0]) - Date.parse(b[0]))
}
