import { Currency } from "~/modules/shared/types/currency"
import { Kind } from "./transactions"

export type Update = {
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
