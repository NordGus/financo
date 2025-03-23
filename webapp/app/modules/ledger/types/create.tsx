import { Currency } from "~/modules/shared/types/currency"
import { Kind } from "./transactions"

export type Create = {
  kind: Kind
  currency: Currency
  notes?: string | null
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number

}