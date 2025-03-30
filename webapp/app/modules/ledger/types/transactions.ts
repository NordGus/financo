import { Currency } from "~/modules/shared/types/currency"
import { Filters } from "./filters"

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

export type Period = "unlimited" | "daily" | "weekly" | "monthly" | "yearly" | "custom"

export type Transactions = [string, Transaction[]][]
export type ExecutedTransactions = [string, ExecutedTransaction[]][]

export type SearchAction = (
  filter: Filters,
  abort: AbortSignal,
  success: () => void,
  failure: () => void
) => Promise<void>
