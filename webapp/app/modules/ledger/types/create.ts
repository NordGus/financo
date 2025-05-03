import { Currency } from "~/modules/shared/types/currency"
import { Kind, Transaction } from "./transactions"

export type Create = {
  issuedAt: string // it is a date formatted YYYY-MM-DD
  executedAt?: string | null // it is a date formatted YYYY-MM-DD
  notes?: string | null
  currency: Currency
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  kind: Kind
}

type OnCreateTransactionSuccess = () => void
type OnCreateTransactionFailure = () => void

export type CreateTransactionAction =
  (values: Create, success: OnCreateTransactionSuccess, failure: OnCreateTransactionFailure) => Promise<Transaction>
export type OnSubmitCreateTransactionAction =
  (values: Create) => Promise<void>
